from __future__ import annotations
import uuid
import time
from typing import TypedDict, Annotated
import operator

from langgraph.graph import StateGraph, END, START
from langgraph.types import Send

from agents.regulation import regulation_agent
from agents.contract import contract_agent
from agents.investment import investment_agent
from agents.monitoring import monitoring_agent
from agents.risk import risk_agent
from agents.policy import policy_agent
from agents.audit import audit_agent
from rag.pipeline import retrieve, format_context
from config import settings
from groq import Groq

AGENT_MAP = {
    "regulation-intelligence": regulation_agent,
    "contract-intelligence": contract_agent,
    "investment-compliance": investment_agent,
    "real-time-monitoring": monitoring_agent,
    "risk-prediction": risk_agent,
    "policy-intelligence": policy_agent,
    "audit": audit_agent,
}

ROUTER_SYSTEM = """You are the Orchestrator Agent for AwareGent. Your job is to classify compliance queries \
and route them to the correct specialist agents.

Given a query, respond with a JSON array of agent IDs to invoke. Choose from:
- "regulation-intelligence": regulation text, legal obligations, deadlines
- "contract-intelligence": contract analysis, clause review, agreement risks
- "investment-compliance": pre/post-trade checks, mandate compliance, fund limits
- "real-time-monitoring": transaction monitoring, AML, sanctions, suspicious activity
- "risk-prediction": risk forecasting, LCR prediction, breach probability
- "policy-intelligence": internal policy review, gap analysis, policy updates
- "audit": report generation, audit trails, regulatory submissions

Respond ONLY with a JSON array like: ["regulation-intelligence", "risk-prediction"]
For general compliance queries, use: ["regulation-intelligence"]
For complex cross-domain queries, include up to 3 agents."""

AGGREGATOR_SYSTEM = """You are the Orchestrator Agent for AwareGent. You have received outputs from \
multiple specialist AI compliance agents. Your job is to synthesize these into a single, coherent, \
comprehensive compliance response.

Instructions:
- Combine insights from all agents without repeating information
- Resolve any conflicts between agent outputs (prefer more conservative interpretation)
- Maintain all regulatory citations
- Structure the final response clearly with headers
- End with a "Recommended Actions" section that prioritizes actions by urgency"""


class OrchestratorState(TypedDict):
    query: str
    context_document: str | None
    agents_to_invoke: list[str]
    agent_outputs: Annotated[dict[str, str], lambda x, y: {**x, **y}]
    final_response: str
    citations: list[dict]
    workflow_steps: list[dict]


def classify_and_route(state: OrchestratorState) -> OrchestratorState:
    client = Groq(api_key=settings.groq_api_key)
    msg = client.chat.completions.create(
        model=settings.llm_model,
        max_tokens=256,
        reasoning_format="hidden",
        messages=[
            {"role": "system", "content": ROUTER_SYSTEM},
            {"role": "user", "content": state["query"]},
        ],
    )
    import json, re
    text = msg.choices[0].message.content.strip()
    match = re.search(r"\[.*?\]", text, re.DOTALL)
    if match:
        try:
            agents = json.loads(match.group())
            agents = [a for a in agents if a in AGENT_MAP]
        except Exception:
            agents = ["regulation-intelligence"]
    else:
        agents = ["regulation-intelligence"]

    step = {
        "id": "step-router",
        "name": "Query Classification & Routing",
        "status": "completed",
        "agent_id": "orchestrator",
        "output": f"Routing to: {', '.join(agents)}",
        "duration_sec": 1.0,
    }
    return {
        **state,
        "agents_to_invoke": agents,
        "workflow_steps": state.get("workflow_steps", []) + [step],
    }


def route_to_agents(state: OrchestratorState):
    return [Send(f"run_{agent_id.replace('-', '_')}", state) for agent_id in state["agents_to_invoke"]]


def make_agent_node(agent_id: str):
    def node(state: OrchestratorState) -> OrchestratorState:
        agent = AGENT_MAP[agent_id]
        t0 = time.time()
        result = agent.run(state["query"], context_document=state.get("context_document"))
        duration = round(time.time() - t0, 2)
        step = {
            "id": f"step-{agent_id}",
            "name": agent.name,
            "status": "completed",
            "agent_id": agent_id,
            "output": result["response"][:300] + "..." if len(result["response"]) > 300 else result["response"],
            "duration_sec": duration,
        }
        return {
            **state,
            "agent_outputs": {agent_id: result["response"]},
            "citations": state.get("citations", []) + result.get("citations", []),
            "workflow_steps": state.get("workflow_steps", []) + [step],
        }
    return node


def aggregate(state: OrchestratorState) -> OrchestratorState:
    outputs = state.get("agent_outputs", {})
    if len(outputs) == 1:
        # Single agent: return directly
        final = list(outputs.values())[0]
    else:
        client = Groq(api_key=settings.groq_api_key)
        combined = "\n\n---\n\n".join(
            f"## {AGENT_MAP[aid].name} Output\n{output}"
            for aid, output in outputs.items()
            if aid in AGENT_MAP
        )
        msg = client.chat.completions.create(
            model=settings.llm_model,
            max_tokens=3000,
            reasoning_format="hidden",
            messages=[
                {"role": "system", "content": AGGREGATOR_SYSTEM},
                {"role": "user", "content": f"Original Query: {state['query']}\n\n{combined}"},
            ],
        )
        final = msg.choices[0].message.content

    step = {
        "id": "step-aggregator",
        "name": "Response Synthesis",
        "status": "completed",
        "agent_id": "orchestrator",
        "output": "Final compliance response synthesized.",
        "duration_sec": 1.0,
    }
    return {
        **state,
        "final_response": final,
        "workflow_steps": state.get("workflow_steps", []) + [step],
    }


def build_orchestrator_graph() -> StateGraph:
    graph = StateGraph(OrchestratorState)
    graph.add_node("classify_and_route", classify_and_route)
    graph.add_node("aggregate", aggregate)

    for agent_id in AGENT_MAP:
        node_name = f"run_{agent_id.replace('-', '_')}"
        graph.add_node(node_name, make_agent_node(agent_id))
        graph.add_edge(node_name, "aggregate")

    graph.add_edge(START, "classify_and_route")
    graph.add_conditional_edges("classify_and_route", route_to_agents)
    graph.add_edge("aggregate", END)
    return graph.compile()


_orchestrator_graph = None


def get_orchestrator():
    global _orchestrator_graph
    if _orchestrator_graph is None:
        _orchestrator_graph = build_orchestrator_graph()
    return _orchestrator_graph


def run_orchestrator(query: str, context_document: str | None = None) -> dict:
    graph = get_orchestrator()
    initial_state: OrchestratorState = {
        "query": query,
        "context_document": context_document,
        "agents_to_invoke": [],
        "agent_outputs": {},
        "final_response": "",
        "citations": [],
        "workflow_steps": [],
    }
    result = graph.invoke(initial_state)
    return result

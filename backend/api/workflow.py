import uuid
import time
from fastapi import APIRouter, HTTPException
from models.schemas import WorkflowRunRequest, WorkflowRunResponse, WorkflowStep
from agents.orchestrator import AGENT_MAP, run_orchestrator
from agents.base import BaseComplianceAgent

router = APIRouter(prefix="/workflow", tags=["workflow"])

WORKFLOW_TEMPLATES = {
    "regulation-analysis": {
        "name": "Regulation Analysis Workflow",
        "agents": ["regulation-intelligence", "policy-intelligence"],
        "query_template": "Analyze the following regulation and extract all compliance obligations, deadlines, and required actions: {input}",
    },
    "contract-review": {
        "name": "Contract Compliance Review",
        "agents": ["contract-intelligence", "regulation-intelligence"],
        "query_template": "Review this contract for compliance risks and regulatory conflicts: {input}",
    },
    "risk-assessment": {
        "name": "Predictive Risk Assessment",
        "agents": ["risk-prediction", "real-time-monitoring"],
        "query_template": "Perform a comprehensive risk assessment for: {input}",
    },
    "investment-pre-trade": {
        "name": "Investment Pre-Trade Compliance Check",
        "agents": ["investment-compliance", "risk-prediction"],
        "query_template": "Perform pre-trade compliance check for this investment order: {input}",
    },
    "aml-investigation": {
        "name": "AML Transaction Investigation",
        "agents": ["real-time-monitoring", "audit"],
        "query_template": "Investigate this transaction for AML/CFT compliance: {input}",
    },
    "compliance-report": {
        "name": "Quarterly Compliance Report Generation",
        "agents": ["audit", "risk-prediction", "regulation-intelligence"],
        "query_template": "Generate a quarterly compliance report for: {input}",
    },
}


@router.post("/run", response_model=WorkflowRunResponse)
async def run_workflow(req: WorkflowRunRequest):
    template = WORKFLOW_TEMPLATES.get(req.workflow_type)
    if not template:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown workflow type '{req.workflow_type}'. Valid types: {list(WORKFLOW_TEMPLATES.keys())}",
        )

    workflow_id = f"wf-{uuid.uuid4().hex[:8]}"
    input_text = req.input_data.get("text", req.entity_ref)
    query = template["query_template"].format(input=input_text)

    steps: list[WorkflowStep] = []
    agents_invoked: list[str] = []
    all_outputs: list[str] = []
    t_start = time.time()

    # Step 1: Initialization
    steps.append(WorkflowStep(
        id=f"{workflow_id}-step-0",
        name="Workflow Initialization",
        status="completed",
        agent_id="orchestrator",
        output=f"Workflow '{template['name']}' initialized for: {req.entity_ref}",
        duration_sec=0.1,
    ))

    # Step 2: RAG retrieval
    from rag.pipeline import retrieve, format_context
    t_rag = time.time()
    chunks = retrieve(query, top_k=4)
    rag_duration = round(time.time() - t_rag, 2)
    steps.append(WorkflowStep(
        id=f"{workflow_id}-step-rag",
        name="Knowledge Base Retrieval (RAG)",
        status="completed",
        agent_id="orchestrator",
        output=f"Retrieved {len(chunks)} relevant chunks from knowledge base.",
        duration_sec=rag_duration,
    ))

    context = format_context(chunks)

    # Step 3: Execute each agent
    for agent_id in template["agents"]:
        agent = AGENT_MAP.get(agent_id)
        if not agent:
            continue
        agents_invoked.append(agent_id)
        t_agent = time.time()

        user_msg = query
        if req.input_data.get("document"):
            user_msg = f"## Document\n{req.input_data['document']}\n\n## Task\n{query}"

        response = agent._call_llm(user_msg, extra_context=context)
        duration = round(time.time() - t_agent, 2)
        all_outputs.append(f"## {agent.name}\n{response}")

        steps.append(WorkflowStep(
            id=f"{workflow_id}-step-{agent_id}",
            name=agent.name,
            status="completed",
            agent_id=agent_id,
            output=response[:400] + "..." if len(response) > 400 else response,
            duration_sec=duration,
        ))

    # Step 4: Synthesis
    final_output = "\n\n---\n\n".join(all_outputs) if all_outputs else "No output generated."
    total_duration = round(time.time() - t_start, 2)

    steps.append(WorkflowStep(
        id=f"{workflow_id}-step-final",
        name="Response Synthesis",
        status="completed",
        agent_id="orchestrator",
        output="Workflow completed. Final compliance report synthesized.",
        duration_sec=0.5,
    ))

    return WorkflowRunResponse(
        workflow_id=workflow_id,
        name=template["name"],
        status="completed",
        steps=steps,
        agents_invoked=agents_invoked,
        duration_sec=total_duration,
        final_output=final_output,
    )


@router.get("/types")
async def list_workflow_types():
    return {
        "workflow_types": [
            {"id": k, "name": v["name"], "agents": v["agents"]}
            for k, v in WORKFLOW_TEMPLATES.items()
        ]
    }

import uuid
from fastapi import APIRouter, HTTPException
from models.schemas import AgentQueryRequest, AgentQueryResponse, AgentType, Citation
from agents.orchestrator import run_orchestrator, AGENT_MAP
from config import settings

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("/query", response_model=AgentQueryResponse)
async def query_agent(req: AgentQueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    workflow_id = f"wf-{uuid.uuid4().hex[:8]}"

    if req.agent == AgentType.orchestrator:
        result = run_orchestrator(req.query, context_document=req.context_document)
        return AgentQueryResponse(
            agent="orchestrator",
            query=req.query,
            response=result["final_response"],
            citations=[Citation(**c) for c in result.get("citations", [])],
            agents_invoked=result.get("agents_to_invoke", []),
            workflow_id=workflow_id,
        )
    else:
        agent = AGENT_MAP.get(req.agent.value)
        if not agent:
            raise HTTPException(status_code=404, detail=f"Agent '{req.agent}' not found.")
        result = agent.run(req.query, context_document=req.context_document)
        return AgentQueryResponse(
            agent=req.agent.value,
            query=req.query,
            response=result["response"],
            citations=[Citation(**c) for c in result.get("citations", [])],
            agents_invoked=[req.agent.value],
            workflow_id=workflow_id,
        )


@router.get("/status")
async def agents_status():
    return {
        "agents": [
            {
                "id": agent_id,
                "name": agent.name,
                "status": "active",
                "model": settings.llm_model,
            }
            for agent_id, agent in AGENT_MAP.items()
        ],
        "orchestrator": {"id": "orchestrator", "status": "active", "framework": "LangGraph"},
        "total": len(AGENT_MAP) + 1,
    }

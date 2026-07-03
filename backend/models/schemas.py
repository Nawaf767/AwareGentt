from pydantic import BaseModel
from typing import Any, Optional
from enum import Enum


class AgentType(str, Enum):
    orchestrator = "orchestrator"
    regulation = "regulation-intelligence"
    contract = "contract-intelligence"
    investment = "investment-compliance"
    monitoring = "real-time-monitoring"
    risk = "risk-prediction"
    policy = "policy-intelligence"
    audit = "audit"


class AgentQueryRequest(BaseModel):
    query: str
    agent: AgentType = AgentType.orchestrator
    context_document: Optional[str] = None  # raw text to analyze


class Citation(BaseModel):
    source: str
    article: Optional[str] = None
    excerpt: str
    relevance_score: float


class AgentQueryResponse(BaseModel):
    agent: str
    query: str
    response: str
    citations: list[Citation]
    agents_invoked: list[str]
    workflow_id: str


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    source_filter: Optional[str] = None


class SearchResult(BaseModel):
    id: str
    title: str
    excerpt: str
    source: str
    score: float
    article_ref: Optional[str] = None


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
    total: int


class IngestRequest(BaseModel):
    title: str
    content: str
    source: str
    article_ref: Optional[str] = None
    tags: list[str] = []


class IngestResponse(BaseModel):
    success: bool
    chunks_created: int
    document_id: str


class WorkflowStep(BaseModel):
    id: str
    name: str
    status: str
    agent_id: Optional[str] = None
    output: Optional[str] = None
    duration_sec: Optional[float] = None


class WorkflowRunRequest(BaseModel):
    workflow_type: str
    entity_ref: str
    input_data: dict[str, Any] = {}


class WorkflowRunResponse(BaseModel):
    workflow_id: str
    name: str
    status: str
    steps: list[WorkflowStep]
    agents_invoked: list[str]
    duration_sec: Optional[float] = None
    final_output: Optional[str] = None

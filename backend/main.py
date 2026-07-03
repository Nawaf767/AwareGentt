from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.agents import router as agents_router
from api.knowledge import router as knowledge_router, seed_knowledge_base
from api.workflow import router as workflow_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed the knowledge base with official regulatory documents on startup
    print("Seeding knowledge base with regulatory documents...")
    await seed_knowledge_base()
    print("Knowledge base ready.")
    yield


app = FastAPI(
    title="AwareGent API",
    description="AI-powered compliance management platform for Saudi financial institutions.",
    version="2.4.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router, prefix="/api")
app.include_router(knowledge_router, prefix="/api")
app.include_router(workflow_router, prefix="/api")


@app.get("/")
async def health():
    return {"status": "ok", "service": "AwareGent API", "version": "2.4.0"}


@app.get("/api/health")
async def api_health():
    from rag.pipeline import get_kb_stats
    from config import settings
    stats = get_kb_stats()
    return {
        "status": "healthy",
        "knowledge_base": stats,
        "agents": 8,
        "framework": f"LangGraph + Groq {settings.llm_model}",
    }

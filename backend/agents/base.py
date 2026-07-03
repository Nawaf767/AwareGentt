from __future__ import annotations
from groq import Groq
from config import settings
from rag.pipeline import retrieve, format_context
from models.schemas import Citation


class BaseComplianceAgent:
    agent_id: str = "base"
    name: str = "Base Agent"
    system_prompt: str = "You are a compliance assistant."

    def __init__(self):
        self._client = Groq(api_key=settings.groq_api_key)

    def _call_llm(self, user_message: str, extra_context: str = "") -> str:
        full_system = self.system_prompt
        if extra_context:
            full_system += f"\n\n## Retrieved Knowledge Base Context\n{extra_context}"

        response = self._client.chat.completions.create(
            model=settings.llm_model,
            max_tokens=2048,
            reasoning_format="hidden",
            messages=[
                {"role": "system", "content": full_system},
                {"role": "user", "content": user_message},
            ],
        )
        return response.choices[0].message.content

    def _build_citations(self, chunks: list[dict]) -> list[Citation]:
        return [
            Citation(
                source=c["source"],
                article=c.get("article_ref") or None,
                excerpt=c["text"][:200],
                relevance_score=round(c["score"], 3),
            )
            for c in chunks
        ]

    def run(self, query: str, context_document: str | None = None) -> dict:
        chunks = retrieve(query, top_k=5)
        context = format_context(chunks)

        user_msg = query
        if context_document:
            user_msg = f"## Document to Analyze\n{context_document}\n\n## Query\n{query}"

        response = self._call_llm(user_msg, extra_context=context)
        citations = self._build_citations(chunks)

        return {
            "agent": self.agent_id,
            "response": response,
            "citations": [c.model_dump() for c in citations],
        }

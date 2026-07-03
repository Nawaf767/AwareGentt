from __future__ import annotations
import uuid
from functools import lru_cache
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
)
from config import settings

VECTOR_SIZE = 384  # all-MiniLM-L6-v2 output dimension


@lru_cache(maxsize=1)
def get_qdrant_client() -> QdrantClient:
    if settings.qdrant_in_memory:
        return QdrantClient(":memory:")
    return QdrantClient(host=settings.qdrant_host, port=settings.qdrant_port)


def ensure_collection():
    client = get_qdrant_client()
    existing = [c.name for c in client.get_collections().collections]
    if settings.collection_name not in existing:
        client.create_collection(
            collection_name=settings.collection_name,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )


def upsert_chunks(chunks: list[dict]) -> int:
    client = get_qdrant_client()
    ensure_collection()
    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=chunk["vector"],
            payload={
                "text": chunk["text"],
                "title": chunk.get("title", ""),
                "source": chunk.get("source", ""),
                "article_ref": chunk.get("article_ref", ""),
                "tags": chunk.get("tags", []),
                "document_id": chunk.get("document_id", ""),
            },
        )
        for chunk in chunks
    ]
    client.upsert(collection_name=settings.collection_name, points=points)
    return len(points)


def search(query_vector: list[float], top_k: int = 5, source_filter: str | None = None) -> list[dict]:
    client = get_qdrant_client()
    ensure_collection()

    search_filter = None
    if source_filter:
        search_filter = Filter(
            must=[FieldCondition(key="source", match=MatchValue(value=source_filter))]
        )

    # qdrant-client >= 1.7 uses query_points; fall back to legacy search
    try:
        response = client.query_points(
            collection_name=settings.collection_name,
            query=query_vector,
            limit=top_k,
            query_filter=search_filter,
            with_payload=True,
        )
        results = response.points
    except AttributeError:
        results = client.search(  # type: ignore[attr-defined]
            collection_name=settings.collection_name,
            query_vector=query_vector,
            limit=top_k,
            query_filter=search_filter,
            with_payload=True,
        )

    return [
        {
            "id": str(r.id),
            "text": r.payload.get("text", ""),
            "title": r.payload.get("title", ""),
            "source": r.payload.get("source", ""),
            "article_ref": r.payload.get("article_ref", ""),
            "tags": r.payload.get("tags", []),
            "score": r.score,
        }
        for r in results
    ]


def get_collection_count() -> int:
    client = get_qdrant_client()
    ensure_collection()
    info = client.get_collection(settings.collection_name)
    # points_count is on config.params in newer qdrant-client versions
    count = getattr(info, "points_count", None)
    if count is None:
        try:
            count = info.config.params.vectors.size  # type: ignore[attr-defined]
        except Exception:
            count = 0
    return count or 0

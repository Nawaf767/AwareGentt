from __future__ import annotations
import uuid
import re
from rag.embeddings import embed_texts, embed_query
from rag.vector_store import upsert_chunks, search, get_collection_count


def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> list[str]:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    chunks, current, count = [], [], 0
    for sentence in sentences:
        words = sentence.split()
        if count + len(words) > chunk_size and current:
            chunks.append(" ".join(current))
            # Overlap: keep last N words
            overlap_words = current[-overlap:] if len(current) > overlap else current
            current = list(overlap_words)
            count = len(current)
        current.extend(words)
        count += len(words)
    if current:
        chunks.append(" ".join(current))
    return chunks


def ingest_document(
    title: str,
    content: str,
    source: str,
    article_ref: str = "",
    tags: list[str] | None = None,
) -> dict:
    doc_id = str(uuid.uuid4())
    raw_chunks = chunk_text(content)
    vectors = embed_texts(raw_chunks)
    chunk_records = [
        {
            "text": chunk,
            "title": title,
            "source": source,
            "article_ref": article_ref,
            "tags": tags or [],
            "document_id": doc_id,
            "vector": vectors[i],
        }
        for i, chunk in enumerate(raw_chunks)
    ]
    count = upsert_chunks(chunk_records)
    return {"document_id": doc_id, "chunks_created": count}


def retrieve(query: str, top_k: int = 5, source_filter: str | None = None) -> list[dict]:
    qv = embed_query(query)
    return search(qv, top_k=top_k, source_filter=source_filter)


def format_context(chunks: list[dict]) -> str:
    parts = []
    for i, c in enumerate(chunks, 1):
        ref = f" [{c['article_ref']}]" if c.get("article_ref") else ""
        parts.append(f"[{i}] Source: {c['source']}{ref}\n{c['text']}")
    return "\n\n".join(parts)


def get_kb_stats() -> dict:
    return {"total_chunks": get_collection_count()}

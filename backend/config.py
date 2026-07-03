from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    groq_api_key: str = ""
    qdrant_in_memory: bool = True
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    embedding_model: str = "all-MiniLM-L6-v2"
    llm_model: str = "qwen/qwen3.6-27b"
    collection_name: str = "awaregent_kb"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

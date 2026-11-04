import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CraveSwap AI – Your Junk Food Twin"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "craveswap_super_secret_jwt_key_2026_change_in_production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database: Default to SQLite local file, but allow PostgreSQL via env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./craveswap.db")
    
    # AI Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    class Config:
        case_sensitive = True

settings = Settings()

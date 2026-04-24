from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "ClearFix API"
    
    # Supabase Settings
    SUPABASE_URL: str
    SUPABASE_KEY: str

    # Telegram Bot Settings
    TELEGRAM_BOT_TOKEN: str
    
    # URL for bot webhook (e.g., https://your-cloudflare-tunnel.trycloudflare.com)
    WEBHOOK_URL: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

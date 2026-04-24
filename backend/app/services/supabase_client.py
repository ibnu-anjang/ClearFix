from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    """
    Creates and returns a Supabase client instance.
    If SUPABASE_URL or SUPABASE_KEY are not set (e.g. at build time without .env),
    it returns None or handles the error gracefully.
    """
    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_KEY
    
    if not url or not key:
        raise ValueError("Supabase URL and Key must be set in Environment Variables")
        
    return create_client(url, key)

# Create a singleton client to be used across the application
try:
    supabase: Client = get_supabase_client()
except ValueError:
    supabase = None
    print("Warning: Supabase credentials not found. Supabase client is uninitialized.")

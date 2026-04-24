from fastapi import APIRouter, HTTPException
from app.schemas.user import UserLogin, UserResponse
from app.services.supabase_client import supabase

router = APIRouter()

@router.post("/login", response_model=UserResponse)
async def login(credentials: UserLogin):
    """
    Simpel login menggunakan `nama` sesuai dengan konsep MVP.
    Mencari user di database warga (Supabase) berasarkan input nama.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client not initialized")
        
    response = supabase.table("users").select("*").eq("nama", credentials.nama).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=401, detail="Akun dengan nama tersebut tidak ditemukan")
        
    user_data = response.data[0]
    return user_data

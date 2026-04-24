from fastapi import APIRouter, HTTPException
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel
from app.services.supabase_client import supabase
from app.schemas.user import UserResponse

router = APIRouter()

class UserCreateUpdate(BaseModel):
    nama: str
    role: str
    telegram_id: Optional[str] = None
    category_access: List[str] = []

@router.get("/", response_model=List[UserResponse])
async def get_all_users():
    if not supabase:
        raise HTTPException(status_code=500, detail="DB Client Error")
    res = supabase.table("users").select("*").execute()
    return res.data

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreateUpdate):
    res = supabase.table("users").insert(user.model_dump()).execute()
    return res.data[0]

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: UUID, user: UserCreateUpdate):
    res = supabase.table("users").update(user.model_dump()).eq("id", str(user_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="User not found")
    return res.data[0]

@router.delete("/{user_id}")
async def delete_user(user_id: UUID):
    supabase.table("users").delete().eq("id", str(user_id)).execute()
    return {"message": "User deleted successfully"}

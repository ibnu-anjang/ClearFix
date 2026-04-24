from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class UserLogin(BaseModel):
    nama: str
    
class UserResponse(BaseModel):
    id: UUID
    nama: str
    role: str
    telegram_id: Optional[str] = None
    category_access: Optional[List[str]] = []
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

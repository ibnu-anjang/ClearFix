from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.core.config import settings

class ReportCreate(BaseModel):
    user_id: UUID
    judul: str
    deskripsi: Optional[str] = None
    tag_kategori: str
    foto_masalah_url: Optional[str] = None
    
    @field_validator("foto_masalah_url")
    def validate_supabase_url(cls, v):
        if v is not None:
            # Menggunakan host/domain dari SUPABASE_URL sebagai validasi dasar.
            # settings.SUPABASE_URL formatnya seperti https://xyzxyz.supabase.co
            base_domain = settings.SUPABASE_URL.replace("https://", "").replace("http://", "").split("/")[0]
            if base_domain not in v:
                raise ValueError(f"Given URL does not match current Supabase domain: {base_domain}")
        return v

class ReportResponse(BaseModel):
    id: UUID
    user_id: UUID
    judul: str
    deskripsi: Optional[str] = None
    tag_kategori: str
    foto_masalah_url: Optional[str] = None
    foto_bukti_url: Optional[str] = None
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

from fastapi import APIRouter, HTTPException
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel
from app.schemas.report import ReportCreate, ReportResponse
from app.services.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[ReportResponse])
async def get_reports():
    """
    Mengambil list laporan.
    Data sudah bersih dari laporan yang lebih dari 7 hari karena akan dibuang oleh cron Cleanup.
    Mengurutkan dari yang paling baru.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client not initialized")
        
    response = supabase.table("reports").select("*").order("created_at", desc=True).execute()
    return response.data

@router.post("/", response_model=ReportResponse)
async def create_report(report: ReportCreate):
    """
    Membuat laporan baru dari user (Flutter app).
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client not initialized")
        
    data, count = supabase.table("reports").insert(report.model_dump(mode="json")).execute()
    
    if not data or len(data[1]) == 0:
        raise HTTPException(status_code=400, detail="Gagal menyimpan laporan ke database")
        
    # supabase-py v2 `insert().execute()` returns a tuple: (data_list, count)
    # The actual list of inserted objects is at index [1] if using older version, 
    # but for `supabase-py` v2.4.x, `.execute()` response object has `.data` which is a list.
    # Let's handle both possible return signatures safely.
    inserted_data = getattr(data, "data", data[1] if isinstance(data, tuple) else data)
    
    if not inserted_data or len(inserted_data) == 0:
         raise HTTPException(status_code=400, detail="Return data unreadable")
         
    return inserted_data[0]

class ReportUpdate(BaseModel):
    status: str
    foto_bukti_url: Optional[str] = None

@router.patch("/{report_id}", response_model=ReportResponse)
async def update_report_status(report_id: UUID, update: ReportUpdate):
    """
    Digunakan oleh Frontliner untuk menyelesaikan tugas.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="DB Client Error")
        
    res = supabase.table("reports").update(update.model_dump(exclude_unset=True)).eq("id", str(report_id)).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Report not found")
        
    return res.data[0]

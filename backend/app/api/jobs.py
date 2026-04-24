from fastapi import APIRouter, HTTPException
from app.services.cleanup import cleanup_old_reports

router = APIRouter()

@router.post("/run-cleanup")
async def run_cleanup_job():
    """
    Endpoint untuk menghapus data reports yang umurnya > 7 hari.
    
    CATATAN DEPLOYMENT:
    Saat sistem di-deploy ke production (misalnya ke VPS atau Cloud), 
    buatlah cron job di sistem operasi eksternal, atau gunakan platform cron (seperti cron-job.org / GitHub Actions) 
    untuk melakukan pemanggilan POST HTTP ke endpoint ini setiap hari pada jam tertentu.
    
    Contoh crontab (setiap tengah malam pukul 00:00):
    0 0 * * * curl -X POST https://api.domain.com/api/jobs/run-cleanup
    """
    result = cleanup_old_reports()
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return {"message": "Cleanup job executed successfully", "deleted_count": result.get("deleted_count")}

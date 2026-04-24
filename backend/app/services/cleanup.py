import datetime
from app.services.supabase_client import supabase

def cleanup_old_reports() -> dict:
    """
    Deletes reports that are older than 7 days.
    """
    if not supabase:
        return {"error": "Supabase client not initialized."}
        
    # Calculate the timestamp for 7 days ago
    seven_days_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=7)
    seven_days_ago_iso = seven_days_ago.isoformat()

    try:
        # Delete reports where created_at is less than (older than) 7 days ago
        response = supabase.table("reports").delete().lt("created_at", seven_days_ago_iso).execute()
        
        # response.data contains the deleted rows
        deleted_count = len(response.data) if response.data else 0
        
        # Jika ada data yang terhapus, kita hapus juga fiSik fotonya di Supabase Storage
        if response.data:
            bucket_name = "reports_bucket" # Nama bucket public di Supabase
            files_to_delete = []
            
            for row in response.data:
                for url_field in ["foto_masalah_url", "foto_bukti_url"]:
                    url = row.get(url_field)
                    if url and f"public/{bucket_name}/" in url:
                        # Mendapatkan relative-path dari sebuah url
                        file_path = url.split(f"public/{bucket_name}/")[-1]
                        files_to_delete.append(file_path)
            
            if files_to_delete:
                try:
                    supabase.storage.from_(bucket_name).remove(files_to_delete)
                except Exception as e:
                    print(f"Warning: Failed to delete files from storage {e}")

        return {"status": "success", "deleted_count": deleted_count}
    except Exception as e:
        return {"status": "error", "message": str(e)}

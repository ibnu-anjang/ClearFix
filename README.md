# ClearFix - Facility Management System

ClearFix adalah platform pelaporan fasilitas sekolah yang menghubungkan Staf/Guru (Pelapor) dengan Frontliner (OB/Satpam) melalui alur kerja yang terverifikasi.

## 🚀 Fitur Utama (MVP)
- **Verified Login**: Berdasarkan database warga SMK Nusa Bangsa.
- **Role-Based Views**: Interface berbeda untuk Staff, Admin, dan Frontliner.
- **Reporting System**: Laporan dengan kategori dan lampiran foto.
- **Cleanup Logic**: Otomatis menghapus data laporan (dan file storage) yang lebih dari 7 hari.
- **Storage Integration**: Integrasi langsung dengan Supabase Storage untuk performa maksimal.

## 🛠 Tech Stack
- **Backend**: FastAPI (Python) + Docker.
- **Database & Storage**: Supabase (PostgreSQL).
- **Frontend Tester**: Vanilla JS + CSS (Glassmorphism UI).

## 📦 Cara Instalasi & Menjalankan

### 1. Prasyarat
- Docker & Docker Compose terinstal.
- Akun Supabase (URL, Anon Key, dan Database yang sudah terinisialisasi).

### 2. Setup Database (Supabase)
Eksekusi konten di [backend/sql/init.sql](backend/sql/init.sql) di dalam SQL Editor Supabase Anda. Jangan lupa matikan RLS atau buat Policy seperti di instruksi `Walkthrough`.

### 3. Konfigurasi Environment
- Isi kredensial di `backend/.env`.
- Isi kredensial di `frontend/config.js`.

### 4. Menjalankan Server
```bash
# Jalankan Backend
docker compose up --build -d

# Jalankan Frontend Tester (Port 3000)
python3 -m http.server 3000 --directory frontend
```

## 📋 Analisis Gaps & Pengembangan Selanjutnya

Berikut adalah hal-hal yang belum ada di sistem saat ini:
1.  **Integrasi Bot Telegram**: Logika pengiriman notifikasi dari FastAPI ke Telegram tim Frontliner belum aktif.
2.  **API Security**: Saat ini endpoint API masih terbuka secara publik. Sebaiknya ditambahkan `API-KEY` atau `JWT Token` untuk keamanan di fase produksi.
3.  **Real-time Updates**: Saat ini user harus melakukan *refresh* manual. Bisa ditingkatkan dengan *WebSockets* atau *Supabase Realtime*.
4.  **Flutter Integration**: Versi Mobile aslinya (APK) belum mulai diproduksi.

---
Dikembangkan dalam mode MVP untuk simulasi alur 100%. ✨

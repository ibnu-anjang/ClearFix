# ClearFix - Comprehensive Technical & Product Blueprint V3.0

Dokumen ini merupakan cetak biru (blueprint) lengkap yang menggabungkan seluruh aspek pengembangan produk (PRD) dan persyaratan teknis (TRD) untuk sistem manajemen fasilitas sekolah ClearFix. Dokumen ini dirancang untuk eksekusi MVP dalam durasi 1 bulan.

## 1\. Product Requirements Document (PRD)

### 1.1 Ringkasan Produk

ClearFix adalah platform pelaporan fasilitas sekolah yang menghubungkan Staf/Guru (sebagai pelapor) dengan tim Frontliner (OB, Satpam, Teknisi) melalui alur kerja yang terverifikasi dan akuntabel.

### 1.2 Target Pengguna

- **Pelapor (Staf & Guru):** Menggunakan aplikasi Android (APK) untuk melaporkan kerusakan atau masalah fasilitas.
- **Frontliner (OB, Keamanan, Fasilitas):** Menggunakan Telegram Bot untuk menerima tugas dan memberikan bukti pengerjaan.
- **Admin Sekolah:** Memantau kinerja dan riwayat laporan melalui sistem backend/database.

### 1.3 Fitur Utama (MVP)

| Fitur                      | Deskripsi                                                                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verified Login             | Sistem mencocokkan data login dengan database warga SMK Nusa Bangsa. User luar tidak dapat mengakses sistem.                                                |
| ---                        | ---                                                                                                                                                         |
| Rolling Feed (7-Day Logic) | Beranda menampilkan laporan dari semua pengguna dalam 1 minggu terakhir. Laporan > 7 hari akan otomatis dihapus/disembunyikan untuk menjaga relevansi data. |
| ---                        | ---                                                                                                                                                         |
| Categorized Reporting      | Input laporan mencakup: Foto, Judul, Deskripsi, dan Tag Kategori (Keamanan, Fasilitas, Kebersihan).                                                         |
| ---                        | ---                                                                                                                                                         |
| Photo-Proof Verification   | Frontliner wajib mengunggah foto bukti hasil kerja melalui Telegram sebelum status laporan dinyatakan Selesai.                                              |
| ---                        | ---                                                                                                                                                         |

## 2\. Technical Requirements Document (TRD)

### 2.1 Core Tech Stack

- **Mobile Application:** Flutter (Target: Android APK). Dipilih untuk memfasilitasi kebutuhan staf dan guru yang mayoritas pengguna Android.
- **Backend & API:** FastAPI (Python). Digunakan untuk menangani logika asinkron Telegram Bot dan pemrosesan data pelaporan.
- **Database:** Supabase (PostgreSQL). Menangani penyimpanan data relasional, autentikasi, dan file storage (untuk foto).
- **Frontliner Interface:** Telegram Bot API. Integrasi cepat yang tidak mengharuskan frontliner menginstal aplikasi tambahan selain Telegram.
- **Infrastructure:** Docker untuk containerization dan Cloudflare Tunnel untuk pengujian webhook bot di lingkungan lokal.

### 2.2 Arsitektur Sistem

Sistem berjalan secara terpusat di Cloud. Saat laporan dibuat di aplikasi Android, backend FastAPI akan melakukan routing pesan ke Telegram Bot sesuai dengan kategori tugas yang dipilih (contoh: kategori 'Keamanan' akan dikirim ke Telegram tim Satpam).

## 3\. Database Schema (ERD)

Berikut adalah struktur tabel utama untuk mendukung relasi antar entitas:

| Tabel       | Kolom Penting                                                                                     | Fungsi                                                           |
| ----------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **users**   | id, nama, role, telegram_id, category_access\[\]                                                  | Validasi login dan routing pesan Telegram ke petugas yang tepat. |
| ---         | ---                                                                                               | ---                                                              |
| **reports** | id, user_id, judul, deskripsi, tag_kategori, foto_masalah_url, foto_bukti_url, status, created_at | Menyimpan detail pelaporan dan histori pengerjaan.               |
| ---         | ---                                                                                               | ---                                                              |

## 4\. Alur Operasional (Operational Flow)

### 4.1 Alur Pelapor (Staff/Guru)

- Login APK → Verifikasi Database → Akses Beranda.
- Cek Riwayat (Data 1 minggu terakhir).
- Klik "Buat Laporan" → Ambil Foto → Isi Judul & Deskripsi → Pilih Tag → Kirim.

### 4.2 Alur Frontliner (Telegram)

- Menerima notifikasi bot (berdasarkan kategori).
- Mengerjakan tugas di lokasi.
- Klik tombol "Sudah Dikerjakan" di Telegram.
- **Verifikasi:** Bot meminta foto bukti pengerjaan.
- Frontliner mengirim foto → Sistem memvalidasi → Status laporan berubah menjadi 'Selesai' di aplikasi pelapor.

## 5\. Roadmap Pengembangan (4 Minggu)

- **Minggu 1:** Setup Backend (FastAPI), Database (Supabase), dan logika Auto-Delete data > 7 hari.
- **Minggu 2:** Integrasi Telegram Bot API, pembuatan logika routing kategori, dan verifikasi bukti foto.
- **Minggu 3:** Pengembangan Frontend Flutter (Android APK) untuk fitur Login, Beranda, dan Form Laporan.
- **Minggu 4:** Testing E2E, perbaikan bug, dan deployment final ke server Cloud.

Dokumen ini merupakan acuan resmi pengembangan ClearFix V3.0. Seluruh perubahan teknis wajib didokumentasikan melalui version control.
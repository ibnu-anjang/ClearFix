-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- e.g., 'staff', 'frontliner', 'admin'
    telegram_id VARCHAR(100),
    category_access TEXT[] DEFAULT '{}', -- e.g., '{"Keamanan", "Fasilitas", "Kebersihan"}'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    tag_kategori VARCHAR(100) NOT NULL, -- e.g., 'Keamanan', 'Fasilitas', 'Kebersihan'
    foto_masalah_url TEXT,
    foto_bukti_url TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- e.g., 'Pending', 'Selesai'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for efficient 7-day query
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at);

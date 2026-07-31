-- ============================================================
-- AK Migration v7: Per-record customer complaint (public)
-- Run this in Supabase SQL Editor
-- ============================================================
ALTER TABLE service_records ADD COLUMN IF NOT EXISTS customer_complaint TEXT;

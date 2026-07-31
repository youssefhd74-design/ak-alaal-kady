-- ============================================================
-- AK Migration v6: Card complaint (public) + admin note (internal)
-- Run this in Supabase SQL Editor
-- ============================================================
ALTER TABLE car_cards ADD COLUMN IF NOT EXISTS customer_complaint TEXT;
ALTER TABLE car_cards ADD COLUMN IF NOT EXISTS admin_note TEXT;

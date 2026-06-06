-- ============================================================
-- AK Migration v2: Featured products + Product requests
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add is_featured to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Add image_url if missing
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Product requests table
CREATE TABLE IF NOT EXISTS product_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'seen', 'fulfilled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for product_requests
ALTER TABLE product_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert product requests" ON product_requests
  FOR INSERT WITH CHECK (TRUE);

-- Limit featured to 6 via application logic (not DB constraint)


-- ============================================================
-- AK - Alaal Kady: Full Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sku TEXT UNIQUE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_area TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','delivered','cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_area TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('maintenance','malfunction')),
  car_model TEXT NOT NULL,
  car_year TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SETTINGS (key-value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can read active products and categories
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (TRUE);

-- Public can insert orders and appointments (placing orders)
CREATE POLICY "Public insert orders" ON orders
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public insert appointments" ON appointments
  FOR INSERT WITH CHECK (TRUE);

-- Public can read settings (for WhatsApp number)
CREATE POLICY "Public read settings" ON settings
  FOR SELECT USING (TRUE);

-- Service role (admin API) bypasses RLS automatically

-- ============================================================
-- SEED DATA: Default settings
-- ============================================================
INSERT INTO settings (key, value) VALUES
  ('whatsapp_number', ''),
  ('business_name', 'AK - Alaal Kady'),
  ('business_address', 'القاهرة، مصر'),
  ('working_hours', 'السبت - الخميس: 9 صباحاً - 6 مساءً'),
  ('delivery_areas', 'المعادي، مدينة نصر، مصر الجديدة، التجمع، القاهرة الجديدة')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SEED DATA: Sample categories
-- ============================================================
INSERT INTO categories (name_ar, name_en) VALUES
  ('محرك وناقل الحركة', 'Engine & Transmission'),
  ('الفرامل والتعليق', 'Brakes & Suspension'),
  ('الكهرباء والإلكترونيات', 'Electrical & Electronics'),
  ('التبريد والتكييف', 'Cooling & AC'),
  ('الهيكل والمكملات', 'Body & Accessories'),
  ('الزيوت والسوائل', 'Oils & Fluids'),
  ('الإطارات والجنوط', 'Tires & Wheels')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: Sample products
-- ============================================================
INSERT INTO products (name_ar, name_en, description_ar, description_en, price, stock_quantity, sku, is_active)
VALUES
  ('زيت محرك موبيل 5W-40', 'Mobil 5W-40 Engine Oil', 'زيت محرك عالي الأداء للسيارات الحديثة', 'High performance engine oil for modern vehicles', 350, 50, 'OIL-MOB-5W40', TRUE),
  ('فلتر زيت رينو أصلي', 'Renault Original Oil Filter', 'فلتر زيت أصلي من رينو لجميع الموديلات', 'Original Renault oil filter for all models', 120, 30, 'FLT-OIL-RNL', TRUE),
  ('تيل فرامل أمامي', 'Front Brake Pads', 'تيل فرامل أمامي أصلي عالي الجودة', 'High quality original front brake pads', 450, 20, 'BRK-PAD-FRT', TRUE),
  ('بطارية 60 أمبير', '60 Amp Battery', 'بطارية سيارة 60 أمبير طويلة الأمد', '60 amp long-life car battery', 1200, 10, 'BAT-60AMP', TRUE),
  ('فلتر هواء رينو', 'Renault Air Filter', 'فلتر هواء أصلي لمحرك نظيف وقوي', 'Original air filter for clean powerful engine', 85, 40, 'FLT-AIR-RNL', TRUE)
ON CONFLICT (sku) DO NOTHING;

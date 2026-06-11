-- ============================================================
-- AK Migration v3: Car Health Cards
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS car_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  token UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  car_model TEXT NOT NULL,
  car_year TEXT,
  plate TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  card_id UUID REFERENCES car_cards(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  odometer_km INTEGER,
  services_performed TEXT NOT NULL,
  parts_replaced TEXT,
  next_service_date DATE,
  next_service_note TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_records_card ON service_records(card_id);
CREATE INDEX IF NOT EXISTS idx_car_cards_token ON car_cards(token);
CREATE INDEX IF NOT EXISTS idx_car_cards_phone ON car_cards(customer_phone);

ALTER TABLE car_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
-- No public policies: all access via server API (service role)

CREATE TRIGGER car_cards_updated_at BEFORE UPDATE ON car_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

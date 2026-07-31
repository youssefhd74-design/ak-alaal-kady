-- ============================================================
-- AK Migration v5: Performance indexes for scale (10K+ cards)
-- Run this in Supabase SQL Editor
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_car_cards_updated ON car_cards(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_records_card_date ON service_records(card_id, service_date DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);

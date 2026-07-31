-- ============================================================
-- AK Migration v4: User-based admin accounts with permissions
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner','staff')),
  permissions JSONB NOT NULL DEFAULT '{"products":true,"orders":true,"appointments":true,"requests":true,"health_cards":true,"settings":false,"can_delete":false}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- No public policies: all access via server API (service role)

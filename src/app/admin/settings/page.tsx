import { requireAdmin } from '@/lib/require-admin';
import { createAdminClient } from '@/lib/supabase';
import AdminSettingsClient from '@/components/admin/AdminSettingsClient';

export default async function AdminSettingsPage() {
  requireAdmin();
  const supabase = createAdminClient();
  const { data: settings } = await supabase.from('settings').select('*');
  const settingsMap = Object.fromEntries((settings || []).map((s) => [s.key, s.value]));

  return <AdminSettingsClient initialSettings={settingsMap} />;
}

import { createAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/require-admin';
import AdminSettingsClient from '@/components/admin/AdminSettingsClient';

export default async function AdminSettingsPage() {
  requireAdmin();
  const supabase = createAdminClient();
  const { data: settings } = await supabase.from('settings').select('*');
  const settingsMap = Object.fromEntries((settings || []).map((s: any) => [s.key, s.value]));
  return <AdminSettingsClient initialSettings={settingsMap} />;
}

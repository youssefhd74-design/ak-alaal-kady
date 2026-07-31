import { createAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/require-admin';
import AdminHealthCardsClient from '@/components/admin/AdminHealthCardsClient';

export default async function AdminHealthCardsPage() {
  await requireAdmin('health_cards');
  const supabase = createAdminClient();
  const { data: cards } = await supabase
    .from('car_cards')
    .select('*, service_records(*)')
    .order('updated_at', { ascending: false });
  return <AdminHealthCardsClient initialCards={cards || []} />;
}

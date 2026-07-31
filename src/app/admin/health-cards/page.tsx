import { createAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/require-admin';
import AdminHealthCardsClient from '@/components/admin/AdminHealthCardsClient';

export const dynamic = 'force-dynamic';
const PAGE_SIZE = 25;

export default async function AdminHealthCardsPage() {
  await requireAdmin('health_cards');
  const supabase = createAdminClient();
  const { data: cards, count } = await supabase
    .from('car_cards')
    .select('*, service_records(*)', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(0, PAGE_SIZE - 1);
  return <AdminHealthCardsClient
    initialCards={cards || []}
    initialTotal={count ?? 0}
    pageSize={PAGE_SIZE}
  />;
}

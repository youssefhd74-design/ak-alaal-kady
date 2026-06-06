import { createAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/require-admin';
import AdminOrdersClient from '@/components/admin/AdminOrdersClient';

export default async function AdminOrdersPage() {
  requireAdmin();
  const supabase = createAdminClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  return <AdminOrdersClient initialOrders={(orders || []) as any[]} />;
}

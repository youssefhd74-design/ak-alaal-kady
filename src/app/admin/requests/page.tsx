import { createAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/require-admin';
import AdminRequestsClient from '@/components/admin/AdminRequestsClient';

export default async function AdminRequestsPage() {
  requireAdmin();
  const supabase = createAdminClient();
  const { data: requests } = await supabase
    .from('product_requests')
    .select('*')
    .order('created_at', { ascending: false });
  return <AdminRequestsClient initialRequests={requests || []} />;
}

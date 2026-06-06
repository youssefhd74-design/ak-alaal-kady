import { requireAdmin } from '@/lib/require-admin';
import { createAdminClient } from '@/lib/supabase';
import AdminProductsClient from '@/components/admin/AdminProductsClient';

export default async function AdminProductsPage() {
  requireAdmin();
  const supabase = createAdminClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name_ar'),
  ]);

  return <AdminProductsClient initialProducts={products || []} categories={categories || []} />;
}

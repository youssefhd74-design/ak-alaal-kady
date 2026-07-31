import { createAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/require-admin';
import AdminProductsClient from '@/components/admin/AdminProductsClient';

export default async function AdminProductsPage() {
  await requireAdmin('products');
  const supabase = createAdminClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name_ar'),
  ]);
  return <AdminProductsClient initialProducts={products || []} categories={categories || []} />;
}

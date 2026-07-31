import { requireUserManager } from '@/lib/require-admin';
import { createAdminClient } from '@/lib/supabase';
import AdminUsersClient from '@/components/admin/AdminUsersClient';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const me = await requireUserManager();
  const db = createAdminClient();
  const { data: users } = await db
    .from('admin_users')
    .select('id, email, display_name, role, permissions, is_active, created_at')
    .order('created_at', { ascending: true });
  return <AdminUsersClient
    initialUsers={users || []}
    viewer={{ id: me.id, role: me.role, superadmin: me.role === 'owner' || !!me.permissions?.superadmin }}
  />;
}

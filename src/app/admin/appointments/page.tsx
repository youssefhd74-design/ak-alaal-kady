import { createAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/require-admin';
import AdminAppointmentsClient from '@/components/admin/AdminAppointmentsClient';

export default async function AdminAppointmentsPage() {
  await requireAdmin('appointments');
  const supabase = createAdminClient();
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('preferred_date', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(300);
  return <AdminAppointmentsClient initialAppointments={appointments || []} />;
}

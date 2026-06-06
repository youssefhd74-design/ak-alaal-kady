import { requireAdmin } from '@/lib/require-admin';
import { createAdminClient } from '@/lib/supabase';
import AdminAppointmentsClient from '@/components/admin/AdminAppointmentsClient';

export default async function AdminAppointmentsPage() {
  requireAdmin();
  const supabase = createAdminClient();
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('preferred_date', { ascending: true })
    .order('created_at', { ascending: false });

  return <AdminAppointmentsClient initialAppointments={appointments || []} />;
}

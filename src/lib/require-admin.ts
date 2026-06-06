import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function requireAdmin() {
  const cookieStore = cookies();
  const session = cookieStore.get('ak_admin_session');
  if (session?.value !== 'authenticated') {
    redirect('/admin-login');
  }
}

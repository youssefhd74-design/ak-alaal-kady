import { redirect } from 'next/navigation';
import { getSessionUser, hasPerm, PermKey, SessionUser } from '@/lib/session';

/**
 * Page guard for admin pages.
 * - No session -> redirect to login
 * - Missing tab permission -> redirect to /admin dashboard
 * Returns the session user.
 */
export async function requireAdmin(perm?: PermKey): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/admin-login');
  if (perm && !hasPerm(user, perm)) redirect('/admin');
  return user;
}

/** Owner-only pages (user management) */
export async function requireOwner(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/admin-login');
  if (user.role !== 'owner') redirect('/admin');
  return user;
}

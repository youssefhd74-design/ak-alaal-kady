import { redirect } from 'next/navigation';
import { getSessionUser, hasPerm, isSuperadmin, PermKey, SessionUser } from '@/lib/session';

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

/** User-management pages: owner or superadmin */
export async function requireUserManager(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/admin-login');
  if (!isSuperadmin(user)) redirect('/admin');
  return user;
}

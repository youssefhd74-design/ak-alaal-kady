import { cookies } from 'next/headers';
import { createHmac } from 'crypto';
import { createAdminClient } from '@/lib/supabase';

const COOKIE_NAME = 'ak_admin_session';

export type PermKey = 'products' | 'orders' | 'appointments' | 'requests' | 'health_cards' | 'settings';

export interface SessionUser {
  id: string;
  email: string;
  display_name: string;
  role: 'owner' | 'staff';
  permissions: Record<string, boolean>;
  is_active: boolean;
}

function secret(): string {
  return process.env.ADMIN_PASSWORD || 'ak-fallback-secret';
}

function sign(userId: string): string {
  return createHmac('sha256', secret()).update(userId).digest('hex');
}

/** Create the session cookie value for a user id */
export function makeSessionValue(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

/** Set the session cookie */
export function setSessionCookie(userId: string) {
  cookies().set(COOKIE_NAME, makeSessionValue(userId), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

/**
 * Read + verify the cookie, load the user from DB.
 * Returns null if missing, forged, unknown, or deactivated.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const raw = cookies().get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const dot = raw.lastIndexOf('.');
  if (dot === -1) return null;
  const userId = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (sig !== sign(userId)) return null; // forged cookie

  const db = createAdminClient();
  const { data: user } = await db
    .from('admin_users')
    .select('id, email, display_name, role, permissions, is_active')
    .eq('id', userId)
    .maybeSingle();

  if (!user || !user.is_active) return null;
  return user as SessionUser;
}

/** Does this user have a given tab permission? Owner always yes. */
export function hasPerm(user: SessionUser, perm: PermKey): boolean {
  if (user.role === 'owner') return true;
  return !!user.permissions?.[perm];
}

/** Can this user delete? Owner always yes. */
export function canDelete(user: SessionUser): boolean {
  if (user.role === 'owner') return true;
  return !!user.permissions?.can_delete;
}

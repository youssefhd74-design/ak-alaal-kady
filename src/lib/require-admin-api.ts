import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Returns a 401 NextResponse if the request lacks a valid admin session.
 * Returns null if authenticated (caller proceeds normally).
 *
 * Usage at the top of a protected route handler:
 *   const denied = requireAdminApi();
 *   if (denied) return denied;
 */
export function requireAdminApi(): NextResponse | null {
  const session = cookies().get('ak_admin_session');
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

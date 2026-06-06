import { cookies } from 'next/headers';

const COOKIE_NAME = 'ak_admin_session';
const SESSION_VALUE = 'authenticated';

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value === SESSION_VALUE;
}

export function setAdminSession() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

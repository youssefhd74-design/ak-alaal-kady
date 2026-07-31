import { NextResponse } from 'next/server';
import { getSessionUser, hasPerm, canDelete, PermKey } from '@/lib/session';

/**
 * Guard for admin API routes.
 * - No session -> 401
 * - Missing tab permission -> 403
 * - requireDelete && !can_delete -> 403
 * Returns null when allowed.
 *
 *   const denied = await requireAdminApi('products');
 *   if (denied) return denied;
 */
export async function requireAdminApi(perm?: PermKey, requireDelete = false): Promise<NextResponse | null> {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (perm && !hasPerm(user, perm)) {
    return NextResponse.json({ error: 'ليس لديك صلاحية لهذا القسم' }, { status: 403 });
  }
  if (requireDelete && !canDelete(user)) {
    return NextResponse.json({ error: 'ليس لديك صلاحية الحذف' }, { status: 403 });
  }
  return null;
}

/** Owner-only guard (user management) */
export async function requireOwnerApi(): Promise<NextResponse | null> {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'owner') return NextResponse.json({ error: 'Owner only' }, { status: 403 });
  return null;
}

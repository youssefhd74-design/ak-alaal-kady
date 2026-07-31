import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase';
import { getSessionUser, isSuperadmin } from '@/lib/session';

/**
 * Hierarchy rules (enforced here, UI mirrors them):
 * - Owner: can manage everyone except deleting/deactivating/demoting himself.
 * - Superadmin: can manage plain staff only — NOT the owner, NOT other superadmins.
 * - Only the owner can grant/revoke the superadmin flag.
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperadmin(me)) return NextResponse.json({ error: 'غير مسموح' }, { status: 403 });

  const db = createAdminClient();
  const { data: target } = await db.from('admin_users')
    .select('id, role, permissions').eq('id', params.id).maybeSingle();
  if (!target) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });

  const targetIsOwner = target.role === 'owner';
  const targetIsSuper = !!(target.permissions as any)?.superadmin;

  // Superadmins cannot touch the owner or fellow superadmins
  if (me.role !== 'owner' && (targetIsOwner || targetIsSuper)) {
    return NextResponse.json({ error: 'لا يمكنك تعديل هذا الحساب' }, { status: 403 });
  }

  const body = await request.json();
  const update: any = {};
  if (body.display_name !== undefined) update.display_name = body.display_name;
  if (body.new_password) update.password_hash = await bcrypt.hash(String(body.new_password), 10);
  if (body.is_active !== undefined && !targetIsOwner) update.is_active = body.is_active;

  if (body.permissions !== undefined) {
    const perms = { ...body.permissions };
    if (me.role !== 'owner') {
      // Preserve target's existing superadmin value — only owner can change it
      if (targetIsSuper) perms.superadmin = true; else delete perms.superadmin;
    }
    update.permissions = perms;
  }

  const { data, error } = await db.from('admin_users').update(update).eq('id', params.id)
    .select('id, email, display_name, role, permissions, is_active, created_at').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperadmin(me)) return NextResponse.json({ error: 'غير مسموح' }, { status: 403 });

  const db = createAdminClient();
  const { data: target } = await db.from('admin_users')
    .select('role, permissions').eq('id', params.id).maybeSingle();
  if (!target) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });

  if (target.role === 'owner') {
    return NextResponse.json({ error: 'لا يمكن حذف حساب المالك' }, { status: 403 });
  }
  if (me.role !== 'owner' && (target.permissions as any)?.superadmin) {
    return NextResponse.json({ error: 'لا يمكنك حذف مشرف عام' }, { status: 403 });
  }

  const { error } = await db.from('admin_users').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

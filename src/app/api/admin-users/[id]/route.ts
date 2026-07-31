import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase';
import { requireOwnerApi } from '@/lib/require-admin-api';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  const body = await request.json();
  const db = createAdminClient();

  // Never allow demoting/deactivating the owner account
  const { data: target } = await db.from('admin_users').select('role').eq('id', params.id).maybeSingle();
  if (!target) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });

  const update: any = {};
  if (body.display_name !== undefined) update.display_name = body.display_name;
  if (body.permissions !== undefined) update.permissions = body.permissions;
  if (body.is_active !== undefined && target.role !== 'owner') update.is_active = body.is_active;
  if (body.new_password) update.password_hash = await bcrypt.hash(String(body.new_password), 10);

  const { data, error } = await db.from('admin_users').update(update).eq('id', params.id)
    .select('id, email, display_name, role, permissions, is_active, created_at').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  const db = createAdminClient();
  const { data: target } = await db.from('admin_users').select('role').eq('id', params.id).maybeSingle();
  if (!target) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
  if (target.role === 'owner') return NextResponse.json({ error: 'لا يمكن حذف حساب المالك' }, { status: 403 });
  const { error } = await db.from('admin_users').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

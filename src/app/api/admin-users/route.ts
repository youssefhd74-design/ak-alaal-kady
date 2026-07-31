import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase';
import { getSessionUser, isSuperadmin } from '@/lib/session';

export async function GET() {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperadmin(me)) return NextResponse.json({ error: 'غير مسموح' }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from('admin_users')
    .select('id, email, display_name, role, permissions, is_active, created_at')
    .order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperadmin(me)) return NextResponse.json({ error: 'غير مسموح' }, { status: 403 });

  const body = await request.json();
  if (!body.email || !body.password || !body.display_name) {
    return NextResponse.json({ error: 'البريد وكلمة المرور والاسم مطلوبة' }, { status: 400 });
  }

  const permissions = { ...(body.permissions || {}) };
  // Only the owner can create a user with the superadmin flag
  if (me.role !== 'owner') delete permissions.superadmin;

  const db = createAdminClient();
  const hash = await bcrypt.hash(String(body.password), 10);
  const { data, error } = await db.from('admin_users').insert({
    email: String(body.email).trim().toLowerCase(),
    password_hash: hash,
    display_name: body.display_name,
    role: 'staff',
    permissions,
    is_active: true,
  }).select('id, email, display_name, role, permissions, is_active, created_at').single();
  if (error) {
    const msg = error.message.includes('duplicate') ? 'هذا البريد مسجل بالفعل' : error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

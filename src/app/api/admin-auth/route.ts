import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase';
import { setSessionCookie, clearSessionCookie, getSessionUser } from '@/lib/session';

/** POST = login. First-ever login bootstraps the owner account. */
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'البريد وكلمة المرور مطلوبان' }, { status: 400 });
  }
  const cleanEmail = String(email).trim().toLowerCase();
  const db = createAdminClient();

  // Bootstrap: if no users exist yet, the old ADMIN_PASSWORD creates the owner
  const { count } = await db.from('admin_users').select('*', { count: 'exact', head: true });
  if ((count ?? 0) === 0) {
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }
    const hash = await bcrypt.hash(password, 10);
    const { data: owner, error } = await db.from('admin_users').insert({
      email: cleanEmail,
      password_hash: hash,
      display_name: 'Owner',
      role: 'owner',
      permissions: { products: true, orders: true, appointments: true, requests: true, health_cards: true, settings: true, can_delete: true },
      is_active: true,
    }).select().single();
    if (error || !owner) return NextResponse.json({ error: 'فشل إنشاء حساب المالك' }, { status: 500 });
    setSessionCookie(owner.id);
    return NextResponse.json({ success: true, bootstrap: true });
  }

  // Normal login
  const { data: user } = await db
    .from('admin_users')
    .select('id, password_hash, is_active')
    .eq('email', cleanEmail)
    .maybeSingle();

  if (!user || !user.is_active) {
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
  }
  setSessionCookie(user.id);
  return NextResponse.json({ success: true });
}

/** GET = who am I (for the sidebar) */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    role: user.role,
    permissions: user.permissions,
  });
}

/** DELETE = logout */
export async function DELETE() {
  clearSessionCookie();
  return NextResponse.json({ success: true });
}

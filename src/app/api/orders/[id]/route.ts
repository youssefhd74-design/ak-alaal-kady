import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminApi } from '../../../../lib/require-admin-api';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdminApi('orders');
  if (denied) return denied;
  const body = await request.json();
  const db = createAdminClient();
  // Whitelist: admin can only change status (protects items/total/customer data)
  const update: any = {};
  if (body.status !== undefined) update.status = body.status;
  const { data, error } = await db.from('orders').update(update).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdminApi('orders', true);
  if (denied) return denied;
  const db = createAdminClient();
  const { error } = await db.from('orders').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

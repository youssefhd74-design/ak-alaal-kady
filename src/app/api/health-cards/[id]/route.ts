import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminApi } from '../../../../lib/require-admin-api';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdminApi('health_cards');
  if (denied) return denied;
  const body = await request.json();
  const db = createAdminClient();
  // Whitelist: only these fields can ever be updated (protects token/id)
  const update: any = {};
  for (const k of ['customer_name', 'customer_phone', 'car_model', 'car_year', 'plate', 'customer_complaint', 'admin_note']) {
    if (body[k] !== undefined) update[k] = body[k];
  }
  const { data, error } = await db.from('car_cards').update(update).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdminApi('health_cards', true);
  if (denied) return denied;
  const db = createAdminClient();
  const { error } = await db.from('car_cards').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

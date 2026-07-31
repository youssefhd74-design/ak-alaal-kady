import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminApi } from '../../../../lib/require-admin-api';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdminApi('health_cards');
  if (denied) return denied;
  const body = await request.json();
  const db = createAdminClient();
  const { data, error } = await db.from('service_records').update({
    service_date: body.service_date,
    odometer_km: body.odometer_km ? parseInt(body.odometer_km) : null,
    services_performed: body.services_performed,
    parts_replaced: body.parts_replaced || null,
    next_service_date: body.next_service_date || null,
    next_service_note: body.next_service_note || null,
    customer_complaint: body.customer_complaint || null,
    notes: body.notes || null,
  }).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdminApi('health_cards', true);
  if (denied) return denied;
  const db = createAdminClient();
  const { error } = await db.from('service_records').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

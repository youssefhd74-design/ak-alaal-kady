import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminApi } from '../../../../../lib/require-admin-api';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = requireAdminApi();
  if (denied) return denied;
  const body = await request.json();
  const db = createAdminClient();
  const { data, error } = await db.from('service_records').insert({
    card_id: params.id,
    service_date: body.service_date,
    odometer_km: body.odometer_km ? parseInt(body.odometer_km) : null,
    services_performed: body.services_performed,
    parts_replaced: body.parts_replaced || null,
    next_service_date: body.next_service_date || null,
    next_service_note: body.next_service_note || null,
    notes: body.notes || null,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Touch the card so it sorts to top
  await db.from('car_cards').update({ updated_at: new Date().toISOString() }).eq('id', params.id);

  return NextResponse.json(data, { status: 201 });
}

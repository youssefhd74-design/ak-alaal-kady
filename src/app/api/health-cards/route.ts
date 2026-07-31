import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminApi } from '../../../lib/require-admin-api';

export async function GET() {
  const denied = await requireAdminApi('health_cards');
  if (denied) return denied;
  const db = createAdminClient();
  const { data, error } = await db
    .from('car_cards')
    .select('*, service_records(*)')
    .order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi('health_cards');
  if (denied) return denied;
  const body = await request.json();
  const db = createAdminClient();
  const { data, error } = await db.from('car_cards').insert({
    customer_name: body.customer_name,
    customer_phone: body.customer_phone,
    car_model: body.car_model,
    car_year: body.car_year || null,
    plate: body.plate || null,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminApi } from '../../../lib/require-admin-api';

export async function GET(request: NextRequest) {
  const denied = await requireAdminApi('health_cards');
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(5, parseInt(searchParams.get('limit') || '25')));
  const from = (page - 1) * limit;

  const db = createAdminClient();
  let query = db
    .from('car_cards')
    .select('*, service_records(*)', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(from, from + limit - 1);

  if (q) {
    const term = `%${q}%`;
    query = query.or(
      `customer_name.ilike.${term},customer_phone.ilike.${term},plate.ilike.${term},car_model.ilike.${term}`
    );
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cards: data || [], total: count ?? 0, page, limit });
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

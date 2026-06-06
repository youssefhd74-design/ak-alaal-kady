import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const db = createAdminClient();
  const { data, error } = await db.from('appointments').insert({
    customer_name: body.customer_name,
    customer_phone: body.customer_phone,
    customer_area: body.customer_area,
    customer_address: body.customer_address,
    service_type: body.service_type,
    car_model: body.car_model,
    car_year: body.car_year || null,
    preferred_date: body.preferred_date,
    preferred_time: body.preferred_time || null,
    notes: body.notes || null,
    status: 'pending',
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

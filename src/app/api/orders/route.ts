import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const db = createAdminClient();
  const { data, error } = await db.from('orders').insert({
    customer_name: body.customer_name,
    customer_phone: body.customer_phone,
    customer_area: body.customer_area,
    customer_address: body.customer_address,
    items: body.items,
    total_price: body.total_price,
    notes: body.notes || null,
    status: 'pending',
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET() {
  const db = createAdminClient();
  const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

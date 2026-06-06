import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const db = createAdminClient();
  const { data, error } = await db.from('product_requests').insert({
    product_name: body.product_name,
    customer_name: body.customer_name,
    customer_phone: body.customer_phone,
    notes: body.notes || null,
    status: 'new',
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET() {
  const db = createAdminClient();
  const { data, error } = await db.from('product_requests').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

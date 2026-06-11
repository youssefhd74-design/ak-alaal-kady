import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(_: NextRequest, { params }: { params: { token: string } }) {
  const db = createAdminClient();
  const { data: card, error } = await db
    .from('car_cards')
    .select('customer_name, car_model, car_year, plate, created_at, service_records(*)')
    .eq('token', params.token)
    .single();
  if (error || !card) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(card);
}

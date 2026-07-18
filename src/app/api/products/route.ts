import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabase } from '@/lib/supabase';
import { requireAdminApi } from '../../../lib/require-admin-api';

export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const denied = requireAdminApi();
  if (denied) return denied;
  const body = await request.json();
  const db = createAdminClient();
  const { data, error } = await db.from('products').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

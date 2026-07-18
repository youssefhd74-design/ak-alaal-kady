import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabase } from '@/lib/supabase';
import { requireAdminApi } from '../../../lib/require-admin-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (key) {
    const { data } = await supabase.from('settings').select('value').eq('key', key).single();
    return NextResponse.json({ value: (data as any)?.value || '' });
  }
  const { data } = await supabase.from('settings').select('*');
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const denied = requireAdminApi();
  if (denied) return denied;
  const body = await request.json();
  const db = createAdminClient();
  const upserts = Object.entries(body).map(([key, value]) => ({ key, value: String(value) }));
  const { error } = await db.from('settings').upsert(upserts, { onConflict: 'key' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

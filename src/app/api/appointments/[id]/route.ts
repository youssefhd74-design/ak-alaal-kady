import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminApi } from '../../../../lib/require-admin-api';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = requireAdminApi();
  if (denied) return denied;
  const body = await request.json();
  const db = createAdminClient();
  const { data, error } = await db.from('appointments').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

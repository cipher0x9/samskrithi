import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getLocalDateISO } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tz = parseInt(searchParams.get('tz_offset') || '0', 10);
  const start = searchParams.get('start') || getLocalDateISO(tz);

  const days: Array<{date: string; panchanga: Record<string, unknown>; is_festival: boolean; special_note: string | null}> = [];
  const base = new Date(start);

  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);

    let p: Record<string, unknown> | null = null;
    try {
      const res = await supabaseServer.from('panchanga').select('*').eq('date', dateStr).maybeSingle();
      p = (res.data as Record<string, unknown>) || null;
    } catch {}

    const ps = p?.special as Record<string, unknown> | undefined;
    const isSpecial = !!(ps && (Object.keys(ps).length || (ps.festivals as unknown[])?.length));
    days.push({
      date: dateStr,
      panchanga: (p || { date: dateStr, tithi: '—', nakshatra: '—' }) as Record<string, unknown>,
      is_festival: isSpecial,
      special_note: (ps?.note as string) || (isSpecial ? 'Special day' : null),
    });
  }

  return NextResponse.json({ days });
}

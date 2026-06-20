import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getLocalDateISO } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tz = parseInt(searchParams.get('tz_offset') || '0', 10);
  const start = searchParams.get('start') || getLocalDateISO(tz);

  const days: any[] = [];
  const base = new Date(start);

  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);

    let p: any = null;
    try {
      const res = await supabaseServer.from('panchanga').select('*').eq('date', dateStr).maybeSingle();
      p = res.data;
    } catch {}

    const isSpecial = !!(p?.special && (Object.keys(p.special).length || p.special.festivals?.length));
    days.push({
      date: dateStr,
      panchanga: p || { date: dateStr, tithi: '—', nakshatra: '—' },
      is_festival: isSpecial,
      special_note: p?.special?.note || (isSpecial ? 'Special day' : null),
    });
  }

  return NextResponse.json({ days });
}

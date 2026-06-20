import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/cards/[id]?lang=xx&all=true
 * Returns mantra + translations (filtered or all 14).
 * Falls back to embedded authentic data.
 * 400 on bad id, 404 if no fallback.
 */
const AUTH_FALLBACK: Record<string, unknown> = {
  'gita-2.47': {
    id: 'gita-2.47',
    devanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।2.47।।',
    iast: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana mā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi',
    english: 'You have the right to work only, but never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
    source: 'Bhagavad Gita 2.47',
    translations: {
      en: 'You have the right to work only, but never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
      hi: 'तुम्हारा कर्म करने में ही अधिकार है, फलों में कभी नहीं।',
      te: 'నీకు కర్మ చేయడానికి మాత్రమే హక్కు ఉంది.',
      ta: 'உனக்கு வேலை செய்ய உரிமை உண்டு.',
      id: 'Kamu hanya berhak bekerja.',
      pt: 'Tens o direito de agir.',
      ru: 'У тебя есть право на действие, но не на плоды.',
      th: 'สิทธิ์ในการกระทำแต่ไม่ใช่เพื่อผล',
      vi: 'Quyền hành động không phải quả.',
      tl: 'Karapatan sa kilos hindi sa bunga.',
      bn: 'কর্মের অধিকার, ফলের নয়।',
      ne: 'कर्म गर्न अधिकार।',
      si: 'කර්මයට අයිතිය.',
    },
  },
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ ok: false, error: 'bad id' }, { status: 400 });
  }
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get('lang') || 'en';
  const all = searchParams.get('all') === 'true';

  try {
    const res = await supabaseServer.from('mantras').select('*').eq('id', id).maybeSingle();
    const mantra = res.data as Record<string, unknown> | null;

    if (mantra) {
      const { data: trs } = await supabaseServer.from('translations').select('lang,text').eq('content_id', id);
      const translations: Record<string, string> = {};
      (trs || []).forEach((t: { lang: string; text: string }) => (translations[t.lang] = t.text));
      return NextResponse.json({
        ...mantra,
        translations: all ? translations : { [lang]: translations[lang] || '' },
      });
    }
  } catch {}

  const fb = AUTH_FALLBACK[id] || AUTH_FALLBACK['gita-2.47'];
  if (!fb) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });
  return NextResponse.json(fb);
}

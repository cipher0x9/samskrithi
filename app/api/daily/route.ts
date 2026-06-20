import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { validateInitData } from '@/lib/tg';
import { getTodayISO } from '@/lib/utils';
import type { DailyPayload } from '@/lib/panchanga';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

// Real authentic content from corpus — gita-2.47 (never invented)
const AUTHENTIC_GITA_247 = {
  id: 'gita-2.47',
  devanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।2.47।।',
  iast: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana mā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi',
  english: 'You have the right to work only, but never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
  source: 'Bhagavad Gita 2.47',
};

const MOCK_TRANSLATIONS: Record<string, string> = {
  en: AUTHENTIC_GITA_247.english,
  hi: 'तुम्हारा कर्म करने में ही अधिकार है, फलों में कभी नहीं। कर्मफल का हेतु मत बनो, और अकर्मण्यता में भी आसक्ति मत रखो।',
  te: 'నీకు కర్మ చేయడానికి మాత్రమే హక్కు ఉంది, ఫలితాలకు కాదు. కర్మ ఫలం కోసం ఆశించకు.',
  ta: 'உனக்கு வேலை செய்ய உரிமை உண்டு; ஆனால் அதன் பலன்களுக்கு அல்ல.',
  id: 'Kamu hanya berhak bekerja, tetapi tidak untuk hasilnya.',
  pt: 'Tens o direito de agir, mas nunca aos frutos da ação.',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get('date') || getTodayISO();
  const initData = req.headers.get('x-telegram-init-data') || req.nextUrl.searchParams.get('initData') || '';

  let panchanga: Record<string, unknown> | null = null;
  let card: Record<string, unknown> | null = null;
  let translations: Record<string, string> = { ...MOCK_TRANSLATIONS };

  try {
    // Try real panchanga
    const pRes = await supabaseServer
      .from('panchanga')
      .select('*')
      .eq('date', dateStr)
      .maybeSingle();
    if (pRes.data) panchanga = pRes.data;

    // Try real mantra (prefer gita)
    const mRes = await supabaseServer
      .from('mantras')
      .select('id,devanagari,iast,english,source')
      .eq('id', 'gita-2.47')
      .maybeSingle();

    if (mRes.data) {
      card = mRes.data;
      const tRes = await supabaseServer
        .from('translations')
        .select('lang,text')
        .eq('content_id', card.id);
      if (tRes.data && tRes.data.length) {
        translations = {};
        (tRes.data as { lang: string; text: string }[]).forEach((t) => (translations[t.lang] = t.text));
      }
    } else {
      // Use embedded authentic
      card = AUTHENTIC_GITA_247;
    }
  } catch {
    // DB unavailable → full mock with real verse
    card = AUTHENTIC_GITA_247;
  }

  const free_card: DailyPayload['free_card'] = card
    ? ({ ...card, translations: Object.keys(translations).length ? translations : MOCK_TRANSLATIONS } as DailyPayload['free_card'])
    : null;

  const challenges = [
    { mode: 'akshara' as const, seed: (card?.id as string) || 'gita-2.47', target_chars: 14 },
    { mode: 'quiz' as const, seed: `panchanga-${dateStr}` },
    { mode: 'battle' as const, seed: 'demo' },
  ];

  let user = null;
  if (initData && BOT_TOKEN) {
    const v = validateInitData(initData, BOT_TOKEN);
    if (v.ok && v.user) {
      const { data } = await supabaseServer
        .from('users')
        .select('id, streak_current, xp, level, first_name')
        .eq('id', v.user.id)
        .maybeSingle();
      if (data) user = data;
    }
  }

  const payload: DailyPayload = {
    date: dateStr,
    panchanga: ((panchanga as unknown) as import('@/lib/panchanga').Panchanga) || {
      date: dateStr,
      tithi: 'कृष्ण नवमी',
      nakshatra: 'अश्विनी',
      yoga: 'वज्र',
      sunrise: '06:12',
      sunset: '18:45',
      deity_of_day: 'शनि',
    },
    free_card,
    challenges,
    user: user || { streak_current: 0, xp: 0, level: 'Prarambhika' },
  };

  return NextResponse.json({
    ...payload,
    free_card: free_card as DailyPayload['free_card'],
  });
}

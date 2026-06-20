import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { validateInitData } from '@/lib/tg';
import { getTodayISO, getLocalISODate } from '@/lib/utils';
import type { DailyPayload } from '@/lib/panchanga';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

/**
 * GET /api/daily?date=YYYY-MM-DD&tz_offset=330&initData=...
 * Returns panchanga + free_card (with 14-lang translations when available) + 3 challenges + user.
 * If tz_offset provided, computes effective local date for panchanga lookup (timezone-aware "today").
 * Mocks always available for dev without Supabase.
 */
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
  ru: 'У тебя есть право на действие, но не на плоды действия.',
  th: 'เจ้ามีสิทธิ์กระทำกรรม แต่ไม่ใช่เพื่อผลของกรรม',
  vi: 'Ngươi có quyền hành động, nhưng không phải vì quả của hành động.',
  tl: 'May karapatan kang kumilos ngunit hindi para sa bunga nito.',
  bn: 'কর্ম করার অধিকার আছে, ফলের অধিকার নেই।',
  ne: 'कर्म गर्न अधिकार छ, फलमा होइन।',
  si: 'කර්මය කිරීමට අයිතියක් ඇති නමුත් ඵලයට නොවේ.',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get('date');
  const tzStr = searchParams.get('tz_offset');
  const initData = req.headers.get('x-telegram-init-data') || searchParams.get('initData') || '';

  // Timezone-aware: prefer local date derived from tz_offset (minutes east of UTC)
  let dateStr: string;
  if (tzStr) {
    const off = parseInt(tzStr, 10);
    dateStr = !isNaN(off) ? getLocalISODate(off) : (dateParam || getTodayISO());
  } else {
    dateStr = dateParam || getTodayISO();
  }

  let panchanga: Record<string, unknown> | null = null;
  let card: Record<string, unknown> | null = null;
  let translations: Record<string, string> = { ...MOCK_TRANSLATIONS };

  try {
    const pRes = await supabaseServer.from('panchanga').select('*').eq('date', dateStr).maybeSingle();
    if (pRes.data) panchanga = pRes.data;

    const mRes = await supabaseServer
      .from('mantras')
      .select('id,devanagari,iast,english,source')
      .eq('id', 'gita-2.47')
      .maybeSingle();

    if (mRes.data) {
      card = mRes.data;
      const tRes = await supabaseServer.from('translations').select('lang,text').eq('content_id', (card as any).id); // eslint-disable-line @typescript-eslint/no-explicit-any
      if (tRes.data?.length) {
        translations = {};
        (tRes.data as { lang: string; text: string }[]).forEach((t) => (translations[t.lang] = t.text));
      }
    } else {
      card = AUTHENTIC_GITA_247;
    }
  } catch {
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
        .select('id, streak_current, xp, level, first_name, tz_offset, prefs, language_code')
        .eq('id', v.user.id)
        .maybeSingle();
      if (data) user = data;
    }
  }

  const payload: DailyPayload = {
    date: dateStr,
    panchanga: (panchanga as unknown as import('@/lib/panchanga').Panchanga) || {
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
    user: user || { streak_current: 0, xp: 0, level: 'Prarambhika', tz_offset: (tzStr ? parseInt(tzStr,10) || 0 : 0), prefs: {} },
  };

  return NextResponse.json(payload);
}

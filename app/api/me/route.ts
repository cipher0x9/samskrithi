import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { validateInitData } from '@/lib/tg';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

/**
 * GET /api/me
 * Requires valid initData. Returns profile + collection + mastered_letters.
 * Dev mock when no token.
 */
export async function GET(req: NextRequest) {
  const initData = req.headers.get('x-telegram-init-data') || '';

  if (!initData || !BOT_TOKEN) {
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({
        ok: true,
        user: { id: 123456789, first_name: 'Dev', xp: 342, streak_current: 7, level: 'Madhyama', tier: 'free' },
        collection: [{ id: 'gita-2.47', saved_at: new Date().toISOString() }],
        mastered: ['क', 'म', 'र'],
        _dev: true,
      });
    }
    return NextResponse.json({ ok: false, error: 'auth required' }, { status: 401 });
  }

  const v = validateInitData(initData, BOT_TOKEN);
  if (!v.ok || !v.user) {
    return NextResponse.json({ ok: false, error: 'bad initData' }, { status: 401 });
  }

  const userId = v.user.id;

  const { data: user } = await supabaseServer.from('users').select('*').eq('id', userId).maybeSingle();
  const { data: cards } = await supabaseServer
    .from('user_cards')
    .select('content_id, saved_at')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })
    .limit(12);

  return NextResponse.json({
    ok: true,
    user: user || v.user,
    collection: cards || [],
    mastered: (user as any)?.mastered_letters || [], // eslint-disable-line @typescript-eslint/no-explicit-any
  });
}

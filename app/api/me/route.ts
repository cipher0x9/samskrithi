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
        user: { id: 123456789, first_name: 'Dev', xp: 342, streak_current: 7, level: 'Madhyama', tier: 'free', tz_offset: 0, prefs: {}, language_code: 'en' },
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

/**
 * POST /api/me
 * Update user prefs / tz / language / name. Used by onboarding + theme toggle.
 * Body: { initData: string, tz_offset?: number, language_code?: string, first_name?: string, prefs?: Record<string,unknown> }
 * Merges prefs shallowly.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as {
      initData?: string;
      tz_offset?: number;
      language_code?: string;
      first_name?: string;
      prefs?: Record<string, unknown>;
    };
    const initData = body.initData || '';

    if (!initData || !BOT_TOKEN) {
      if (process.env.NODE_ENV !== 'production') {
        // dev mock: pretend updated
        return NextResponse.json({ ok: true, _dev: true, updated: { ...body } });
      }
      return NextResponse.json({ ok: false, error: 'auth required' }, { status: 401 });
    }

    const v = validateInitData(initData, BOT_TOKEN);
    if (!v.ok || !v.user) {
      return NextResponse.json({ ok: false, error: 'bad initData' }, { status: 401 });
    }

    const userId = v.user.id;
    const updates: Record<string, unknown> = { last_active: new Date().toISOString() };

    if (typeof body.tz_offset === 'number') updates.tz_offset = body.tz_offset;
    if (body.language_code) updates.language_code = body.language_code;
    if (body.first_name) updates.first_name = body.first_name;

    if (body.prefs && typeof body.prefs === 'object') {
      // fetch current to merge
      const { data: current } = await supabaseServer
        .from('users')
        .select('prefs')
        .eq('id', userId)
        .maybeSingle();
      const existing = (current?.prefs as Record<string, unknown>) || {};
      updates.prefs = { ...existing, ...body.prefs };
    }

    // upsert to ensure row (in case)
    await supabaseServer.from('users').upsert(
      { id: userId, ...updates },
      { onConflict: 'id' }
    );

    // return fresh snapshot
    const { data: user } = await supabaseServer.from('users').select('*').eq('id', userId).maybeSingle();
    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ ok: false, error: 'update_failed' }, { status: 500 });
  }
}

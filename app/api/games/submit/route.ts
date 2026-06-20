import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { validateInitData } from '@/lib/tg';
import { computeScore, computeLevel } from '@/lib/scoring';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

/**
 * POST /api/games/submit
 * Validates initData, computes XP via scoring engine, records session.
 * Expects triggers or follow-up to update user.xp/streak (here we optimistically return).
 * Dev: returns mock when no token.
 * Errors documented.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { initData, mode, seed, elapsed_sec, accuracy, meta = {} } = body as {
      initData?: string; mode?: string; seed?: string; elapsed_sec?: number; accuracy?: number; meta?: Record<string, unknown>;
    };

    if (!initData || typeof initData !== 'string') {
      if (process.env.NODE_ENV !== 'production' && !BOT_TOKEN) {
        return NextResponse.json({ ok: true, xp_earned: 58, new_streak: 3, total_xp: 142, level: 'Madhyama', level_up: false, _dev: true });
      }
      return NextResponse.json({ ok: false, error: 'initData required' }, { status: 400 });
    }

    const v = validateInitData(initData, BOT_TOKEN);
    if (!v.ok || !v.user) {
      return NextResponse.json({ ok: false, error: 'Invalid initData' }, { status: 401 });
    }

    const userId = v.user.id;

    const result = computeScore({
      mode: (mode as any) || 'akshara', // eslint-disable-line @typescript-eslint/no-explicit-any
      accuracy: typeof accuracy === 'number' ? accuracy : 0.8,
      elapsedSec: typeof elapsed_sec === 'number' ? elapsed_sec : 60,
      streakCurrent: 0,
    });

    const { error: insertErr } = await supabaseServer.from('game_sessions').insert({
      user_id: userId,
      mode: mode || 'akshara',
      completed_at: new Date().toISOString(),
      duration_sec: elapsed_sec ?? 60,
      score: Math.round(((accuracy || 0.8) as number) * 100),
      accuracy: accuracy || 0.8,
      xp_earned: result.xp,
      meta: { seed, ...meta },
    });
    if (insertErr) console.error('game insert', insertErr);

    // Best effort fetch (triggers normally handle); mock friendly
    const { data: fresh } = await supabaseServer
      .from('users')
      .select('xp, streak_current, level')
      .eq('id', userId)
      .maybeSingle();

    const totalXp = fresh?.xp ?? result.xp;
    return NextResponse.json({
      ok: true,
      xp_earned: result.xp,
      new_streak: fresh?.streak_current ?? 1,
      total_xp: totalXp,
      level: fresh?.level ?? computeLevel(totalXp),
      level_up: false,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'submit_failed' }, { status: 500 });
  }
}

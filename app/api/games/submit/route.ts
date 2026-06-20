import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { validateInitData } from '@/lib/tg';
import { computeScore } from '@/lib/scoring';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { initData, mode, seed, elapsed_sec, accuracy, meta = {} } = body;

    if (!initData) {
      if (process.env.NODE_ENV !== 'production') {
        // Dev mock submit success
        return NextResponse.json({
          ok: true,
          xp_earned: 58,
          new_streak: 3,
          total_xp: 142,
          level_up: false,
          _dev: true,
        });
      }
      return NextResponse.json({ ok: false, error: 'initData required' }, { status: 401 });
    }

    const v = validateInitData(initData, BOT_TOKEN);
    if (!v.ok || !v.user) {
      return NextResponse.json({ ok: false, error: 'Invalid initData' }, { status: 401 });
    }

    const userId = v.user.id;

    const result = computeScore({
      mode: mode || 'akshara',
      accuracy: typeof accuracy === 'number' ? accuracy : 0.8,
      elapsedSec: typeof elapsed_sec === 'number' ? elapsed_sec : 60,
      streakCurrent: 0,
    });

    // Insert game session (triggers will update streak + xp on server)
    const { error: insertErr } = await supabaseServer.from('game_sessions').insert({
      user_id: userId,
      mode: mode || 'akshara',
      completed_at: new Date().toISOString(),
      duration_sec: elapsed_sec,
      score: Math.round((accuracy || 0.8) * 100),
      accuracy: accuracy || 0.8,
      xp_earned: result.xp,
      meta: { seed, ...meta },
    });

    if (insertErr) {
      console.error('game insert', insertErr);
    }

    // Fetch fresh user
    const { data: fresh } = await supabaseServer
      .from('users')
      .select('xp, streak_current, level')
      .eq('id', userId)
      .single();

    return NextResponse.json({
      ok: true,
      xp_earned: result.xp,
      new_streak: fresh?.streak_current ?? 1,
      total_xp: fresh?.xp ?? result.xp,
      level: fresh?.level ?? 'Prarambhika',
      level_up: false,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'submit_failed' }, { status: 500 });
  }
}

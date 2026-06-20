import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { validateInitData } from '@/lib/tg';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

type ProgressRow = {
  scene_index: number;
  xp_earned: number;
  vocab_learned: string[];
  badge_earned: boolean;
  completed_at?: string | null;
};

function emptyProgress(): ProgressRow {
  return { scene_index: 0, xp_earned: 0, vocab_learned: [], badge_earned: false };
}

/**
 * GET /api/quest/progress?episode=ramayana-1
 * Header x-telegram-init-data or query initData
 * Returns current progress or default. Dev mode supported.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const episode = searchParams.get('episode') || 'ramayana-1';
  const initData = req.headers.get('x-telegram-init-data') || searchParams.get('initData') || '';

  if (!initData || !BOT_TOKEN) {
    if (process.env.NODE_ENV !== 'production') {
      // guest / dev: return empty, client will use localStorage
      return NextResponse.json({ ok: true, progress: emptyProgress(), _guest: true });
    }
    return NextResponse.json({ ok: false, error: 'auth required' }, { status: 401 });
  }

  const v = validateInitData(initData, BOT_TOKEN);
  if (!v.ok || !v.user) {
    return NextResponse.json({ ok: false, error: 'bad initData' }, { status: 401 });
  }

  const userId = v.user.id;

  const { data } = await supabaseServer
    .from('quest_progress')
    .select('scene_index, xp_earned, vocab_learned, badge_earned, completed_at')
    .eq('user_id', userId)
    .eq('episode_id', episode)
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    progress: data || emptyProgress(),
  });
}

/**
 * POST /api/quest/progress
 * Body: { initData?, episode, scene_index, xp_earned, vocab_learned: string[], badge_earned?, completed? }
 * Upserts progress. Awards global xp via game_sessions if badge just earned.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      initData = '',
      episode,
      scene_index = 0,
      xp_earned = 0,
      vocab_learned = [],
      badge_earned = false,
      completed = false,
    } = body as {
      initData?: string;
      episode?: string;
      scene_index?: number;
      xp_earned?: number;
      vocab_learned?: string[];
      badge_earned?: boolean;
      completed?: boolean;
    };

    if (!episode) {
      return NextResponse.json({ ok: false, error: 'episode required' }, { status: 400 });
    }

    if (!initData || !BOT_TOKEN) {
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ ok: true, _guest: true, saved: { episode, scene_index, xp_earned, badge_earned } });
      }
      return NextResponse.json({ ok: false, error: 'auth required' }, { status: 401 });
    }

    const v = validateInitData(initData, BOT_TOKEN);
    if (!v.ok || !v.user) {
      return NextResponse.json({ ok: false, error: 'bad initData' }, { status: 401 });
    }
    const userId = v.user.id;

    const now = new Date().toISOString();
    const payload = {
      user_id: userId,
      episode_id: episode,
      scene_index,
      xp_earned,
      vocab_learned: vocab_learned || [],
      badge_earned: !!badge_earned,
      completed_at: completed || badge_earned ? now : null,
      updated_at: now,
    };

    const { error } = await supabaseServer
      .from('quest_progress')
      .upsert(payload, { onConflict: 'user_id,episode_id' });

    if (error) {
      console.error('[quest progress] upsert', error);
    }

    // If badge just earned this call, log a quest game_session for global XP + streak trigger
    if (badge_earned) {
      try {
        await supabaseServer.from('game_sessions').insert({
          user_id: userId,
          mode: 'quest',
          completed_at: now,
          duration_sec: 180,
          score: Math.min(100, Math.round((xp_earned || 80) / 1.2)),
          accuracy: 0.85,
          xp_earned: Math.min(120, Math.max(30, xp_earned || 70)),
          meta: { episode, badge: true },
        });
      } catch (e) {
        console.error('quest session log', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'save_failed' }, { status: 500 });
  }
}

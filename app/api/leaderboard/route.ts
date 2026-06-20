import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/leaderboard?scope=global|weekly&week=current
 * Public leaderboard. No auth (public stats).
 * Falls back to mock when DB unavailable.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get('scope') || 'global';
  const week = searchParams.get('week') || 'current';

  try {
    if (scope === 'weekly') {
      const { data } = await supabaseServer
        .from('leaderboards')
        .select('user_id, xp_week, users(first_name, username)')
        .eq('week', week)
        .order('xp_week', { ascending: false })
        .limit(20);

      const leaders = (data || []).map((row: any, idx: number) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        rank: idx + 1,
        user_id: row.user_id,
        first_name: (row.users as any)?.first_name || 'Seeker', // eslint-disable-line @typescript-eslint/no-explicit-any
        xp_week: row.xp_week,
      }));
      return NextResponse.json({ scope, week, leaders });
    }

    const { data } = await supabaseServer
      .from('users')
      .select('id, first_name, username, xp')
      .order('xp', { ascending: false })
      .limit(20);

    const leaders = (data || []).map((u: any, idx: number) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      rank: idx + 1,
      user_id: u.id,
      first_name: u.first_name,
      xp: u.xp,
    }));
    return NextResponse.json({ scope: 'global', leaders });
  } catch {
    return NextResponse.json({
      scope,
      leaders: [
        { rank: 1, user_id: 111, first_name: 'Arjun', xp: 1840 },
        { rank: 2, user_id: 222, first_name: 'Sita', xp: 1520 },
        { rank: 3, user_id: 333, first_name: 'Dev', xp: 990 },
      ],
    });
  }
}

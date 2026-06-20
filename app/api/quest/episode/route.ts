import { NextRequest, NextResponse } from 'next/server';
import { getEpisode } from '@/lib/quest/episodes';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const episodeId = searchParams.get('episode') || 'ramayana-1';

  const ep = getEpisode(episodeId);
  if (!ep) {
    return NextResponse.json({ ok: false, error: 'unknown_episode' }, { status: 404 });
  }

  // Return full definition (small) — scenes contain vocab + choices
  return NextResponse.json({ ok: true, episode: ep });
}

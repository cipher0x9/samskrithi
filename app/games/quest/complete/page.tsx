'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';
import { getEpisode } from '@/lib/quest/episodes';

function CompleteInner() {
  const params = useSearchParams();
  const episodeId = params.get('episode') || 'ramayana-1';
  const xp = parseInt(params.get('xp') || '120', 10);

  const ep = getEpisode(episodeId);
  const [badge, setBadge] = useState('Ayodhya Initiate');

  useEffect(() => {
    // Map future badges
    const map: Record<string, string> = {
      'ramayana-1': 'Ayodhya Initiate',
      'ramayana-2': 'Vanavasa Seeker',
      'mahabharata-1': 'Sabha Witness',
      'mahabharata-2': 'Gita Listener',
    };
    setTimeout(() => setBadge(map[episodeId] || 'Epic Seeker'), 0);
  }, [episodeId]);

  return (
    <MiniAppShell title="Victory">
      <div className="pt-8 pb-10 text-center">
        <div className="text-7xl mb-2">🏆</div>
        <div className="text-sm tracking-[3px] text-[#d4a853]">EPISODE COMPLETE</div>
        <div className="text-2xl font-semibold mt-1 text-[#e8e0d0]">{ep?.title || 'Episode'}</div>

        <div className="my-6 mx-auto max-w-[320px] rounded-3xl border border-[#d4a853]/70 bg-[#0a0e27] p-5">
          <div className="uppercase text-xs text-[#8a8578]">Soulbound Badge</div>
          <div className="mt-2 text-2xl text-[#d4a853] font-medium tracking-wider">{badge}</div>
          <div className="mt-1 text-[10px] text-[#8a8578]">ON-CHAIN (TON) • PERMANENT</div>
        </div>

        <div className="text-5xl font-semibold tabular-nums text-[#ff6b35]">+{xp} XP</div>
        <p className="mt-2 text-sm text-[#8a8578]">The wisdom of the ancients lives in you.</p>

        <div className="mt-8 flex flex-col gap-3 max-w-[280px] mx-auto">
          <Link href="/games/quest" className="btn btn-gold">Return to the Epic Map</Link>
          <Link href="/" className="btn btn-ghost">Back to Dashboard</Link>
          {episodeId === 'ramayana-1' && (
            <Link href="/games/quest/ramayana-2" className="text-xs text-[#d4a853] underline">Preview next: Exile to the Forest →</Link>
          )}
        </div>

        <div className="mt-10 text-[10px] text-[#8a8578]">Your badge and progress are saved. Share your victory with the sangha.</div>
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

export default function QuestComplete() {
  return (
    <Suspense fallback={<MiniAppShell title="Victory"><div className="pt-10 text-center text-sm text-[#8a8578]">Loading victory…</div><BottomNav /></MiniAppShell>}>
      <CompleteInner />
    </Suspense>
  );
}

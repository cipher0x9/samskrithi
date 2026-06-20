'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';
import { BattleScreen } from '@/components/Quest/BattleScreen';
import { getEpisode } from '@/lib/quest/episodes';

function BattleInner() {
  const params = useSearchParams();
  const router = useRouter();
  const episodeId = params.get('episode') || 'ramayana-1';
  const ep = getEpisode(episodeId);

  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);

  const words = ep ? ep.scenes.flatMap(s => s.vocab) : [];

  function handleComplete(correct: number, total: number) {
    setResult({ correct, total });
    // In standalone just go to complete
    setTimeout(() => {
      router.push(`/games/quest/complete?episode=${episodeId}&xp=${70 + correct * 8}`);
    }, 900);
  }

  return (
    <MiniAppShell title={ep ? ep.title : 'Trial'}>
      <div className="pt-3">
        {!result && (
          <>
            <div className="mb-4 text-center">
              <div className="text-xs text-[#c33]">STANDALONE BOSS TRIAL</div>
              <div className="text-xl text-[#d4a853]">{ep?.bossName || 'Trial of Words'}</div>
            </div>
            {!started && (
              <button className="btn btn-gold w-full mb-4" onClick={() => setStarted(true)}>
                Begin the Sanskrit Reckoning
              </button>
            )}
            {started && (
              <BattleScreen words={words} bossName={ep?.bossName || 'Trial'} onComplete={handleComplete} />
            )}
          </>
        )}
        {result && (
          <div className="text-center py-8">
            <div>Victory recorded…</div>
          </div>
        )}
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

export default function QuestBattle() {
  return (
    <Suspense fallback={<MiniAppShell title="Trial"><div className="pt-10 text-center text-sm text-[#8a8578]">Loading trial…</div><BottomNav /></MiniAppShell>}>
      <BattleInner />
    </Suspense>
  );
}

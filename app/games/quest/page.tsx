'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';
import { ProgressMap } from '@/components/Quest/ProgressMap';
import { getAllEpisodes } from '@/lib/quest/episodes';

export default function QuestHub() {
  const episodes = getAllEpisodes();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const tg = (typeof window !== 'undefined' ? (window as { Telegram?: { WebApp?: { initData?: string } } }).Telegram : undefined);
      const initData = tg?.WebApp?.initData || '';
      const localDone: Record<string, boolean> = {};

      // localStorage guest / cached
      episodes.forEach((ep) => {
        try {
          const raw = localStorage.getItem(`quest:${ep.id}:progress`);
          if (raw) {
            const p = JSON.parse(raw);
            if (p?.badge_earned) localDone[ep.id] = true;
          }
          const badgeFlag = localStorage.getItem(`quest:${ep.id}:badge`);
          if (badgeFlag === '1') localDone[ep.id] = true;
        } catch {}
      });

      setCompleted(localDone);

      // If authed, overlay server truth for badges
      if (initData) {
        try {
          for (const ep of episodes) {
            const res = await fetch(`/api/quest/progress?episode=${ep.id}&initData=${encodeURIComponent(initData)}`);
            const j = await res.json();
            if (j?.progress?.badge_earned) {
              localDone[ep.id] = true;
            }
          }
          setCompleted({ ...localDone });
        } catch {
          // ignore, local is fine
        }
      }
      setLoading(false);
    };
    load();
  }, [episodes]);

  return (
    <MiniAppShell title="Sanskrit Epic Quest">
      <div className="pt-2 pb-8">
        <div className="mb-2">
          <div className="text-xs tracking-[2px] text-[#8a8578]">MAHABHARATA • RAMAYANA</div>
          <div className="text-3xl font-semibold tracking-tighter text-[#d4a853]">Sanskrit Epic Quest</div>
          <p className="mt-1 text-sm text-[#8a8578]">Live the epics. Learn Sanskrit. Earn soulbound badges.</p>
        </div>

        <div className="my-4 card p-4 bg-[#0f1329] border-[#3a3450]">
          <div className="text-sm">Core loop: <span className="text-[#d4a853]">Read → Choose → Learn words → Boss battle → Badge</span></div>
          <div className="text-xs mt-1 text-[#8a8578]">8 episodes planned. Episode 1 is fully playable now.</div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-sm text-[#8a8578]">Loading your legend…</div>
        ) : (
          <ProgressMap episodes={episodes} completed={completed} />
        )}

        <div className="mt-6 text-center">
          <Link href="/games/quest/ramayana-1" className="btn btn-primary inline-block px-10">Begin with Episode 1 — The Birth of Rama</Link>
        </div>

        <div className="mt-8 text-xs text-center text-[#8a8578]">
          Guest play supported • Progress saved locally or to your Telegram account
        </div>
      </div>

      <BottomNav />
    </MiniAppShell>
  );
}

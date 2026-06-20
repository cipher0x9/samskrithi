'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AksharaBoard } from '@/components/Game/AksharaBoard';
import { ScoreModal } from '@/components/Game/ScoreModal';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';

// Force dynamic to allow useSearchParams without static prerender bailout
export const dynamic = 'force-dynamic';

const FALLBACK_VERSE = {
  id: 'gita-2.47',
  devanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।2.47।।',
};

function AksharaInner() {
  const params = useSearchParams();
  const seed = params.get('seed') || 'gita-2.47';
  const [verse, setVerse] = useState(FALLBACK_VERSE);
  const [showScore, setShowScore] = useState(false);
  const [scoreData, setScoreData] = useState({ xp: 0, streak: 0, acc: 0 });
  const [guestNote, setGuestNote] = useState('');

  useEffect(() => {
    fetch(`/api/cards/${seed}`).then(r => r.json()).then(d => {
      if (d.devanagari) setVerse({ id: d.id, devanagari: d.devanagari });
    }).catch(() => {});
  }, [seed]);

  async function handleComplete(accuracy: number, elapsed: number) {
    const initData = ((window as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp?.initData) || '';
    const res = await fetch('/api/games/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, mode: 'akshara', seed: verse.id, elapsed_sec: elapsed, accuracy, meta: { verse_id: verse.id } }),
    });
    const json = await res.json().catch(() => ({}));
    const isGuest = !res.ok || !initData || json._dev;
    setScoreData({ xp: json.xp_earned || Math.floor(accuracy * 60) || 40, streak: json.new_streak || 1, acc: accuracy });
    setGuestNote(isGuest ? 'Guest mode — score not saved. Login via Telegram to save progress.' : '');
    setShowScore(true);
  }

  return (
    <MiniAppShell title="Akshara Puzzle">
      <div className="pt-2">
        <div className="mb-3 text-sm text-[#8a8578]">Rebuild the shloka • {verse.id}</div>
        <AksharaBoard
          devanagari={verse.devanagari}
          onComplete={handleComplete}
        />
      </div>

      <ScoreModal
        open={showScore}
        xpEarned={scoreData.xp}
        streak={scoreData.streak}
        accuracy={scoreData.acc}
        onClose={() => { setShowScore(false); setGuestNote(''); window.location.href = '/'; }}
      />
      {guestNote && showScore && <div className="text-center text-xs text-[#ff6b35] mt-2">{guestNote}</div>}

      <BottomNav />
    </MiniAppShell>
  );
}

export default function AksharaGame() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading puzzle…</div>}>
      <AksharaInner />
    </Suspense>
  );
}

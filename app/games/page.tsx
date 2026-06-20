'use client';

import Link from 'next/link';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';

export default function GamesHub() {
  return (
    <MiniAppShell title="Games">
      <div className="pt-4 space-y-3">
        {/* Epic Quest — primary new feature */}
        <Link href="/games/quest" className="card block p-5 border-[#d4a853]/50 hover:border-[#d4a853]">
          <div className="text-[#d4a853] font-semibold">🗺️ Sanskrit Epic Quest</div>
          <div className="text-sm mt-0.5">Live the Ramayana &amp; Mahabharata. Learn Sanskrit. Earn soulbound badges.</div>
          <div className="text-[11px] mt-2 text-[#ff6b35]">Play Episode 1 now — fully playable →</div>
        </Link>

        <Link href="/games/akshara" className="card block p-5">🧩 Akshara Puzzle — Drag Devanagari tiles</Link>
        <Link href="/games/quiz" className="card block p-5">❓ Cosmic Quiz — Daily 5 questions</Link>
        <Link href="/games/battle" className="card block p-5">⚔️ Shloka Battle (preview)</Link>
        <div className="text-xs text-center text-[#8a8578] pt-2">Quest is the core RPG experience</div>
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

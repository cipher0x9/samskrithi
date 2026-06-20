'use client';

import Link from 'next/link';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';

export default function GamesHub() {
  return (
    <MiniAppShell title="Games">
      <div className="pt-4 space-y-3">
        <Link href="/games/akshara" className="card block p-5">🧩 Akshara Puzzle — Drag Devanagari tiles</Link>
        <Link href="/games/quiz" className="card block p-5">❓ Cosmic Quiz — Daily 5 questions</Link>
        <Link href="/games/battle" className="card block p-5">⚔️ Shloka Battle (preview)</Link>
        <div className="text-xs text-center text-[#8a8578] pt-2">More modes soon</div>
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

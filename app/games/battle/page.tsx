'use client';

import React from 'react';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';

export default function BattleStub() {
  return (
    <MiniAppShell title="Shloka Battle">
      <div className="pt-6 text-center">
        <div className="text-6xl mb-4">⚔️</div>
        <div className="text-xl font-semibold">Shloka Battle (PvP)</div>
        <p className="mt-3 text-[#8a8578]">Coming soon — local hotseat mode or real-time via Supabase.</p>

        <div className="mt-8 card p-4">
          <div className="text-sm">Practice mode</div>
          <button className="btn btn-primary mt-3 w-full" onClick={() => location.href = '/games/quiz'}>Play Solo Quiz Instead</button>
        </div>
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

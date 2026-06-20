'use client';

import React from 'react';
import { AksharaGarden } from '@/components/Progress/AksharaGarden';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';

export default function Garden() {
  // For MVP mock mastered letters
  const mastered = ['अ', 'आ', 'क', 'म', 'र', 'ण', 'य', 'व', 'स'];

  return (
    <MiniAppShell title="Akshara Garden">
      <div className="pt-4">
        <AksharaGarden mastered={mastered} />
        <div className="mt-6 text-sm text-[#8a8578] text-center">
          Master aksharas by completing puzzles. Full garden unlocks special badges.
        </div>
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

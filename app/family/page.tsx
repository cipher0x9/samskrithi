'use client';

import React from 'react';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';

export default function Family() {
  return (
    <MiniAppShell title="Family Sangha">
      <div className="pt-8 text-center">
        <div className="text-5xl mb-3">👨‍👩‍👧‍👦</div>
        <div className="text-lg">Family Sangha</div>
        <p className="mt-2 text-sm text-[#8a8578]">Create or join a family circle to share streaks and compete together. (Coming soon)</p>
        <button onClick={() => alert('Family creation stub')} className="btn btn-primary mt-6">Create Sangha</button>
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

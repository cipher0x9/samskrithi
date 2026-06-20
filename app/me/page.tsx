'use client';

import React, { useEffect, useState } from 'react';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';
import { LevelBadge } from '@/components/Progress/LevelBadge';
import { StreakFlame } from '@/components/Progress/StreakFlame';

export default function MePage() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => setProfile(d));
  }, []);

  const user = profile?.user || { first_name: 'Seeker', xp: 120, streak_current: 4, level: 'Madhyama' };

  return (
    <MiniAppShell title="My Profile">
      <div className="pt-4 space-y-4">
        <div className="card p-5">
          <div className="text-xl">{(user as any).first_name /* eslint-disable-line @typescript-eslint/no-explicit-any */}</div>
          <div className="mt-2 flex items-center gap-4">
            <StreakFlame current={(user as any).streak_current /* eslint-disable-line */} />
            <LevelBadge xp={(user as any).xp /* eslint-disable-line */} />
          </div>
          <div className="mt-3 text-sm text-[#8a8578]">Tier: {(user as any).tier || 'free' /* eslint-disable-line */} • XP {(user as any).xp /* eslint-disable-line */}</div>
        </div>

        <div>
          <div className="section-title">Collection</div>
          <div className="card p-4 text-sm">Saved cards appear here. Visit cards and tap 💾</div>
        </div>

        <div className="text-center text-xs text-[#8a8578] pt-2">Family Sangha and Premium in v1.1</div>
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

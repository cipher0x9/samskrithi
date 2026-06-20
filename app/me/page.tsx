'use client';

import React, { useEffect, useState } from 'react';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';
import { LevelBadge } from '@/components/Progress/LevelBadge';
import { StreakFlame } from '@/components/Progress/StreakFlame';
import { ThemeToggle } from '@/components/Settings/ThemeToggle';

export default function MePage() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => setProfile(d));
  }, []);

  const user = (profile?.user as any) || { first_name: 'Seeker', xp: 120, streak_current: 4, level: 'Madhyama', tier: 'free', tz_offset: 0, prefs: {} }; // eslint-disable-line @typescript-eslint/no-explicit-any

  async function redoOnboarding() {
    const initData = (window as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp?.initData || '';
    await fetch('/api/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, tz_offset: 0, prefs: { onboarded: false } }),
    });
    // Reload so dashboard gate can show flow again
    window.location.href = '/';
  }

  return (
    <MiniAppShell title="My Profile">
      <div className="pt-4 space-y-4">
        <div className="card p-5">
          <div className="text-xl">{user.first_name}</div>
          <div className="mt-2 flex items-center gap-4">
            <StreakFlame current={user.streak_current} />
            <LevelBadge xp={user.xp} />
          </div>
          <div className="mt-3 text-sm text-[#8a8578]">Tier: {user.tier || 'free'} • XP {user.xp}</div>
          {user.tz_offset != null && (
            <div className="mt-1 text-xs text-[var(--text-muted)]">tz_offset: {user.tz_offset} min</div>
          )}
        </div>

        <ThemeToggle />

        <div>
          <div className="section-title">Collection</div>
          <div className="card p-4 text-sm">Saved cards appear here. Visit cards and tap 💾</div>
        </div>

        <div className="card p-4 space-y-3">
          <button onClick={redoOnboarding} className="btn btn-ghost w-full text-sm">
            Edit preferences / Redo onboarding
          </button>
          <div className="text-[10px] text-center text-[var(--text-muted)]">This will reset tz + onboard flag so the welcome flow shows again.</div>
        </div>

        <div className="text-center text-xs text-[#8a8578] pt-2">Family Sangha and Premium in v1.1</div>
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

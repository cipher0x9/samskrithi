'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { WisdomCard } from '@/components/Card/WisdomCard';
import { StreakFlame } from '@/components/Progress/StreakFlame';
import { LevelBadge } from '@/components/Progress/LevelBadge';
import { BottomNav } from '@/components/Layout/BottomNav';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { getTodayISO } from '@/lib/utils';
import { needsOnboarding } from '@/lib/utils';
import { OnboardingFlow } from '@/components/Onboarding/OnboardingFlow';
import { WeekView } from '@/components/Dashboard/WeekView';
import { SamSkrithiRobo } from '@/components/Robo/SamSkrithiRobo';
import type { DailyPayload } from '@/lib/panchanga';

export default function Dashboard() {
  const [data, setData] = useState<DailyPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [tzOffset, setTzOffset] = useState<number | null>(null);
  const [weekDays, setWeekDays] = useState<Array<{date: string; panchanga?: {tithi?: string; nakshatra?: string}; is_festival?: boolean; special_note?: string | null}>>([]);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const getInitData = (): string => {
    return (
      (window as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp?.initData || ''
    );
  };

  const load = useCallback(async (forcedTz?: number) => {
    setLoading(true);
    try {
      const initData = getInitData();
      const params = new URLSearchParams();
      params.set('date', getTodayISO());
      if (initData) params.set('initData', initData);
      const effTz = forcedTz ?? tzOffset;
      if (effTz != null) params.set('tz_offset', String(effTz));

      const res = await fetch(`/api/daily?${params.toString()}`);
      const json = await res.json();
      if (res.ok && json && json.date) {
        setData(json);
      } else {
        throw new Error('bad response');
      }
    } catch {
      const fallbackDate = getTodayISO();
      const effTz = forcedTz ?? tzOffset ?? 0;
      setData({
        date: fallbackDate,
        panchanga: { date: fallbackDate, tithi: 'कृष्ण नवमी', nakshatra: 'अश्विनी', deity_of_day: 'Daily' },
        free_card: {
          id: 'gita-2.47',
          devanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।2.47।।',
          iast: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana mā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi',
          source: 'Bhagavad Gita 2.47',
          translations: { en: 'You have the right to work only, but never to its fruits.' },
        },
        challenges: [{ mode: 'akshara', seed: 'gita-2.47' }, { mode: 'quiz', seed: 'panchanga' }],
        user: { streak_current: 0, xp: 0, level: 'Prarambhika', tz_offset: effTz, prefs: {} },
      });
    } finally {
      setLoading(false);
    }
  }, [tzOffset]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const eff = tzOffset ?? 0;
    const params = new URLSearchParams();
    if (eff != null) params.set('tz_offset', String(eff));
    fetch(`/api/weekly?${params.toString()}`).then(r => r.json()).then(d => {
      if (d && Array.isArray(d.days)) {
        setWeekDays(d.days);
      }
    }).catch(() => {
      // minimal 7 day mock so WeekView shows
      const base = new Date();
      const mock = Array.from({length:7}, (_,i) => {
        const d = new Date(base); d.setDate(base.getDate()+i);
        const ds = d.toISOString().slice(0,10);
        return { date: ds, panchanga: { tithi: '—', nakshatra: '—' } };
      });
      setWeekDays(mock);
    });
  }, [tzOffset]);

  const handleOnboardComplete = (newTz: number) => {
    setTzOffset(newTz);
    setHasOnboarded(true);
    // Reload with the new tz so dashboard shows correct local date + panchanga immediately
    load(newTz);
  };

  const card = data?.free_card;
  const user = (data?.user as {streak_current?: number; xp?: number; level?: string; tz_offset?: number; prefs?: Record<string, unknown>; first_name?: string}) || { streak_current: 0, xp: 0, level: 'Prarambhika', tz_offset: 0, prefs: {} };

  const shouldOnboard = needsOnboarding(user) && !hasOnboarded && tzOffset == null;

  // Local date string for header (uses the tz-resolved date returned by API)
  const headerDateStr = data?.date
    ? new Date(data.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });

  if (shouldOnboard) {
    return (
      <MiniAppShell title="संस्‍कृति • SamSkrithi">
        <div className="pt-2">
          <OnboardingFlow onComplete={handleOnboardComplete} initialName={user.first_name} />
        </div>
        {/* No BottomNav during first-time onboarding */}
      </MiniAppShell>
    );
  }

  return (
    <MiniAppShell title="संस्‍कृति • SamSkrithi">
      <div className="pt-3">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <div className="text-xs text-[#8a8578]">{headerDateStr}</div>
            <div className="text-2xl font-semibold tracking-tight text-[#d4a853]">Today’s Wisdom</div>
          </div>
          <div className="text-right">
            <StreakFlame current={user.streak_current ?? 0} />
            <div className="mt-1"><LevelBadge xp={user.xp ?? 0} /></div>
          </div>
        </div>

        {/* Panchanga teaser */}
        {data?.panchanga && (
          <div className="mb-3 rounded-xl bg-[#141428] px-4 py-2 text-sm">
            ☀️ {data.panchanga.tithi} • {data.panchanga.nakshatra} • {data.panchanga.deity_of_day || 'Daily'}
          </div>
        )}

        {/* Card (no outer link to avoid blocking inner lang tabs/buttons) */}
        {loading ? (
          <WisdomCard
            mantra={{ id: '', devanagari: '', source: '' }}
            translations={{}}
            isLoading
          />
        ) : card ? (
          <WisdomCard
            mantra={{
              id: String((card as unknown as {id?:string}).id || ''),
              devanagari: String((card as unknown as {devanagari?:string}).devanagari || ''),
              iast: (card as unknown as {iast?:string}).iast,
              source: String((card as unknown as {source?:string}).source || ''),
            }}
            translations={(card as unknown as {translations?: Record<string,string>}).translations || {}}
          />
        ) : null}

        {/* Daily Challenges */}
        <div className="mt-6">
          <div className="section-title">Today’s Challenges</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {data?.challenges?.map((c, i) => (
              <Link
                key={i}
                href={c.mode === 'akshara' ? `/games/akshara?seed=${c.seed}` : c.mode === 'quiz' ? `/games/quiz` : `/games/battle`}
                className="card block p-4 hover:border-[#d4a853]"
              >
                <div className="text-sm text-[#8a8578]">{c.mode.toUpperCase()}</div>
                <div className="mt-1 text-lg font-medium text-[#e8e0d0]">{c.mode === 'akshara' ? 'Akshara Puzzle' : c.mode === 'quiz' ? 'Cosmic Quiz' : 'Shloka Battle'}</div>
                <div className="mt-3 text-xs text-[#ff6b35]">Play → Earn XP</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Week scroller */}
        <WeekView days={weekDays} />

        {/* Quick links */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/garden" className="btn btn-ghost text-sm">🌱 View Garden</Link>
          <Link href="/temple" className="btn btn-ghost text-sm">🛕 Temple Quest</Link>
          <Link href="/me" className="btn btn-ghost text-sm">👤 My Profile</Link>
        </div>

        <div className="h-10" />
      </div>

      <SamSkrithiRobo />
      <BottomNav />
    </MiniAppShell>
  );
}

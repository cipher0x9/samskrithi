'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WisdomCard } from '@/components/Card/WisdomCard';
import { StreakFlame } from '@/components/Progress/StreakFlame';
import { LevelBadge } from '@/components/Progress/LevelBadge';
import { BottomNav } from '@/components/Layout/BottomNav';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { getTodayISO } from '@/lib/utils';
import type { DailyPayload } from '@/lib/panchanga';

export default function Dashboard() {
  const [data, setData] = useState<DailyPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/daily?date=${getTodayISO()}`);
        const json = await res.json();
        setData(json);
      } catch {
        setData({
          date: getTodayISO(),
          panchanga: { date: getTodayISO(), tithi: 'कृष्ण नवमी', nakshatra: 'अश्विनी' },
          free_card: {
            id: 'gita-2.47',
            devanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।2.47।।',
            iast: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana mā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi',
            source: 'Bhagavad Gita 2.47',
            translations: { en: 'You have the right to work only, but never to its fruits.' },
          },
          challenges: [{ mode: 'akshara', seed: 'gita-2.47' }, { mode: 'quiz', seed: 'panchanga' }],
          user: { streak_current: 0, xp: 0, level: 'Prarambhika' },
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const card = data?.free_card;
  const user = data?.user || { streak_current: 0, xp: 0, level: 'Prarambhika' };

  return (
    <MiniAppShell title="संस्‍कृति • SamSkrithi">
      <div className="pt-3">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <div className="text-xs text-[#8a8578]">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
            <div className="text-2xl font-semibold tracking-tight text-[#d4a853]">Today’s Wisdom</div>
          </div>
          <div className="text-right">
            <StreakFlame current={user.streak_current} />
            <div className="mt-1"><LevelBadge xp={user.xp} /></div>
          </div>
        </div>

        {/* Panchanga teaser */}
        {data?.panchanga && (
          <div className="mb-3 rounded-xl bg-[#141428] px-4 py-2 text-sm">
            ☀️ {data.panchanga.tithi} • {data.panchanga.nakshatra} • {data.panchanga.deity_of_day || 'Daily'}
          </div>
        )}

        {/* Card */}
        {loading ? (
          <div className="card mx-auto h-72 max-w-[480px] animate-pulse bg-[#141428]" />
        ) : card ? (
          <Link href={`/cards/${(card as any).id /* eslint-disable-line @typescript-eslint/no-explicit-any */}`}>
            <WisdomCard
              mantra={{ id: (card as any).id /* eslint-disable-line @typescript-eslint/no-explicit-any */, devanagari: (card as any).devanagari /* eslint-disable-line */, iast: (card as any).iast /* eslint-disable-line */, source: (card as any).source /* eslint-disable-line */ }}
              translations={(card as any).translations || {} /* eslint-disable-line @typescript-eslint/no-explicit-any */}
            />
          </Link>
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

        {/* Quick links */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/garden" className="btn btn-ghost text-sm">🌱 View Garden</Link>
          <Link href="/temple" className="btn btn-ghost text-sm">🛕 Temple Quest</Link>
          <Link href="/me" className="btn btn-ghost text-sm">👤 My Profile</Link>
        </div>

        <div className="h-10" />
      </div>

      <BottomNav />
    </MiniAppShell>
  );
}

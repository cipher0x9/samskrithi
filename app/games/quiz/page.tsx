'use client';

import React, { useEffect, useState } from 'react';
import { QuizRunner, type QuizQuestion } from '@/components/Game/QuizRunner';
import { ScoreModal } from '@/components/Game/ScoreModal';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';
import { getTodayISO } from '@/lib/utils';

const BASE_QS: QuizQuestion[] = [
  { q: "What is the key teaching of Gita 2.47?", options: ["Right to fruits", "Right to work only, not fruits", "Do nothing", "Only meditate"], answer: 1 },
  { q: "Today's nakshatra (sample)", options: ["Ashwini", "Rohini", "Mrigashira", "Pushya"], answer: 0 },
  { q: "Meaning of 'karma-phala-hetur'?", options: ["Attachment to result", "Motive of fruit of action", "Good deeds only", "Meditation"], answer: 1 },
  { q: "Which Veda contains many famous hymns?", options: ["Atharva", "Rigveda", "Yajur", "Sama"], answer: 1 },
  { q: "Streak is built by...", options: ["Login only", "Login + 1 daily challenge", "Paying", "Sharing"], answer: 1 },
];

export default function QuizPage() {
  const [qs, setQs] = useState<QuizQuestion[]>(BASE_QS);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState({ xp: 0, streak: 0, acc: 0 });

  useEffect(() => {
    // Could fetch daily for seed personalization later
    fetch(`/api/daily?date=${getTodayISO()}`).then(r => r.json()).then(d => {
      // optionally mutate questions using panchanga
      if (d.panchanga?.nakshatra) {
        const copy = [...BASE_QS];
        copy[1] = { ...copy[1], options: [d.panchanga.nakshatra.split('(')[0].trim(), 'Rohini', 'Mrigashira', 'Pushya'] };
        setQs(copy);
      }
    }).catch(() => {});
  }, []);

  async function handleFinish(correct: number, total: number, elapsed: number) {
    const acc = correct / total;
    const res = await fetch('/api/games/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initData: ((window as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp?.initData) || '',
        mode: 'quiz',
        seed: 'quiz-' + getTodayISO(),
        elapsed_sec: elapsed,
        accuracy: acc,
      }),
    });
    const json = await res.json();
    setScore({ xp: json.xp_earned || Math.floor(acc * 80), streak: json.new_streak || 1, acc });
    setShowScore(true);
  }

  return (
    <MiniAppShell title="Cosmic Quiz">
      <div className="pt-3">
        <QuizRunner questions={qs} onFinish={handleFinish} />
      </div>
      <ScoreModal open={showScore} xpEarned={score.xp} streak={score.streak} accuracy={score.acc} onClose={() => { setShowScore(false); location.href = '/'; }} />
      <BottomNav />
    </MiniAppShell>
  );
}

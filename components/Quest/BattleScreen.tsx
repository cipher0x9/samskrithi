'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { VocabWord } from '@/lib/quest/episodes';

interface Question {
  prompt: string;
  options: string[];
  correct: number; // index
}

interface Props {
  words: VocabWord[];
  bossName: string;
  onComplete: (correct: number, total: number, elapsedSec: number) => void;
}

function makeQuestions(words: VocabWord[]): Question[] {
  const pool = [...words];
  if (pool.length === 0) {
    // fallback questions
    return [
      { prompt: 'What does "राजा" mean?', options: ['city', 'king', 'fire', 'son'], correct: 1 },
      { prompt: 'Which word means "fire"?', options: ['नगर', 'यज्ञ', 'अग्नि', 'पुत्र'], correct: 2 },
    ];
  }

  const qs: Question[] = [];
  const used = new Set<string>();

  // Up to 5 unique
  for (let i = 0; i < 5 && qs.length < 5; i++) {
    const w = pool[(qs.length + i) % pool.length];
    if (used.has(w.dev)) continue;
    used.add(w.dev);

    // 50/50 type
    const isDevToEn = qs.length % 2 === 0;

    if (isDevToEn) {
      const opts = [w.en, ...pool.filter(x => x.en !== w.en).map(x => x.en).slice(0, 3)];
      while (opts.length < 4) opts.push('divine');
      const shuffled = opts.sort(() => Math.random() - 0.5);
      qs.push({
        prompt: `${w.dev} — what does this mean?`,
        options: shuffled,
        correct: shuffled.indexOf(w.en),
      });
    } else {
      const opts = [w.dev, ...pool.filter(x => x.dev !== w.dev).map(x => x.dev).slice(0, 3)];
      while (opts.length < 4) opts.push('अवतार');
      const shuffled = opts.sort(() => Math.random() - 0.5);
      qs.push({
        prompt: `Which Sanskrit word means "${w.en}"?`,
        options: shuffled,
        correct: shuffled.indexOf(w.dev),
      });
    }
  }
  return qs.length ? qs : [{ prompt: 'What does "अवतार" mean?', options: ['king', 'son', 'incarnation', 'city'], correct: 2 }];
}

export function BattleScreen({ words, bossName, onComplete }: Props) {
  const questions = useMemo(() => makeQuestions(words), [words]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [start] = useState(() => Date.now());
  const [timeLeft, setTimeLeft] = useState(18); // seconds per question

  const q = questions[idx];
  const total = questions.length;

  // per-question timer
  useEffect(() => {
    setTimeLeft(18);
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // timeout -> treat as wrong
          handleTimeout();
          return 18;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  function handleTimeout() {
    if (selected !== null) return;
    choose(-1); // wrong
  }

  function choose(i: number) {
    if (selected !== null) return;
    const isCorrect = i === q.correct;
    const newCount = correctCount + (isCorrect ? 1 : 0);

    setSelected(i);
    if (isCorrect) setCorrectCount(newCount);

    setTimeout(() => {
      const next = idx + 1;
      if (next < total) {
        setIdx(next);
        setSelected(null);
      } else {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        onComplete(newCount, total, elapsed);
      }
    }, 650);
  }

  const pct = Math.max(0, Math.min(100, Math.round((timeLeft / 18) * 100)));

  return (
    <div className="battle-root text-[#e8e0d0]">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[2px] text-[#c33]">BOSS BATTLE</div>
          <div className="text-xl font-semibold text-[#d4a853]">{bossName}</div>
        </div>
        <div className="text-right text-sm">
          Q {idx + 1} / {total}
        </div>
      </div>

      {/* Timer bar */}
      <div className="mb-4 h-2 rounded bg-[#3a1f1f] overflow-hidden">
        <motion.div
          className="h-2 bg-[#c33]"
          animate={{ width: `${pct}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>

      <div className="mb-4 text-lg font-medium leading-tight">{q.prompt}</div>

      {q.options.map((opt, i) => {
        let cls = 'quiz-option battle-opt';
        if (selected !== null) {
          if (i === q.correct) cls += ' correct';
          else if (i === selected) cls += ' wrong';
        }
        return (
          <div key={i} className={cls} onClick={() => choose(i)}>
            {opt}
          </div>
        );
      })}

      <div className="mt-4 text-center text-[10px] text-[#8a8578]">
        Recall the words you learned. Wrong answers cost time.
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index
}

interface Props {
  questions: QuizQuestion[];
  onFinish: (correct: number, total: number, elapsedSec: number) => void;
}

export function QuizRunner({ questions, onFinish }: Props) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [start] = useState(() => Date.now());
  const [done, setDone] = useState(false);

  const q = questions[idx];

  function choose(i: number) {
    if (done || selected !== null) return;
    setSelected(i);

    const isCorrect = i === q.answer;
    const newCount = correctCount + (isCorrect ? 1 : 0);
    if (isCorrect) setCorrectCount(newCount);

    setTimeout(() => {
      const next = idx + 1;
      if (next < questions.length) {
        setIdx(next);
        setSelected(null);
      } else {
        setDone(true);
        const elapsed = Math.floor((Date.now() - start) / 1000);
        onFinish(newCount, questions.length, elapsed);
      }
    }, 700);
  }

  if (!q) return <div>Loading quiz...</div>;

  return (
    <div>
      <div className="mb-4 text-sm text-[#8a8578]">Question {idx + 1} / {questions.length}</div>
      <div className="mb-4 text-lg font-medium">{q.q}</div>

      {q.options.map((opt, i) => {
        let cls = 'quiz-option';
        if (selected !== null) {
          if (i === q.answer) cls += ' correct';
          else if (i === selected) cls += ' wrong';
        }
        return (
          <div key={i} className={cls} onClick={() => choose(i)}>
            {opt}
          </div>
        );
      })}

      {done && <div className="mt-4 text-center text-[#d4a853]">Calculating score…</div>}
    </div>
  );
}

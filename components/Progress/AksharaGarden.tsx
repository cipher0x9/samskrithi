'use client';

import React from 'react';

interface Props {
  mastered: string[]; // array of akshara chars
}

const VOWELS = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ'];
const CONSONANTS = ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'];

export function AksharaGarden({ mastered }: Props) {
  const all = [...VOWELS, ...CONSONANTS];
  const count = mastered.length;

  return (
    <div className="rounded-2xl bg-[#141428] p-4">
      <div className="flex items-baseline justify-between text-sm mb-3">
        <div>Akshara Garden</div>
        <div className="text-[#d4a853]">{count} / {all.length}</div>
      </div>

      <svg viewBox="0 0 360 140" className="w-full">
        {/* ground */}
        <rect x="0" y="110" width="360" height="30" fill="#1a1628" rx="4" />
        {all.slice(0, 18).map((ch, i) => {
          const isMastered = mastered.includes(ch);
          const x = 18 + (i % 9) * 38;
          const y = 78 + Math.floor(i / 9) * 26;
          const h = isMastered ? 34 + (i % 3) * 4 : 10;
          return (
            <g key={i}>
              <circle cx={x + 8} cy={y - 3} r={isMastered ? 4 : 2} fill={isMastered ? "#d4a853" : "#3a3548"} />
              <rect x={x} y={y - h} width="16" height={h} rx="3" fill={isMastered ? "#2ecc71" : "#3a3548"} />
              <text x={x + 8} y={y + 14} fontSize="9" textAnchor="middle" fill="#e8e0d0">{ch}</text>
            </g>
          );
        })}
      </svg>

      <div className="text-center text-xs text-[#8a8578] mt-1">Master letters in games to grow your garden</div>
    </div>
  );
}

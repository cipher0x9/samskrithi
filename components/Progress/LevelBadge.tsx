'use client';

import React from 'react';
import { computeLevel, getXPForNext } from '@/lib/scoring';

interface Props {
  xp: number;
}

export function LevelBadge({ xp }: Props) {
  const level = computeLevel(xp);
  const next = getXPForNext(level);
  const progress = Math.min(100, Math.floor((xp / next) * 100));

  return (
    <div className="level-badge">
      <span>{level}</span>
      <span className="ml-2 text-[#8a8578] text-[10px]">{xp} / {next} XP</span>
      <div className="ml-2 h-1 w-8 overflow-hidden rounded bg-[#2a2530]">
        <div className="h-1 bg-[#d4a853]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

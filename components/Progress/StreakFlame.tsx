'use client';

import React from 'react';

interface Props {
  current: number;
  best?: number;
}

export function StreakFlame({ current, best }: Props) {
  return (
    <div className="streak-flame">
      <span className="text-2xl">🔥</span>
      <div>
        <div className="font-semibold text-lg leading-none">{current}</div>
        <div className="text-[10px] -mt-0.5 text-[#8a8578]">day streak{current > 3 ? '!' : ''}</div>
      </div>
      {best && best > current && <div className="ml-3 text-xs text-[#8a8578]">best {best}</div>}
    </div>
  );
}

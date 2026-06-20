'use client';

import React from 'react';

interface Props {
  title: string;
  currentScene: number;
  totalScenes: number;
  xp: number;
  vocabCount: number;
  totalVocab: number;
}

export function QuestHUD({ title, currentScene, totalScenes, xp, vocabCount, totalVocab }: Props) {
  const progress = totalScenes > 0 ? Math.round(((currentScene + 1) / totalScenes) * 100) : 0;

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-[#2a2530] bg-[#0a0a1a]/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between text-sm">
        <div>
          <div className="text-[#d4a853] font-medium tracking-tight">{title}</div>
          <div className="text-[10px] text-[#8a8578]">Scene {currentScene + 1} / {totalScenes}</div>
        </div>

        <div className="text-right">
          <div className="text-[#d4a853] font-semibold tabular-nums">+{xp} XP</div>
          <div className="text-[10px] text-[#8a8578]">{vocabCount}/{totalVocab} words</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 w-full rounded bg-[#1f243a]">
        <div
          className="h-1.5 rounded bg-gradient-to-r from-[#d4a853] to-[#ff6b35] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

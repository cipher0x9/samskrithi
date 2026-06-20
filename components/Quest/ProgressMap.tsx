'use client';

import React from 'react';
import Link from 'next/link';
import type { QuestEpisode } from '@/lib/quest/episodes';

interface Props {
  episodes: QuestEpisode[];
  completed: Record<string, boolean>; // episodeId -> badge earned
}

export function ProgressMap({ episodes, completed }: Props) {
  return (
    <div className="relative py-2">
      <div className="text-xs uppercase tracking-[1.5px] text-[#8a8578] mb-3">THE EPIC PATH</div>

      <div className="space-y-4">
        {episodes.map((ep, index) => {
          const done = !!completed[ep.id];
          const isPlayable = index === 0 || done || completed[episodes[index - 1]?.id];

          return (
            <div key={ep.id} className="relative flex gap-4">
              {/* Connector line */}
              {index < episodes.length - 1 && (
                <div className="absolute left-[17px] top-9 bottom-[-8px] w-[2px] bg-[#2a2530]" />
              )}

              {/* Node */}
              <div className={`mt-1 h-9 w-9 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-sm font-mono
                ${done ? 'border-[#d4a853] bg-[#2a2110] text-[#d4a853]' : 'border-[#3a3450] bg-[#141428] text-[#8a8578]'}`}>
                {done ? '✓' : (index + 1)}
              </div>

              {/* Card */}
              <Link
                href={isPlayable ? `/games/quest/${ep.id}` : '#'}
                className={`card flex-1 p-4 ${!isPlayable ? 'opacity-60 pointer-events-none' : 'hover:border-[#d4a853]'}`}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-[#8a8578]">{ep.series}</div>
                    <div className="font-semibold text-lg text-[#e8e0d0]">{ep.title}</div>
                  </div>
                  {done && (
                    <div className="text-right text-xs text-[#d4a853] pt-1">BADGE EARNED</div>
                  )}
                </div>
                <div className="mt-1 text-xs text-[#8a8578]">{ep.description}</div>

                <div className="mt-3 text-[11px] text-[#ff6b35]">
                  {isPlayable ? (done ? 'Replay episode →' : 'Begin episode →') : 'Locked — complete previous'}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-[11px] text-center text-[#8a8578]">
        Complete all episodes → Sanskrit Rishi achievement
      </div>
    </div>
  );
}

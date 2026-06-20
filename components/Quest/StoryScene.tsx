'use client';

import React from 'react';
import type { QuestScene, VocabWord } from '@/lib/quest/episodes';
import { ChoiceButton } from './ChoiceButton';

interface Props {
  scene: QuestScene;
  onChoose: (nextIdx: number) => void;
  onLearnWord: (word: VocabWord) => void;
}

export function StoryScene({ scene, onChoose, onLearnWord }: Props) {
  const hasChoices = scene.choices && scene.choices.length > 0;

  return (
    <div className="quest-scene">
      {/* Sanskrit line */}
      {scene.sanskrit && (
        <div className="mb-3 text-center">
          <div className="text-xs uppercase tracking-[1.5px] text-[#8a8578]">In Sanskrit</div>
          <div className="sanskrit mt-1 text-2xl leading-snug text-[#d4a853]">{scene.sanskrit}</div>
        </div>
      )}

      {/* English story */}
      <div className="prose prose-invert max-w-none">
        <p className="text-[15px] leading-relaxed text-[#e8e0d0] whitespace-pre-line">{scene.text}</p>
      </div>

      {/* Vocab to learn — tappable */}
      {scene.vocab.length > 0 && (
        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-widest text-[#8a8578] mb-2">Learn these words</div>
          <div className="flex flex-wrap gap-2">
            {scene.vocab.map((w, i) => (
              <button
                key={i}
                onClick={() => onLearnWord(w)}
                className="vocab-pill px-3 py-1.5 rounded-full bg-[#1a1f36] border border-[#3a3450] text-sm text-[#d4a853] active:bg-[#2a3048]"
              >
                {w.dev} <span className="text-[#8a8578] text-xs">· {w.iast}</span>
              </button>
            ))}
          </div>
          <div className="text-[10px] mt-1.5 text-[#8a8578]">Tap a word to hear and remember it</div>
        </div>
      )}

      {/* Choices */}
      {hasChoices && (
        <div className="mt-8">
          <div className="text-[11px] uppercase tracking-widest text-[#8a8578] mb-2">Your choice shapes the tale</div>
          {scene.choices!.map((c, idx) => (
            <ChoiceButton
              key={idx}
              text={c.text}
              onClick={() => onChoose(c.next)}
              preview={idx === 0 ? 'Continue deeper' : 'Take the swift path'}
            />
          ))}
        </div>
      )}

      {!hasChoices && (
        <div className="mt-8 text-center">
          <div className="text-[#d4a853] text-sm">The scene ends. Prepare for the trial...</div>
        </div>
      )}
    </div>
  );
}

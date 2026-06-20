'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VocabWord } from '@/lib/quest/episodes';

interface Props {
  word: VocabWord | null;
  onClose: () => void;
}

export function VocabPopup({ word, onClose }: Props) {
  if (!word) return null;

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(word.dev);
    utter.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find(v => /hi|hi-IN|devanagari|sanskrit/i.test(v.name + v.lang));
    if (hiVoice) utter.voice = hiVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[420px] rounded-3xl bg-[#0f1329] border border-[#2a2530] p-6 text-center"
        >
          <div className="text-[13px] uppercase tracking-[2px] text-[#8a8578] mb-2">SANSKRIT • VOCAB</div>

          <div className="sanskrit text-6xl mb-2 leading-none" style={{ fontSize: '64px' }}>
            {word.dev}
          </div>
          <div className="text-[#d4a853] text-xl tracking-wide mb-1 font-medium">{word.iast}</div>
          <div className="text-[#e8e0d0] text-lg mb-6">{word.en}</div>

          <div className="flex gap-3">
            <button
              onClick={speak}
              className="btn btn-gold flex-1"
            >
              🔊 Pronounce
            </button>
            <button onClick={onClose} className="btn btn-ghost flex-1">
              Close
            </button>
          </div>

          <div className="mt-4 text-[10px] text-[#8a8578]">Tap words during the story to learn • TTS uses your device voices</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

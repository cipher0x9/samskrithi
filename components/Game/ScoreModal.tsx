'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  xpEarned: number;
  streak: number;
  accuracy: number;
  onClose: () => void;
}

export function ScoreModal({ open, xpEarned, streak, accuracy, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70" onClick={onClose}>
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[480px] rounded-t-3xl bg-[#141428] p-6 text-center"
          >
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[#2a2530]" />
            <div className="text-5xl">🔥</div>
            <div className="mt-2 text-3xl font-semibold text-[#d4a853]">+{xpEarned} XP</div>
            <div className="mt-1 text-sm text-[#8a8578]">Accuracy {Math.round(accuracy * 100)}% • Streak {streak} days</div>

            <div className="my-5 h-px bg-[#2a2530]" />

            <button onClick={onClose} className="btn btn-primary w-full">Continue</button>
            <div className="mt-2 text-[10px] text-[#8a8578]">Keep the flame alive tomorrow</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

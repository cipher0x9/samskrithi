'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  episodeTitle: string;
  badgeName: string;
  xpTotal: number;
  onClose: () => void;
}

export function BadgeUnlock({ open, episodeTitle, badgeName, xpTotal, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-3xl border border-[#d4a853]/60 bg-[#0a0e27] p-8 text-center"
          >
            <div className="text-7xl mb-2">🏆</div>
            <div className="text-sm tracking-[3px] text-[#d4a853]">EPISODE COMPLETE</div>
            <div className="mt-1 text-2xl font-semibold text-[#e8e0d0]">{episodeTitle}</div>

            <div className="my-6">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4a853] bg-black/40 px-6 py-2 text-[#d4a853]">
                <span className="text-xl">⚜︎</span>
                <span className="font-medium tracking-wider">{badgeName}</span>
              </div>
              <div className="mt-2 text-xs text-[#8a8578]">SOULBOUND • TON BADGE</div>
            </div>

            <div className="text-4xl font-semibold tabular-nums text-[#ff6b35]">+{xpTotal} XP</div>
            <div className="text-sm text-[#8a8578] mt-1">Episode bonus + quiz mastery included</div>

            <button onClick={onClose} className="btn btn-gold mt-8 w-full text-base">
              Return to the Map
            </button>

            <div className="mt-4 text-[10px] text-[#8a8578]">Your progress and badge are recorded. Continue the epic.</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

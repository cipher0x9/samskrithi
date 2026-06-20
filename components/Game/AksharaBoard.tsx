'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { splitDevanagari, shuffle } from '@/lib/utils';

interface Props {
  devanagari: string;
  onComplete: (accuracy: number, elapsedSec: number) => void;
}

export function AksharaBoard({ devanagari, onComplete }: Props) {
  const targetChars = splitDevanagari(devanagari);
  const [slots, setSlots] = useState<string[]>(Array(targetChars.length).fill(''));
  const [pool, setPool] = useState<string[]>(() => shuffle([...targetChars]));
  const [startTime] = useState(() => Date.now());
  const [submitted, setSubmitted] = useState(false);

  function placeTile(tile: string, slotIndex: number) {
    setSlots((prev) => {
      const next = [...prev];
      const prevTile = next[slotIndex];
      next[slotIndex] = tile;
      setPool((p) => {
        const np = [...p];
        if (prevTile) np.push(prevTile);
        const i = np.indexOf(tile);
        if (i >= 0) np.splice(i, 1);
        return np;
      });
      return next;
    });
  }

  function returnTile(slotIndex: number) {
    setSlots((prev) => {
      const next = [...prev];
      const t = next[slotIndex];
      if (t) {
        setPool((p) => [...p, t]);
        next[slotIndex] = '';
      }
      return next;
    });
  }

  const filled = slots.filter(Boolean).length;
  const correct = slots.filter((s, i) => s === targetChars[i]).length;
  const accuracy = targetChars.length ? correct / targetChars.length : 0;

  function submit() {
    if (submitted) return;
    setSubmitted(true);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    onComplete(accuracy, elapsed);
  }

  // Touch / click simple fill from pool (good for TG)
  const [selectedPoolIdx, setSelectedPoolIdx] = useState<number | null>(null);

  function onPoolClick(idx: number) {
    if (selectedPoolIdx === idx) {
      setSelectedPoolIdx(null);
      return;
    }
    const emptyIdx = slots.findIndex((s) => !s);
    if (emptyIdx >= 0) {
      placeTile(pool[idx], emptyIdx);
      setSelectedPoolIdx(null);
    } else {
      setSelectedPoolIdx(idx);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 text-center text-sm text-[#8a8578]">Arrange the aksharas</div>
        <div className="flex flex-wrap justify-center gap-2">
          {slots.map((val, idx) => (
            <div
              key={idx}
              onClick={() => val && returnTile(idx)}
              className={`slot ${val ? 'filled' : ''}`}
              style={{ width: 44, height: 44 }}
            >
              {val || ''}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-center text-xs uppercase tracking-widest text-[#8a8578]">Tiles</div>
        <div className="flex flex-wrap justify-center gap-2">
          {pool.map((tile, idx) => (
            <motion.div
              key={idx + tile}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPoolClick(idx)}
              className="tile"
              style={{ opacity: selectedPoolIdx === idx ? 0.6 : 1 }}
            >
              {tile}
            </motion.div>
          ))}
          {pool.length === 0 && <div className="text-[#8a8578] text-sm">All tiles placed</div>}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={submit}
          disabled={submitted || filled < Math.floor(targetChars.length * 0.6)}
          className="btn btn-primary min-w-[180px] disabled:opacity-60"
        >
          {submitted ? 'Submitted' : `Submit • ${Math.round(accuracy * 100)}%`}
        </button>
      </div>
      <div className="text-center text-[10px] text-[#8a8578]">Tap tile → slot. Tap filled slot to return tile.</div>
    </div>
  );
}

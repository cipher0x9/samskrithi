'use client';

import React from 'react';

interface Props {
  onNext: () => void;
  onSkip?: () => void;
}

export function WelcomeScreen({ onNext, onSkip }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-6 px-4">
      {/* Om illustration */}
      <div className="mb-6 relative">
        <div className="w-28 h-28 rounded-full border-2 border-[var(--gold)] flex items-center justify-center bg-[var(--bg-card)]">
          <span className="text-[72px] leading-none text-[var(--gold)] select-none" style={{ fontFamily: 'var(--font-devanagari)' }}>ॐ</span>
        </div>
        <div className="absolute -inset-1 rounded-full border border-[var(--gold)]/30 -z-10" />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-[var(--gold)]">Welcome to SamSkrithi</h1>
      <p className="mt-2 text-[var(--text-muted)] max-w-[280px]">
        Daily Sanskrit wisdom, panchanga, and mindful practice — right in your Telegram.
      </p>

      <div className="mt-8 w-full max-w-[280px] space-y-3">
        <button onClick={onNext} className="btn btn-primary w-full">
          Begin your journey
        </button>
        {onSkip && (
          <button onClick={onSkip} className="btn btn-ghost w-full text-xs">
            Skip for dev
          </button>
        )}
      </div>

      <div className="mt-10 text-[10px] text-[var(--text-muted)] tracking-[2px] opacity-70">
        ॐ शान्तिः शान्तिः शान्तिः
      </div>
    </div>
  );
}

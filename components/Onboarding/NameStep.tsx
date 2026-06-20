'use client';

import React from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}

export function NameStep({ value, onChange, onNext }: Props) {
  return (
    <div className="space-y-5 px-1">
      <div>
        <label className="text-xs tracking-widest text-[var(--text-muted)]">How should we address you?</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your name"
          className="mt-2 w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-5 py-3 text-lg focus:outline-none focus:border-[var(--gold)]"
          maxLength={48}
        />
      </div>

      <button onClick={onNext} className="btn btn-primary w-full" disabled={!value.trim()}>
        Continue
      </button>

      <div className="text-center text-[10px] text-[var(--text-muted)]">
        Used only for greetings and your profile. You can edit later.
      </div>
    </div>
  );
}

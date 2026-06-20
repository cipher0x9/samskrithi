'use client';

import React from 'react';

const LANGS = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'hi', label: 'हिंदी', native: 'हि' },
  { code: 'te', label: 'తెలుగు', native: 'తె' },
  { code: 'ta', label: 'தமிழ்', native: 'த' },
];

interface Props {
  value: string;
  onChange: (code: string) => void;
}

export function LanguagePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {LANGS.map((l) => {
        const active = value === l.code;
        return (
          <button
            key={l.code}
            onClick={() => onChange(l.code)}
            className={`card p-4 text-left border ${active ? 'border-[var(--gold)]' : 'border-[var(--border)]'}`}
          >
            <div className="text-2xl mb-1">{l.native}</div>
            <div className="text-sm font-medium">{l.label}</div>
            <div className="text-[10px] text-[var(--text-muted)] mt-1">Primary UI language</div>
          </button>
        );
      })}
      <div className="col-span-2 text-[10px] text-center text-[var(--text-muted)] pt-1">
        More languages available in cards. You can change later.
      </div>
    </div>
  );
}

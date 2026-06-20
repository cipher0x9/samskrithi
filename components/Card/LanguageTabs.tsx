'use client';

import React from 'react';

const ALL_LANGS = [
  { code: 'en', label: 'EN' }, { code: 'hi', label: 'हि' }, { code: 'te', label: 'తె' },
  { code: 'ta', label: 'த' }, { code: 'id', label: 'ID' }, { code: 'pt', label: 'PT' },
  { code: 'ru', label: 'RU' }, { code: 'th', label: 'ไทย' }, { code: 'vi', label: 'VI' },
  { code: 'tl', label: 'TL' }, { code: 'bn', label: 'বাং' }, { code: 'ne', label: 'ने' }, { code: 'si', label: 'සි' },
];

interface Props {
  value: string;
  onChange: (lang: string) => void;
}

export function LanguageTabs({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {ALL_LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={`rounded-full border px-3 py-1 text-xs transition ${
            value === l.code
              ? 'border-[#d4a853] bg-[#d4a853] text-black'
              : 'border-[#2a2530] bg-[#1e1a2a] text-[#8a8578]'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

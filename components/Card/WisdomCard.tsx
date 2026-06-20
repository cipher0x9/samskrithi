'use client';

import React, { useState } from 'react';
import { CardActions } from './CardActions';

export interface WisdomCardProps {
  mantra: {
    id: string;
    devanagari: string;
    iast?: string;
    english?: string;
    source: string;
  };
  translations: Record<string, string>;
  variant?: 'temple' | 'panchanga' | 'gold';
  onSave?: () => void;
}

const P0_LANGS = [
  { code: 'en', label: '🇬🇧 EN' },
  { code: 'hi', label: '🇮🇳 हि' },
  { code: 'te', label: '🇮🇳 తె' },
  { code: 'ta', label: '🇮🇳 த' },
  { code: 'id', label: '🇮🇩 ID' },
  { code: 'pt', label: '🇧🇷 PT' },
];

export function WisdomCard({ mantra, translations, variant = 'temple', onSave }: WisdomCardProps) {
  const [lang, setLang] = useState('en');
  const currentTrans = translations[lang] || translations.en || 'Translation coming soon in this language.';

  const headerLabel = variant === 'panchanga' ? '☀️ PANCHANGAM' : '📖 SHLOKA';

  return (
    <div className="card mx-auto w-full max-w-[480px]">
      <div className="card-header">
        <span>🕉️ सनातन-ज्ञान-वाहिनी</span>
        <span className="rounded-full bg-[#1e1a2a] px-3 py-1 text-[10px] text-[#ff6b35]">{headerLabel}</span>
      </div>

      <div className="card-body">
        <div className="sanskrit">{mantra.devanagari}</div>
        {mantra.iast && <div className="iast">{mantra.iast}</div>}

        <hr className="divider" />

        {mantra.english && (
          <div className="english">“{mantra.english}”</div>
        )}

        <div className="lang-bar">
          {P0_LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`lang-btn ${lang === l.code ? 'selected' : ''}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="trans-box">
          <div className="mb-1 text-[10px] tracking-[1px] text-[#ff6b35]">{lang.toUpperCase()}</div>
          <div>{currentTrans}</div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#2a2530] px-4 py-3 text-xs text-[#8a8578]">
        <span className="font-medium text-[#d4a853]">{mantra.source}</span>
        <CardActions mantraId={mantra.id} onSave={onSave} />
      </div>
    </div>
  );
}

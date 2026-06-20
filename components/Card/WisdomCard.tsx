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
  isLoading?: boolean;
  error?: string | null;
}

const LANGS_14 = [
  { code: 'en', label: '🇬🇧 EN' },
  { code: 'hi', label: '🇮🇳 हि' },
  { code: 'te', label: '🇮🇳 తె' },
  { code: 'ta', label: '🇮🇳 த' },
  { code: 'id', label: '🇮🇩 ID' },
  { code: 'pt', label: '🇧🇷 PT' },
  { code: 'ru', label: '🇷🇺 RU' },
  { code: 'th', label: '🇹🇭 ไทย' },
  { code: 'vi', label: '🇻🇳 VI' },
  { code: 'tl', label: '🇵🇭 TL' },
  { code: 'bn', label: '🇧🇩 বাং' },
  { code: 'ne', label: '🇳🇵 ने' },
  { code: 'si', label: '🇱🇰 සි' },
];

export function WisdomCard({
  mantra,
  translations,
  variant = 'temple',
  onSave,
  isLoading = false,
  error = null,
}: WisdomCardProps) {
  const [lang, setLang] = useState('en');

  if (isLoading) {
    return (
      <div className="card mx-auto w-full max-w-[480px] animate-pulse">
        <div className="card-header">
          <span>🕉️ सनातन-ज्ञान-वाहिनी</span>
          <span className="rounded-full bg-[#1e1a2a] px-3 py-1 text-[10px] text-[#ff6b35]">LOADING</span>
        </div>
        <div className="card-body">
          <div className="h-20 bg-[#1a1628] rounded mb-3" />
          <div className="h-4 bg-[#1a1628] rounded w-3/4 mx-auto" />
          <div className="lang-bar">
            {LANGS_14.slice(0, 6).map((_, i) => (
              <div key={i} className="h-6 w-12 bg-[#1e1a2a] rounded-full" />
            ))}
          </div>
          <div className="h-12 bg-[#1a1628] rounded mt-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card mx-auto w-full max-w-[480px] p-6 text-center text-sm text-[#ff6b35]">
        Error loading wisdom: {error}
      </div>
    );
  }

  if (!mantra || !mantra.devanagari) {
    return (
      <div className="card mx-auto w-full max-w-[480px] p-6 text-center text-sm text-[#8a8578]">
        No wisdom card available today.
      </div>
    );
  }

  const currentTrans = translations?.[lang] || translations?.en || 'Translation coming soon in this language.';
  const headerLabel = variant === 'panchanga' ? '☀️ PANCHANGAM' : '📖 SHLOKA';
  const category = mantra.source.includes('Gita') ? 'Gita' : mantra.source.includes('Rig') ? 'Veda' : 'Mantra';

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

        <div className="lang-bar" role="tablist" aria-label="Translation language">
          {LANGS_14.map((l) => (
            <button
              key={l.code}
              role="tab"
              aria-selected={lang === l.code}
              onClick={(e) => { e.stopPropagation(); setLang(l.code); }}
              className={`lang-btn ${lang === l.code ? 'selected' : ''}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="trans-box" role="tabpanel">
          <div className="mb-1 text-[10px] tracking-[1px] text-[#ff6b35]">{lang.toUpperCase()}</div>
          <div>{currentTrans}</div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#2a2530] px-4 py-3 text-xs text-[#8a8578]">
        <span className="font-medium text-[#d4a853]">{mantra.source}</span>
        <span className="text-[10px] rounded bg-[#1e1a2a] px-2 py-0.5 text-[#d4a853]">{category}</span>
        <CardActions mantraId={mantra.id} mantraText={mantra.devanagari} iast={mantra.iast} translation={currentTrans} onSave={onSave} />
      </div>
    </div>
  );
}

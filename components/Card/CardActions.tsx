'use client';

import React from 'react';

interface Props {
  mantraId: string;
  mantraText?: string;
  iast?: string;
  translation?: string;
  onSave?: () => void;
}

export function CardActions({ mantraId, mantraText, iast, translation, onSave }: Props) {
  const fullText = [
    mantraText || '',
    iast ? `(${iast})` : '',
    translation ? `\n\n${translation}` : '',
  ].filter(Boolean).join(' ');

  const copy = async () => {
    const textToCopy = fullText || mantraId;
    try {
      await navigator.clipboard?.writeText(textToCopy);
    } catch {
      // ignore
    }
  };

  const share = () => {
    const tg = (window as { Telegram?: { WebApp?: { openTelegramLink?: (u: string) => void; share?: (d: unknown) => void } } }).Telegram?.WebApp;
    const url = typeof location !== 'undefined' ? location.href : '';
    const text = 'Daily Sanskrit wisdom from SamSkrithi';
    if (tg && typeof tg.openTelegramLink === 'function') {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
    } else if (tg && typeof (tg as unknown as { share?: (d: unknown) => void }).share === 'function') {
      (tg as unknown as { share: (d: unknown) => void }).share({ text, url });
    } else if (navigator.share) {
      navigator.share({ title: 'SamSkrithi', text, url }).catch(() => {});
    }
  };

  const speak = () => {
    try {
      const u = new SpeechSynthesisUtterance(mantraText || 'Daily wisdom');
      // Prefer hi or sanskrit voice if available; fallback ok
      u.lang = 'hi-IN';
      speechSynthesis.speak(u);
    } catch {}
  };

  return (
    <div className="flex items-center gap-3 text-base">
      <button onClick={speak} aria-label="Play Sanskrit audio" className="hover:text-[#ff6b35]" title="Play">🔊</button>
      <button onClick={copy} aria-label="Copy text" className="hover:text-[#ff6b35]" title="Copy">📋</button>
      <button onClick={() => { onSave?.(); }} aria-label="Save to collection" className="hover:text-[#ff6b35]" title="Save">💾</button>
      <button onClick={share} aria-label="Share" className="hover:text-[#ff6b35]" title="Share">🔗</button>
    </div>
  );
}

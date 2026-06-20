'use client';

import React from 'react';

interface Props {
  mantraId: string;
  onSave?: () => void;
}

export function CardActions({ mantraId, onSave }: Props) {
  const copy = async () => {
    // For now copy source or id
    await navigator.clipboard?.writeText(mantraId);
    alert('Copied to clipboard');
  };

  const share = () => {
    const tg = (window as { Telegram?: { WebApp?: { openTelegramLink?: (u: string) => void } } }).Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent('Daily wisdom from SamSkrithi')}`
      );
    } else {
      navigator.share?.({ title: 'SamSkrithi', url: location.href });
    }
  };

  const speak = () => {
    // Stub — browser TTS for English
    const u = new SpeechSynthesisUtterance('Daily Sanskrit wisdom');
    speechSynthesis.speak(u);
  };

  return (
    <div className="flex items-center gap-3 text-base">
      <button onClick={speak} aria-label="Play" className="hover:text-[#ff6b35]">🔊</button>
      <button onClick={copy} aria-label="Copy" className="hover:text-[#ff6b35]">📋</button>
      <button onClick={() => { onSave?.(); alert('Saved to your collection'); }} aria-label="Save" className="hover:text-[#ff6b35]">💾</button>
      <button onClick={share} aria-label="Share" className="hover:text-[#ff6b35]">🔗</button>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';

const THEMES = [
  { key: 'temple', label: '🌙 Temple', swatch: '#0a0a1a' },
  { key: 'saffron', label: '☀️ Saffron', swatch: '#fff1d6' },
  { key: 'forest', label: '🌿 Forest', swatch: '#132f20' },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState('temple');

  useEffect(() => {
    const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('ss_theme')) || 'temple';
    apply(saved);
  }, []);

  function apply(t: string) {
    document.documentElement.setAttribute('data-theme', t === 'temple' ? '' : t);
    setTheme(t);
    try { localStorage.setItem('ss_theme', t); } catch {}
  }

  return (
    <div className="flex gap-2">
      {THEMES.map(t => (
        <button
          key={t.key}
          onClick={() => apply(t.key)}
          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${theme === t.key ? 'border-[#d4a853] bg-[#d4a853] text-black' : 'border-[#2a2530]'}`}
          title={t.label}
        >
          <span className="inline-block h-3 w-3 rounded" style={{ background: t.swatch }} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

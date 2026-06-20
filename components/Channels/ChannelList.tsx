'use client';

import React from 'react';

const CHANNELS = [
  { id: 'main', name: '🕉️ Main', purpose: 'Daily wisdom, panchangam, mantras', handle: 'SamSkritham' },
  { id: 'games', name: '🎮 Games', purpose: 'Tournaments, challenges, leaderboards', handle: 'SamSkritham_Games' },
  { id: 'festivals', name: '🎪 Festivals', purpose: 'Festival alerts & special cards', handle: 'SamSkritham_Fest' },
  { id: 'learn', name: '📚 Learn', purpose: 'Gita series, deep dives, teachings', handle: 'SamSkritham_Learn' },
  { id: 'global', name: '🌍 Global', purpose: 'Community highlights & worldwide wisdom', handle: 'SamSkritham_Global' },
];

export function ChannelList() {
  return (
    <div className="space-y-3">
      {CHANNELS.map(ch => (
        <div key={ch.id} className="card p-4">
          <div className="font-medium">{ch.name}</div>
          <div className="text-sm text-[#8a8578] mt-0.5">{ch.purpose}</div>
          <a
            href={`https://t.me/${ch.handle}`}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-block text-xs text-[#d4a853] underline"
          >
            Subscribe / Open →
          </a>
          <div className="text-[10px] text-[#8a8578] mt-1">Preview: Latest wisdom drops daily</div>
        </div>
      ))}
      <p className="text-[10px] text-[#8a8578] px-1">Channels are managed on Telegram. Bot must be admin of each channel.</p>
    </div>
  );
}

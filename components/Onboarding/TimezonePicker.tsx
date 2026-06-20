'use client';

import React, { useState } from 'react';
import { Clock } from 'lucide-react';

interface Timezone {
  city: string;
  offset: number;
  zone: string;
}

const ZONES: Timezone[] = [
  { city: 'New Delhi (IST)', offset: 330, zone: 'Asia/Kolkata' },
  { city: 'Mumbai / India', offset: 330, zone: 'Asia/Kolkata' },
  { city: 'Kathmandu (Nepal)', offset: 345, zone: 'Asia/Kathmandu' },
  { city: 'Colombo (Sri Lanka)', offset: 330, zone: 'Asia/Colombo' },
  { city: 'UTC', offset: 0, zone: 'UTC' },
  { city: 'London', offset: 60, zone: 'Europe/London' },
  { city: 'Berlin / Paris', offset: 120, zone: 'Europe/Berlin' },
  { city: 'Moscow', offset: 180, zone: 'Europe/Moscow' },
  { city: 'Dubai', offset: 240, zone: 'Asia/Dubai' },
  { city: 'Singapore', offset: 480, zone: 'Asia/Singapore' },
  { city: 'Tokyo', offset: 540, zone: 'Asia/Tokyo' },
  { city: 'Sydney', offset: 600, zone: 'Australia/Sydney' },
  { city: 'New York (EST)', offset: -300, zone: 'America/New_York' },
  { city: 'Los Angeles (PST)', offset: -480, zone: 'America/Los_Angeles' },
  { city: 'Johannesburg', offset: 120, zone: 'Africa/Johannesburg' },
];

interface Props {
  onSelect: (offset: number, label: string) => void;
  current?: { offset: number; label: string };
}

function formatOffset(min: number): string {
  const sign = min >= 0 ? '+' : '-';
  const h = Math.floor(Math.abs(min) / 60);
  const m = Math.abs(min) % 60;
  return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function TimezonePicker({ onSelect, current }: Props) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(current || { offset: 0, label: '' });

  const filtered = ZONES.filter(z =>
    z.city.toLowerCase().includes(search.toLowerCase()) ||
    z.zone.toLowerCase().includes(search.toLowerCase())
  );

  function handleAuto() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -new Date().getTimezoneOffset(); // minutes east of UTC
    const label = `${tz} (${formatOffset(offset)})`;
    const sel = { offset, label };
    setSelected(sel);
    onSelect(offset, label);
  }

  function handlePick(z: Timezone) {
    const label = `${z.city} (${formatOffset(z.offset)})`;
    const sel = { offset: z.offset, label };
    setSelected(sel);
    onSelect(z.offset, label);
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleAuto}
        className="btn btn-gold w-full flex items-center justify-center gap-2 text-base"
      >
        <Clock size={18} /> Auto-detect my timezone
      </button>
      <div className="text-center text-xs text-[var(--text-muted)] -mt-1">Uses your device’s current timezone</div>

      <div>
        <input
          type="text"
          placeholder="Search city or region…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 py-2.5 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)]"
        />
      </div>

      <div className="max-h-[220px] overflow-auto pr-1 space-y-1 text-sm">
        {filtered.length === 0 && (
          <div className="text-[var(--text-muted)] text-xs py-2">No matches. Use auto-detect above.</div>
        )}
        {filtered.map((z, idx) => {
          const label = `${z.city} (${formatOffset(z.offset)})`;
          const isSel = selected.offset === z.offset && selected.label === label;
          return (
            <button
              key={idx}
              onClick={() => handlePick(z)}
              className={`w-full text-left px-4 py-2.5 rounded-2xl border flex items-center justify-between ${isSel ? 'border-[var(--gold)] bg-[var(--bg-card)]' : 'border-[var(--border)] hover:border-[var(--gold)]/60'}`}
            >
              <span>{z.city}</span>
              <span className="font-mono text-xs text-[var(--text-muted)]">{formatOffset(z.offset)}</span>
            </button>
          );
        })}
      </div>

      {selected.label && (
        <div className="text-center text-xs text-[var(--gold)] mt-1">Selected: {selected.label}</div>
      )}
    </div>
  );
}

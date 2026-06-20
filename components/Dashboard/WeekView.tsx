'use client';

import React from 'react';
import Link from 'next/link';

interface Day {
  date: string;
  panchanga?: { tithi?: string; nakshatra?: string };
  is_festival?: boolean;
  special_note?: string | null;
}

export function WeekView({ days = [] as Day[] }) {
  if (!days.length) return null;

  return (
    <div className="mt-4">
      <div className="section-title mb-2">This Week</div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((d, idx) => {
          const dt = new Date(d.date);
          const label = dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
          const today = new Date().toISOString().slice(0,10) === d.date;
          return (
            <Link
              key={idx}
              href={`/?date=${d.date}`}
              className={`card min-w-[92px] p-3 text-center ${today ? 'ring-1 ring-[#d4a853]' : ''}`}
            >
              <div className="text-[10px] text-[#8a8578]">{label}</div>
              <div className="mt-1 text-sm font-medium text-[#e8e0d0] truncate">{d.panchanga?.tithi || '—'}</div>
              {d.is_festival && <div className="mt-1 text-[10px] text-amber-400">✨ Special</div>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';

const JYOTIRLINGAS = [
  'Somnath', 'Mallikarjuna', 'Mahakaleshwar', 'Omkareshwar', 'Kedarnath',
  'Bhimashankar', 'Vishwanath', 'Trimbakeshwar', 'Baidyanath', 'Nageshwar',
  'Rameshwar', 'Grishneshwar'
];

export default function Temple() {
  return (
    <MiniAppShell title="Temple Quest">
      <div className="pt-3">
        <div className="mb-4 text-center text-sm text-[#8a8578]">12 Jyotirlinga Pilgrimage • Progress</div>
        <div className="grid grid-cols-2 gap-3">
          {JYOTIRLINGAS.map((name, i) => (
            <div key={i} className="card p-4 text-sm">
              🛕 {name}
              <div className="text-[10px] mt-1 text-[#8a8578]">{i < 3 ? 'Visited' : 'Locked'}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-xs text-[#d4a853]">Complete daily challenges to collect stamps</div>
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

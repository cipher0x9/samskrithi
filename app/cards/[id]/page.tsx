'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WisdomCard } from '@/components/Card/WisdomCard';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';

export const dynamic = 'force-dynamic';

export default function CardViewer() {
  const params = useParams<{ id: string }>();
  const id = params?.id || 'gita-2.47';
  const [card, setCard] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/cards/${id}?all=true`).then(r => r.json()).then(setCard);
  }, [id]);

  return (
    <MiniAppShell title="Wisdom Card">
      <div className="pt-4">
        {card ? (
          <WisdomCard
            mantra={{ id: (card as any).id, devanagari: (card as any).devanagari, iast: (card as any).iast, english: (card as any).english, source: (card as any).source }} // eslint-disable-line @typescript-eslint/no-explicit-any
            translations={(card as any).translations || {}} // eslint-disable-line @typescript-eslint/no-explicit-any
            onSave={() => {
              // optimistic save stub
            }}
          />
        ) : (
          <div className="card h-64 animate-pulse" />
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => history.back()} className="btn btn-ghost">Back</button>
          <a href="/games/akshara?seed=gita-2.47" className="btn btn-primary">Play with this verse</a>
        </div>
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}

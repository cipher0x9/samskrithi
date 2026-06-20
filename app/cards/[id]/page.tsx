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
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/cards/${id}?all=true`).then(r => {
      if (!r.ok) throw new Error('load fail');
      return r.json();
    }).then((d) => {
      if (active) {
        setCard(d);
        setErr(null);
      }
    }).catch(() => {
      if (active) {
        setErr('Could not load card');
        setCard({
          id: 'gita-2.47',
          devanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।2.47।।',
          iast: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana mā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi',
          source: 'Bhagavad Gita 2.47',
          translations: { en: 'You have the right to work only, but never to its fruits.' }
        });
      }
    });
    return () => { active = false; };
  }, [id]);

  return (
    <MiniAppShell title="Wisdom Card">
      <div className="pt-4">
        {card ? (
          <WisdomCard
            mantra={{
              id: String((card as unknown as {id?: string}).id || ''),
              devanagari: String((card as unknown as {devanagari?: string}).devanagari || ''),
              iast: (card as unknown as {iast?: string}).iast,
              english: (card as unknown as {english?: string}).english,
              source: String((card as unknown as {source?: string}).source || ''),
            }}
            translations={(card as unknown as {translations?: Record<string, string>}).translations || {}}
            onSave={() => {}}
            error={err}
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

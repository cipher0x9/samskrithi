'use client';

import React, { useEffect, useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { TimezonePicker } from './TimezonePicker';
import { LanguagePicker } from './LanguagePicker';
import { NameStep } from './NameStep';
import { getTzOffset } from '@/lib/utils';

interface Props {
  onComplete: (tzOffset: number) => void;
  initialName?: string;
}

const STEPS = 5; // 0..4

function Progress({ current }: { current: number }) {
  return (
    <div className="onboard-progress">
      {Array.from({ length: STEPS }).map((_, i) => (
        <div key={i} className={`onboard-dot ${i <= current ? 'active' : ''}`} />
      ))}
    </div>
  );
}

export function OnboardingFlow({ onComplete, initialName }: Props) {
  const [step, setStep] = useState(0);
  const [tzOffset, setTzOffset] = useState(0);
  const [tzLabel, setTzLabel] = useState('');
  const [lang, setLang] = useState('en');
  const [name, setName] = useState(initialName || 'Seeker');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill from Telegram on mount (first_name + language_code)
  useEffect(() => {
    try {
      const tg = (window as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { first_name?: string; language_code?: string } }; initData?: string } } }).Telegram?.WebApp;
      if (tg?.initDataUnsafe?.user) {
        const u = tg.initDataUnsafe.user;
        if (u.first_name && !initialName) setName(u.first_name);
        if (u.language_code) setLang(u.language_code === 'hi' || u.language_code === 'te' ? u.language_code : 'en');
      }
      // If no TG, try quick auto tz hint
      if (!tzLabel) {
        const off = getTzOffset();
        if (off !== 0) {
          setTzOffset(off);
          const h = Math.floor(Math.abs(off) / 60);
          const m = Math.abs(off) % 60;
          const s = off >= 0 ? '+' : '-';
          setTzLabel(`Device (${s}${h}:${String(m).padStart(2, '0')})`);
        }
      }
    } catch {
      /* ignore */
    }
  }, [initialName, tzLabel]);

  function getInitData(): string {
    return (
      (window as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp?.initData || ''
    );
  }

  function next() {
    setStep((s) => Math.min(s + 1, STEPS - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleTzSelect(offset: number, label: string) {
    setTzOffset(offset);
    setTzLabel(label);
  }

  async function handleComplete() {
    setSaving(true);
    setError(null);

    const initData = getInitData();
    const prefs = { onboarded: true, theme: 'temple' as const };

    try {
      const res = await fetch('/api/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData,
          tz_offset: tzOffset,
          language_code: lang,
          first_name: name.trim(),
          prefs,
        }),
      });
      const json = await res.json();
      if (!json.ok && !json._dev) throw new Error(json.error || 'save failed');
    } catch (e: any) {
      // Still allow flow to finish in dev
      if (process.env.NODE_ENV === 'production') {
        setError('Could not save. Please try again.');
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    onComplete(tzOffset || 330); // default IST-ish for demo
  }

  function skipDev() {
    // Dev convenience: set a sensible default (IST) and mark onboarded
    onComplete(330);
  }

  const showSkip = process.env.NODE_ENV !== 'production';

  return (
    <div className="card p-5 max-w-[460px] mx-auto mt-4 mb-8">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs tracking-[1.5px] text-[var(--text-muted)]">SETUP • STEP {step + 1} OF {STEPS}</div>
        {step > 0 && (
          <button onClick={back} className="text-xs text-[var(--text-muted)] underline">Back</button>
        )}
      </div>

      <Progress current={step} />

      {step === 0 && <WelcomeScreen onNext={next} onSkip={showSkip ? skipDev : undefined} />}

      {step === 1 && (
        <div>
          <div className="mb-4 text-center">
            <div className="text-xl font-semibold text-[var(--gold)]">Your local time</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">Panchanga, challenges and daily wisdom will use your timezone.</div>
          </div>
          <TimezonePicker onSelect={handleTzSelect} current={tzOffset ? { offset: tzOffset, label: tzLabel } : undefined} />
          <div className="mt-5 flex gap-3">
            <button onClick={back} className="btn btn-ghost flex-1">Back</button>
            <button onClick={next} disabled={!tzOffset && !tzLabel} className="btn btn-primary flex-1">Next</button>
          </div>
          {showSkip && <button onClick={skipDev} className="mt-3 text-xs w-full text-[var(--text-muted)]">Skip &amp; use IST (dev)</button>}
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-4 text-center">
            <div className="text-xl font-semibold text-[var(--gold)]">Preferred language</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">Choose for greetings and primary translations.</div>
          </div>
          <LanguagePicker value={lang} onChange={setLang} />
          <div className="mt-5 flex gap-3">
            <button onClick={back} className="btn btn-ghost flex-1">Back</button>
            <button onClick={next} className="btn btn-primary flex-1">Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="mb-4 text-center">
            <div className="text-xl font-semibold text-[var(--gold)]">Almost there</div>
          </div>
          <NameStep value={name} onChange={setName} onNext={next} />
          <div className="mt-2 text-center">
            <button onClick={back} className="text-xs text-[var(--text-muted)] underline">Back</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-2">
          <div className="text-4xl mb-3">🙏</div>
          <div className="text-2xl font-semibold text-[var(--gold)]">Ready, {name.split(' ')[0] || 'Seeker'}?</div>

          <div className="mt-4 card p-4 text-left text-sm bg-[var(--bg-deep)]/60">
            <div className="text-[var(--text-muted)] text-xs mb-1">YOUR PREFERENCES</div>
            <div>Timezone: <span className="text-[var(--gold)]">{tzLabel || `Offset ${tzOffset}`}</span></div>
            <div>Language: <span className="text-[var(--gold)]">{lang.toUpperCase()}</span></div>
            <div>Name: <span className="text-[var(--gold)]">{name}</span></div>
          </div>

          {error && <div className="text-xs text-[#ff6b35] mt-3">{error}</div>}

          <button
            onClick={handleComplete}
            disabled={saving}
            className="btn btn-gold w-full mt-5"
          >
            {saving ? 'Saving your path…' : 'Let’s begin'}
          </button>

          <div className="mt-3 text-[10px] text-[var(--text-muted)]">
            Your local panchanga and daily date will now be accurate.
          </div>
          {showSkip && (
            <button onClick={skipDev} className="mt-4 text-xs underline text-[var(--text-muted)]">Use defaults (dev skip)</button>
          )}
        </div>
      )}
    </div>
  );
}

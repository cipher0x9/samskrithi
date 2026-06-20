'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Share2, Volume2, X } from 'lucide-react';
import { getRandomWisdomFact, type Fact, type WisdomLanguage } from '@/lib/wisdom';
import styles from './WisdomPopup.module.css';

interface WisdomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English', speech: 'en-IN' },
  { code: 'hi', label: 'हि', name: 'हिन्दी', speech: 'hi-IN' },
  { code: 'te', label: 'తె', name: 'తెలుగు', speech: 'te-IN' },
] as const;

const CONTENT_KEYS = {
  en: { title: 'title_en', body: 'body_en' },
  hi: { title: 'title_hi', body: 'body_hi' },
  te: { title: 'title_te', body: 'body_te' },
} as const satisfies Record<WisdomLanguage, { title: keyof Fact; body: keyof Fact }>;

function normalizeLanguage(lang: string | undefined): WisdomLanguage {
  const shortCode = lang?.toLocaleLowerCase().split('-')[0];
  return shortCode === 'hi' || shortCode === 'te' ? shortCode : 'en';
}

function shareUrl(text: string, url: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

export function WisdomPopup({ isOpen, onClose, lang }: WisdomPopupProps) {
  const [language, setLanguage] = useState<WisdomLanguage>(() => normalizeLanguage(lang));
  const [fact, setFact] = useState<Fact>(() => getRandomWisdomFact(undefined, lang));
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // sync language prop change to internal without cascading in mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLanguage(normalizeLanguage(lang));
  }, [lang]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.speechSynthesis?.cancel();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const keys = CONTENT_KEYS[language];
  const title = String(fact[keys.title]);
  const body = String(fact[keys.body]);
  const languageConfig = LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0];

  const showNext = () => {
    let next = getRandomWisdomFact(undefined, language);
    if (next.id === fact.id) {
      next = getRandomWisdomFact(undefined, language);
    }
    setFact(next);
  };

  const listen = () => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${title}. ${body}. ${fact.source}`);
    utterance.lang = languageConfig.speech;
    utterance.rate = 0.82;
    utterance.pitch = 0.96;
    window.speechSynthesis.speak(utterance);
  };

  const share = async () => {
    const text = `${title}\n\n${body}\n— ${fact.source}`;
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'SamSkrithi Wisdom', text, url });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }

    const telegram = (window as Window & {
      Telegram?: { WebApp?: { openTelegramLink?: (target: string) => void } };
    }).Telegram?.WebApp;
    const target = shareUrl(text, url);

    if (telegram?.openTelegramLink) telegram.openTelegramLink(target);
    else window.open(target, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        className={`card ${styles.dialog}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wisdom-title"
        aria-describedby="wisdom-body"
      >
        <div className={styles.templeTop} aria-hidden="true"><span /><span /><span /><span /><span /></div>

        <header className={styles.header}>
          <div className={styles.identity}>
            <span className={styles.miniRobo} aria-hidden="true">ॐ</span>
            <div>
              <p className={styles.eyebrow}>SAMSKRITHI GUIDE</p>
              <p className={styles.name}>SamSkrithi Robo</p>
            </div>
          </div>
          <button ref={closeButtonRef} type="button" className={styles.iconButton} onClick={onClose} aria-label="Close wisdom">
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.content}>
          <span className={styles.category}>{fact.category}</span>
          <h2 id="wisdom-title" className={styles.title}>{title}</h2>
          <p id="wisdom-body" className={language === 'en' ? styles.body : `${styles.body} sanskrit`}>{body}</p>
          <div className={styles.source}>
            <span>Verified source</span>
            <cite>{fact.source}</cite>
          </div>

          <div className={styles.languageRow} role="group" aria-label="Wisdom language">
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`${styles.languageButton} ${language === item.code ? styles.languageActive : ''}`}
                onClick={() => setLanguage(item.code)}
                aria-pressed={language === item.code}
                title={item.name}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <footer className={styles.actions}>
          <button type="button" className={styles.secondaryAction} onClick={listen}>
            <Volume2 size={17} aria-hidden="true" /> Listen
          </button>
          <button type="button" className={styles.secondaryAction} onClick={share}>
            <Share2 size={17} aria-hidden="true" /> Share
          </button>
          <button type="button" className={styles.nextAction} onClick={showNext}>
            Next wisdom <ChevronRight size={17} aria-hidden="true" />
          </button>
        </footer>
      </section>
    </div>
  );
}

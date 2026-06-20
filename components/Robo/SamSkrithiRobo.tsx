'use client';

import { useCallback, useEffect, useState } from 'react';
import { WisdomPopup } from '@/components/Robo/WisdomPopup';
import styles from './SamSkrithiRobo.module.css';

export interface SamSkrithiRoboProps {
  celebrate?: boolean;
  onWisdomOpen?: () => void;
  lang?: string;
}

const GREETINGS: Record<'en' | 'hi' | 'te', string> = {
  en: 'Namaste! Tap for timeless wisdom.',
  hi: 'नमस्ते! ज्ञान के लिए मुझे छुएँ।',
  te: 'నమస్తే! జ్ఞానం కోసం నన్ను తాకండి.',
};

function greetingFor(lang: string | undefined): string {
  const shortCode = lang?.toLocaleLowerCase().split('-')[0];
  return shortCode === 'hi' || shortCode === 'te' ? GREETINGS[shortCode] : GREETINGS.en;
}

export function SamSkrithiRobo({ celebrate = false, onWisdomOpen, lang = 'en' }: SamSkrithiRoboProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const greetingTimer = window.setTimeout(() => setShowGreeting(false), 4800);
    return () => window.clearTimeout(greetingTimer);
  }, []);

  const openWisdom = useCallback(() => {
    setShowGreeting(false);
    setIsOpen(true);
    onWisdomOpen?.();
  }, [onWisdomOpen]);

  const closeWisdom = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <aside className={styles.dock} aria-label="SamSkrithi wisdom guide">
        {showGreeting && (
          <div className={styles.greeting} role="status">
            {greetingFor(lang)}
          </div>
        )}

        <button
          type="button"
          className={`${styles.robotButton} ${celebrate ? styles.celebrating : styles.introWave}`}
          onClick={openWisdom}
          aria-label="Open wisdom with SamSkrithi Robo"
          aria-haspopup="dialog"
        >
          <span className={styles.sparkles} aria-hidden="true">
            <i /><i /><i /><i /><i /><i />
          </span>
          <span className={styles.floatBody} aria-hidden="true">
            <span className={styles.antenna}><i /></span>
            <span className={styles.earLeft} />
            <span className={styles.earRight} />
            <span className={styles.head}>
              <span className={styles.tilak} />
              <span className={styles.face}>
                <i className={styles.eye} /><i className={styles.eye} />
                <i className={styles.smile} />
              </span>
            </span>
            <span className={styles.armLeft}><i /></span>
            <span className={styles.armRight}><i /></span>
            <span className={styles.body}>
              <span className={styles.chestOm}>ॐ</span>
              <span className={styles.saffronBand} />
            </span>
          </span>
        </button>
      </aside>

      <WisdomPopup isOpen={isOpen} onClose={closeWisdom} lang={lang} />
    </>
  );
}

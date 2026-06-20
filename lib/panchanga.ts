export interface Panchanga {
  date: string;
  weekday?: string;
  tithi?: string;
  tithi_index?: number;
  nakshatra?: string;
  nakshatra_index?: number;
  yoga?: string;
  yoga_index?: number;
  karana?: string;
  karana_index?: number;
  paksha?: string;
  masa?: string;
  sunrise?: string;
  sunset?: string;
  deity_of_day?: string;
  samvatsara?: string;
  special?: Record<string, unknown>;
}

export interface DailyPayload {
  date: string;
  panchanga: Panchanga;
  free_card: {
    id: string;
    devanagari: string;
    iast?: string;
    english?: string;
    source: string;
    translations: Record<string, string>;
  } | null;
  challenges: Array<{
    mode: 'akshara' | 'quiz' | 'battle' | 'sandhi';
    seed: string;
    target_chars?: number;
  }>;
  user?: {
    streak_current: number;
    xp: number;
    level: string;
  } | null;
}

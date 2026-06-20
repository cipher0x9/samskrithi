import wisdomData from '@/data/wisdom.json';

export const WISDOM_CATEGORIES = [
  'Human Life',
  'Nature',
  'Space/Cosmos',
  'Creation',
  'Vedas',
  'Upanishads',
  'Puranas',
  'Itihasas',
  'Granthas',
  'Mantras',
  'Ancient China',
  'Global Wisdom',
] as const;

export type WisdomCategory = (typeof WISDOM_CATEGORIES)[number];
export type WisdomLanguage = 'en' | 'hi' | 'te';

export interface Fact {
  id: string;
  category: WisdomCategory;
  title_en: string;
  title_hi: string;
  title_te: string;
  body_en: string;
  body_hi: string;
  body_te: string;
  source: string;
  tags: string[];
  difficulty: number;
}

const LANGUAGE_BODY_KEYS = {
  en: 'body_en',
  hi: 'body_hi',
  te: 'body_te',
} as const satisfies Record<WisdomLanguage, keyof Fact>;

function isWisdomLanguage(value: string | undefined): value is WisdomLanguage {
  return value === 'en' || value === 'hi' || value === 'te';
}

function isFact(value: unknown): value is Fact {
  if (!value || typeof value !== 'object') return false;

  const fact = value as Record<string, unknown>;
  const requiredStrings = [
    'id',
    'category',
    'title_en',
    'title_hi',
    'title_te',
    'body_en',
    'body_hi',
    'body_te',
    'source',
  ];

  return (
    requiredStrings.every((key) => typeof fact[key] === 'string' && fact[key].length > 0) &&
    WISDOM_CATEGORIES.includes(fact.category as WisdomCategory) &&
    Array.isArray(fact.tags) &&
    fact.tags.every((tag) => typeof tag === 'string') &&
    typeof fact.difficulty === 'number' &&
    Number.isInteger(fact.difficulty) &&
    fact.difficulty >= 1 &&
    fact.difficulty <= 5
  );
}

const FACTS: Fact[] = (() => {
  if (!Array.isArray(wisdomData) || !wisdomData.every(isFact)) {
    throw new Error('data/wisdom.json contains an invalid wisdom fact');
  }

  return wisdomData;
})();

export function getAllWisdomFacts(): Fact[] {
  return [...FACTS];
}

export function getRandomWisdomFact(category?: string, preferredLang?: string): Fact {
  const categoryMatches = category
    ? FACTS.filter((fact) => fact.category.toLocaleLowerCase() === category.toLocaleLowerCase())
    : FACTS;
  const pool = categoryMatches.length > 0 ? categoryMatches : FACTS;
  const language = isWisdomLanguage(preferredLang) ? preferredLang : 'en';
  const languageKey = LANGUAGE_BODY_KEYS[language];
  const localizedPool = pool.filter((fact) => fact[languageKey].trim().length > 0);
  const selectionPool = localizedPool.length > 0 ? localizedPool : pool;

  return selectionPool[Math.floor(Math.random() * selectionPool.length)];
}

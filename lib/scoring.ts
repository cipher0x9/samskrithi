export type GameMode = 'akshara' | 'quiz' | 'battle' | 'sandhi';

export type Level =
  | 'Prarambhika'
  | 'Madhyama'
  | 'Adhyapaka'
  | 'Pandita'
  | 'Acharya';

export interface ScoreInput {
  mode: GameMode;
  accuracy: number;
  elapsedSec: number;
  targetSec?: number;
  streakCurrent?: number;
}

export interface ScoreResult {
  xp: number;
  baseXP: number;
  accuracy: number;
  timeBonus: number;
  streakMultiplier: number;
}

export interface LetterAttempt {
  letter: string;
  correct: boolean;
}

export interface LetterMastery {
  letter: string;
  correctAttempts: number;
  totalAttempts: number;
  mastered: boolean;
}

export const MAX_XP = Number.MAX_SAFE_INTEGER;
export const DEFAULT_MASTERY_THRESHOLD = 3;

const DEFAULT_TARGETS: Readonly<Record<GameMode, number>> = {
  akshara: 90,
  quiz: 120,
  battle: 180,
  sandhi: 60,
};

const LEVEL_THRESHOLDS: ReadonlyArray<Readonly<{ level: Level; minimumXP: number }>> = [
  { level: 'Acharya', minimumXP: 1000 },
  { level: 'Pandita', minimumXP: 500 },
  { level: 'Adhyapaka', minimumXP: 200 },
  { level: 'Madhyama', minimumXP: 50 },
  { level: 'Prarambhika', minimumXP: 0 },
];

function clamp(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, value));
}

function toNonNegativeInteger(value: number): number {
  return Math.floor(clamp(value, 0, MAX_XP));
}

/**
 * Calculates a bonus from 0 to 30. A non-positive target cannot establish a
 * meaningful time ratio, so it produces no bonus.
 *
 * @example calculateTimeBonus(50, 100) === 15
 * @example calculateTimeBonus(120, 100) === 0
 * @example calculateTimeBonus(0, 0) === 0
 */
export function calculateTimeBonus(elapsedSec: number, targetSec: number): number {
  if (!Number.isFinite(targetSec) || targetSec <= 0) return 0;

  const safeElapsed = Math.max(0, Number.isFinite(elapsedSec) ? elapsedSec : targetSec);
  return clamp(((targetSec - safeElapsed) / targetSec) * 30, 0, 30);
}

/**
 * @example calculateStreakMultiplier(0) === 1
 * @example calculateStreakMultiplier(5) === 1.5
 * @example calculateStreakMultiplier(-2) === 1
 */
export function calculateStreakMultiplier(streakCurrent: number): number {
  const safeStreak = toNonNegativeInteger(streakCurrent);
  return 1 + safeStreak * 0.1;
}

/**
 * XP is the floored result of `(accuracy * 50 + timeBonus) * streakMultiplier`.
 * The unrounded pre-multiplier value remains available as `baseXP`.
 *
 * @example computeScore({ mode: 'akshara', accuracy: 0.8, elapsedSec: 60, streakCurrent: 10 }).xp === 100
 * @example computeScore({ mode: 'quiz', accuracy: -1, elapsedSec: 20, targetSec: 0 }).xp === 0
 */
export function computeScore(input: Readonly<ScoreInput>): ScoreResult {
  const accuracy = clamp(input.accuracy, 0, 1);
  const targetSec = input.targetSec ?? DEFAULT_TARGETS[input.mode];
  const timeBonus = calculateTimeBonus(input.elapsedSec, targetSec);
  const streakMultiplier = calculateStreakMultiplier(input.streakCurrent ?? 0);
  const baseXP = accuracy * 50 + timeBonus;
  const xp = toNonNegativeInteger(baseXP * streakMultiplier);

  return { xp, baseXP, accuracy, timeBonus, streakMultiplier };
}

/**
 * Acharya is the terminal level; XP above its threshold remains Acharya.
 *
 * @example computeLevel(-10) === 'Prarambhika'
 * @example computeLevel(199) === 'Madhyama'
 * @example computeLevel(1000) === 'Acharya'
 * @example computeLevel(Number.MAX_SAFE_INTEGER) === 'Acharya'
 */
export function computeLevel(xp: number): Level {
  const safeXP = clamp(xp, 0, MAX_XP);
  return LEVEL_THRESHOLDS.find(({ minimumXP }) => safeXP >= minimumXP)?.level
    ?? 'Prarambhika';
}

/**
 * Returns the XP boundary for the next level. Acharya returns its own boundary
 * because it is the capped level and has no next level.
 *
 * @example getXPForNext('Madhyama') === 200
 * @example getXPForNext('Acharya') === 1000
 */
export function getXPForNext(level: Level): number {
  const nextThreshold: Readonly<Record<Level, number>> = {
    Prarambhika: 50,
    Madhyama: 200,
    Adhyapaka: 500,
    Pandita: 1000,
    Acharya: 1000,
  };

  return nextThreshold[level];
}

/**
 * Returns a new mastery collection without mutating either input. Mastery is
 * sticky once earned and defaults to three correct attempts per letter.
 *
 * @example updateLetterMastery([], [{ letter: 'अ', correct: true }], 1)[0].mastered === true
 * @example getMasteredLetters(updateLetterMastery([], [{ letter: 'क', correct: true }], 1))[0] === 'क'
 */
export function updateLetterMastery(
  current: readonly Readonly<LetterMastery>[],
  attempts: readonly Readonly<LetterAttempt>[],
  masteryThreshold = DEFAULT_MASTERY_THRESHOLD,
): LetterMastery[] {
  const threshold = Math.max(1, toNonNegativeInteger(masteryThreshold));
  const byLetter = new Map<string, LetterMastery>();

  for (const entry of current) {
    const letter = entry.letter.trim();
    if (!letter) continue;

    const correctAttempts = toNonNegativeInteger(entry.correctAttempts);
    const totalAttempts = Math.max(
      correctAttempts,
      toNonNegativeInteger(entry.totalAttempts),
    );

    byLetter.set(letter, {
      letter,
      correctAttempts,
      totalAttempts,
      mastered: entry.mastered || correctAttempts >= threshold,
    });
  }

  for (const attempt of attempts) {
    const letter = attempt.letter.trim();
    if (!letter) continue;

    const previous = byLetter.get(letter) ?? {
      letter,
      correctAttempts: 0,
      totalAttempts: 0,
      mastered: false,
    };
    const correctAttempts = previous.correctAttempts + (attempt.correct ? 1 : 0);

    byLetter.set(letter, {
      letter,
      correctAttempts,
      totalAttempts: previous.totalAttempts + 1,
      mastered: previous.mastered || correctAttempts >= threshold,
    });
  }

  return Array.from(byLetter.values());
}

/** @example getMasteredLetters([{ letter: 'अ', correctAttempts: 3, totalAttempts: 3, mastered: true }]) // ['अ'] */
export function getMasteredLetters(
  mastery: readonly Readonly<LetterMastery>[],
): string[] {
  return mastery.filter(({ mastered }) => mastered).map(({ letter }) => letter);
}

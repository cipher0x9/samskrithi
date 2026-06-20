export type GameMode = 'akshara' | 'quiz' | 'battle' | 'sandhi';

export interface ScoreInput {
  mode: GameMode;
  accuracy: number; // 0..1
  elapsedSec: number;
  targetSec?: number; // per mode default
  streakCurrent?: number;
}

export interface ScoreResult {
  xp: number;
  accuracy: number;
  timeBonus: number;
  streakMultiplier: number;
}

const DEFAULT_TARGETS: Record<GameMode, number> = {
  akshara: 90,
  quiz: 120,
  battle: 180,
  sandhi: 60,
};

export function computeScore(input: ScoreInput): ScoreResult {
  const { mode, accuracy, elapsedSec, streakCurrent = 0 } = input;
  const target = DEFAULT_TARGETS[mode] ?? 90;

  const clampedAcc = Math.max(0, Math.min(1, accuracy));
  const timeBonus = Math.max(0, Math.min(30, ((target - elapsedSec) / target) * 30));

  let xp = Math.floor(50 * clampedAcc + timeBonus);
  if (xp < 5) xp = 5; // floor for attempt

  const streakMultiplier = 1 + Math.min(2, streakCurrent * 0.1);

  return {
    xp: Math.floor(xp * streakMultiplier),
    accuracy: clampedAcc,
    timeBonus: Math.round(timeBonus),
    streakMultiplier: Number(streakMultiplier.toFixed(2)),
  };
}

export function computeLevel(xp: number): string {
  if (xp >= 1000) return 'Acharya';
  if (xp >= 500) return 'Pandita';
  if (xp >= 200) return 'Adhyapaka';
  if (xp >= 50) return 'Madhyama';
  return 'Prarambhika';
}

export function getXPForNext(level: string): number {
  const map: Record<string, number> = {
    Prarambhika: 50,
    Madhyama: 200,
    Adhyapaka: 500,
    Pandita: 1000,
    Acharya: 2000,
  };
  return map[level] ?? 1000;
}

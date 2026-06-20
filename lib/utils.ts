export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function deterministicSeed(userId: number | string, date: string): string {
  return `${userId}-${date}`;
}

export function splitDevanagari(text: string): string[] {
  // Simple grapheme-aware MVP split for akshara game
  // Keep conjuncts reasonable for puzzle
  return Array.from(text.replace(/[।॥\s\.\,\!\?]+/g, '')).slice(0, 24);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Compute ISO date string (YYYY-MM-DD) for the given tz offset (minutes east of UTC).
 * Client and server use for local "today".
 */
export function getLocalDateISO(tzOffsetMin: number): string {
  const now = new Date();
  // Convert to "UTC ms" then apply target offset
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const localMs = utcMs + tzOffsetMin * 60000;
  return new Date(localMs).toISOString().slice(0, 10);
}

/** Alias to satisfy explicit task requirement while keeping plan/weekly compatible */
export const getLocalISODate = getLocalDateISO;

/** Client helper: current device tz offset in minutes east of UTC (e.g. 330 for IST) */
export function getTzOffset(): number {
  return -new Date().getTimezoneOffset();
}

/**
 * needsOnboarding: show flow if tz never set (default 0) OR onboarded flag not true.
 * Conservative to avoid false-positive re-onboards.
 */
export function needsOnboarding(user?: { tz_offset?: number | null; prefs?: Record<string, unknown> | null }): boolean {
  if (!user) return false;
  const tz = typeof user.tz_offset === 'number' ? user.tz_offset : 0;
  const prefs = (user.prefs || {}) as Record<string, unknown>;
  const onboarded = prefs.onboarded === true;
  return tz === 0 || !onboarded;
}

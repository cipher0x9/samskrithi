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

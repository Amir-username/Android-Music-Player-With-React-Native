import { artworkGradients } from '@/theme/tokens';

/** Format milliseconds as m:ss (e.g. 232000 -> "3:52") */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** Deterministic string hash (djb2) — used to seed gradient selection. */
export function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

/** Pick a stable gradient pair for a given seed string. */
export function gradientFor(seed: string): readonly [string, string] {
  const index = hashString(seed) % artworkGradients.length;
  const pair = artworkGradients[index];
  if (pair) return pair;
  return ['#3B82F6', '#06B6D4'];
}

/** First letter used as artwork fallback initial. */
export function initialOf(name: string): string {
  const trimmed = name.trim();
  return trimmed[0]?.toUpperCase() ?? '#';
}

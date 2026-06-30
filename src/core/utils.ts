// Generic scoring utilities (guide 3.3).

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function safeNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Logarithmic ratio scoring — avoids high income drowning out other dimensions. */
export function ratioScore(ratio: number): number {
  if (!Number.isFinite(ratio) || ratio <= 0) return 0;
  return clamp(50 + 35 * Math.log2(ratio));
}

/** Positive 1–5 level → 0–100. */
export function levelToScore(level: number): number {
  const l = clamp(level, 1, 5);
  return (l - 1) * 25;
}

/** Negative 1–5 level (higher = worse) → 0–100, reversed. */
export function reverseLevelToScore(level: number): number {
  const l = clamp(level, 1, 5);
  return (5 - l) * 25;
}

export function roundScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

/** Format an integer with thousands separators (e.g. 3842 -> "3,842"). */
export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return Math.round(value).toLocaleString("en-US");
}

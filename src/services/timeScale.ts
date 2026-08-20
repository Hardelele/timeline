import { TIME_UNITS } from '../constants/timeScaleConstants';

// ENUM for time intervals
export const TimeInterval = {
  // Seconds
  ONE_SECOND: 1000,
  TWO_SECONDS: 2000,
  FIVE_SECONDS: 5000,
  TEN_SECONDS: 10000,
  FIFTEEN_SECONDS: 15000,
  TWENTY_SECONDS: 20000,
  THIRTY_SECONDS: 30000,
  ONE_MINUTE: 60000,

  // Minutes
  TWO_MINUTES: 2 * 60000,
  FIVE_MINUTES: 5 * 60000,
  TEN_MINUTES: 10 * 60000,
  FIFTEEN_MINUTES: 15 * 60000,
  TWENTY_MINUTES: 20 * 60000,
  THIRTY_MINUTES: 30 * 60000,
  ONE_HOUR: 60 * 60000,

  // Hours
  TWO_HOURS: 2 * 60 * 60000,
  FOUR_HOURS: 4 * 60 * 60000,
  SIX_HOURS: 6 * 60 * 60000,
  TWELVE_HOURS: 12 * 60 * 60000,
  ONE_DAY: 24 * 60 * 60000,

  // Days
  TWO_DAYS: 2 * 24 * 60 * 60000,
  ONE_WEEK: 7 * 24 * 60 * 60000,
  TWO_WEEKS: 14 * 24 * 60 * 60000,
  ONE_MONTH: 30 * 24 * 60 * 60000,
  TWO_MONTHS: 2 * 30 * 24 * 60 * 60000,
  THREE_MONTHS: 3 * 30 * 24 * 60 * 60000,
  SIX_MONTHS: 6 * 30 * 24 * 60 * 60000,
  ONE_YEAR: 12 * 30 * 24 * 60 * 60000, // 12 months

  // Years
  TWO_YEARS: 2 * 12 * 30 * 24 * 60 * 60000,
  FIVE_YEARS: 5 * 12 * 30 * 24 * 60 * 60000,
  TEN_YEARS: 10 * 12 * 30 * 24 * 60 * 60000,
  TWENTY_FIVE_YEARS: 25 * 12 * 30 * 24 * 60 * 60000,
  FIFTY_YEARS: 50 * 12 * 30 * 24 * 60 * 60000,
  ONE_CENTURY: 100 * 12 * 30 * 24 * 60 * 60000,

  // Centuries
  TWO_CENTURIES: 2 * 100 * 12 * 30 * 24 * 60 * 60000,
  FIVE_CENTURIES: 5 * 100 * 12 * 30 * 24 * 60 * 60000,
  ONE_MILLENNIUM: 10 * 100 * 12 * 30 * 24 * 60 * 60000,

  // Millennia
  TWO_MILLENNIA: 2 * 1000 * 12 * 30 * 24 * 60 * 60000,
  FIVE_MILLENNIA: 5 * 1000 * 12 * 30 * 24 * 60 * 60000,
  TEN_MILLENNIA: 10 * 1000 * 12 * 30 * 24 * 60 * 60000,
} as const;

export type TimeInterval = typeof TimeInterval[keyof typeof TimeInterval];

/**
 * Ladder of scale steps, ascending. Handed to the store as a parameter rather
 * than reached for directly, so a timeline can eventually be given a different
 * ladder — a fictional calendar, a geological one — without touching the core.
 */
export const DEFAULT_TIME_INTERVALS: readonly number[] = Object.values(TimeInterval);

/** Pixels per division a freshly switched step settles at. */
export const DEFAULT_PIXELS_PER_DIVISION = 40;

/**
 * Picks the scale step to display at the given division density.
 *
 * Steps are not evenly spaced, so the threshold is proportional to the ratio
 * between neighbouring steps: switching down at 40 x (current / next) and up at
 * 40 x (current / previous) keeps the two thresholds apart and stops the scale
 * flickering at the boundary.
 *
 * Returns the index unchanged when no switch is due, or when the ladder ends.
 */
export const resolveScaleIndex = (
  index: number,
  pixelsPerDivision: number,
  intervals: readonly number[]
): number => {
  const current = intervals[index];

  const next = intervals[index + 1];
  if (next !== undefined && pixelsPerDivision <= DEFAULT_PIXELS_PER_DIVISION * (current / next)) {
    return index + 1;
  }

  const previous = intervals[index - 1];
  if (previous !== undefined && pixelsPerDivision >= DEFAULT_PIXELS_PER_DIVISION * (current / previous)) {
    return index - 1;
  }

  return index;
};

/**
 * Formats time in milliseconds into a detailed string.
 *
 * A free function: formatting depends only on its argument, never on which
 * scale step a timeline currently sits at.
 */
export function formatTime(timeMs: number): string {
  const totalSeconds = Math.abs(timeMs) / 1000;
  const isNegative = timeMs < 0;

  // Use existing TimeInterval constants and unit mapping
  const MINUTE_SECONDS = TimeInterval.ONE_MINUTE / 1000;
  const HOUR_SECONDS = TimeInterval.ONE_HOUR / 1000;
  const DAY_SECONDS = TimeInterval.ONE_DAY / 1000;
  const MONTH_SECONDS = TimeInterval.ONE_MONTH / 1000;
  const YEAR_SECONDS = TimeInterval.ONE_YEAR / 1000;
  const CENTURY_SECONDS = TimeInterval.ONE_CENTURY / 1000;
  const MILLENNIUM_SECONDS = TimeInterval.ONE_MILLENNIUM / 1000;

  const parts: string[] = [];
  let remainingSeconds = totalSeconds;

  const take = (unitSeconds: number, unit: string) => {
    if (remainingSeconds < unitSeconds) return;

    parts.push(`${Math.floor(remainingSeconds / unitSeconds)} ${unit}`);
    remainingSeconds = remainingSeconds % unitSeconds;
  };

  take(MILLENNIUM_SECONDS, TIME_UNITS.MILLENNIUM);
  take(CENTURY_SECONDS, TIME_UNITS.CENTURY);
  take(YEAR_SECONDS, TIME_UNITS.YEAR);
  take(MONTH_SECONDS, TIME_UNITS.MONTH);
  take(DAY_SECONDS, TIME_UNITS.DAY);
  take(HOUR_SECONDS, TIME_UNITS.HOUR);
  take(MINUTE_SECONDS, TIME_UNITS.MINUTE);

  // Seconds
  const seconds = Math.floor(remainingSeconds);
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} ${TIME_UNITS.SECOND}`);
  }

  const result = parts.join(' ');
  return isNegative ? `-${result}` : result;
}

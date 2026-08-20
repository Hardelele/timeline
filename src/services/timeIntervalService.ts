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

export class TimeIntervalService {
  // Complete list of time intervals in milliseconds
  private readonly timeIntervals = Object.values(TimeInterval).filter(value => typeof value === 'number') as number[];

  private currentIntervalIndex: number = 0;

  // Get current interval in milliseconds
  public getCurrentIntervalMs(): number {
    return this.timeIntervals[this.currentIntervalIndex];
  }

  // Get current interval in seconds
  public getCurrentIntervalSeconds(): number {
    return this.timeIntervals[this.currentIntervalIndex] / 1000;
  }

  // Get current interval as ENUM
  public getCurrentInterval(): TimeInterval {
    return this.timeIntervals[this.currentIntervalIndex] as TimeInterval;
  }

  // Get current interval name
  public getCurrentIntervalName(): string {
    const currentMs = this.getCurrentIntervalMs();
    const intervalName = Object.keys(TimeInterval).find(key => 
      TimeInterval[key as keyof typeof TimeInterval] === currentMs
    );
    return intervalName || 'UNKNOWN';
  }

  // Zoom in (decrease interval)
  public zoomIn(): void {
    if (this.currentIntervalIndex > 0) {
      this.currentIntervalIndex--;
    }
  }

  // Zoom out (increase interval)
  public zoomOut(): void {
    if (this.currentIntervalIndex < this.timeIntervals.length - 1) {
      this.currentIntervalIndex++;
    }
  }

  // Set specific interval
  public setInterval(intervalMs: number): void {
    const index = this.timeIntervals.findIndex(interval => interval === intervalMs);
    if (index !== -1) {
      this.currentIntervalIndex = index;
    }
  }

  // Get next interval
  public getNextInterval(): TimeInterval | null {
    if (this.currentIntervalIndex < this.timeIntervals.length - 1) {
      return this.timeIntervals[this.currentIntervalIndex + 1] as TimeInterval;
    }
    return null;
  }

  // Get previous interval
  public getPreviousInterval(): TimeInterval | null {
    if (this.currentIntervalIndex > 0) {
      return this.timeIntervals[this.currentIntervalIndex - 1] as TimeInterval;
    }
    return null;
  }

  // Check if should switch to next interval
  public shouldSwitchToNextInterval(currentPixelsPerDivision: number): boolean {
    const nextInterval = this.getNextInterval();
    if (!nextInterval) return false;

    const currentIntervalMs = this.getCurrentIntervalMs();
    const nextIntervalMs = nextInterval;
    
    // Ratio: currentInterval / nextInterval
    const ratio = currentIntervalMs / nextIntervalMs;
    const thresholdPixels = 40 * ratio; // 40px * ratio (new default value)
    
    return currentPixelsPerDivision <= thresholdPixels;
  }

  // Check if should switch to previous interval
  public shouldSwitchToPreviousInterval(currentPixelsPerDivision: number): boolean {
    const previousInterval = this.getPreviousInterval();
    if (!previousInterval) return false;

    const currentIntervalMs = this.getCurrentIntervalMs();
    const previousIntervalMs = previousInterval;
    
    // Ratio: currentInterval / previousInterval
    const ratio = currentIntervalMs / previousIntervalMs;
    const thresholdPixels = 40 * ratio; // 40px * ratio (new default value)
    
    return currentPixelsPerDivision >= thresholdPixels;
  }

  // Switch to next interval
  public switchToNextInterval(): boolean {
    if (this.currentIntervalIndex < this.timeIntervals.length - 1) {
      this.currentIntervalIndex++;
      return true;
    }
    return false;
  }

  // Switch to previous interval
  public switchToPreviousInterval(): boolean {
    if (this.currentIntervalIndex > 0) {
      this.currentIntervalIndex--;
      return true;
    }
    return false;
  }

  // Get all available intervals
  public getAllIntervals(): number[] {
    return [...this.timeIntervals];
  }

  // Get current index
  public getCurrentIndex(): number {
    return this.currentIntervalIndex;
  }

  // Format interval for display
  public formatInterval(intervalMs: number): string {
    const seconds = intervalMs / 1000;
    
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      return `${seconds / 60} min`;
    } else if (seconds < 86400) {
      return `${seconds / 3600} h`;
    } else if (seconds < 2592000) {
      return `${seconds / 86400} d`;
    } else if (seconds < 31536000) {
      return `${seconds / 2592000} mo`;
    } else if (seconds < 3153600000) {
      return `${seconds / 31536000} y`;
    } else if (seconds < 31536000000) {
      return `${seconds / 3153600000} c`;
    } else {
      return `${seconds / 31536000000} k`;
    }
  }

}

/**
 * Creates a scale tracker owned by a single timeline instance.
 *
 * Deliberately not a singleton: two timelines on one page must be able to sit
 * at different zoom levels, and tests must not inherit each other's state.
 */
export const createTimeIntervalService = (): TimeIntervalService => new TimeIntervalService();

/**
 * Formats time in milliseconds into a detailed string.
 *
 * A free function rather than a method: formatting depends only on its
 * argument, never on which scale step a timeline currently sits at.
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
    
    // Millennia
    if (remainingSeconds >= MILLENNIUM_SECONDS) {
      const millennia = Math.floor(remainingSeconds / MILLENNIUM_SECONDS);
      parts.push(`${millennia} ${TIME_UNITS.MILLENNIUM}`);
      remainingSeconds = remainingSeconds % MILLENNIUM_SECONDS;
    }
    
    // Centuries
    if (remainingSeconds >= CENTURY_SECONDS) {
      const centuries = Math.floor(remainingSeconds / CENTURY_SECONDS);
      parts.push(`${centuries} ${TIME_UNITS.CENTURY}`);
      remainingSeconds = remainingSeconds % CENTURY_SECONDS;
    }
    
    // Years
    if (remainingSeconds >= YEAR_SECONDS) {
      const years = Math.floor(remainingSeconds / YEAR_SECONDS);
      parts.push(`${years} ${TIME_UNITS.YEAR}`);
      remainingSeconds = remainingSeconds % YEAR_SECONDS;
    }
    
    // Месяцы
    if (remainingSeconds >= MONTH_SECONDS) {
      const months = Math.floor(remainingSeconds / MONTH_SECONDS);
      parts.push(`${months} ${TIME_UNITS.MONTH}`);
      remainingSeconds = remainingSeconds % MONTH_SECONDS;
    }
    
    // Days
    if (remainingSeconds >= DAY_SECONDS) {
      const days = Math.floor(remainingSeconds / DAY_SECONDS);
      parts.push(`${days} ${TIME_UNITS.DAY}`);
      remainingSeconds = remainingSeconds % DAY_SECONDS;
    }
    
    // Hours
    if (remainingSeconds >= HOUR_SECONDS) {
      const hours = Math.floor(remainingSeconds / HOUR_SECONDS);
      parts.push(`${hours} ${TIME_UNITS.HOUR}`);
      remainingSeconds = remainingSeconds % HOUR_SECONDS;
    }
    
    // Minutes
    if (remainingSeconds >= MINUTE_SECONDS) {
      const minutes = Math.floor(remainingSeconds / MINUTE_SECONDS);
      parts.push(`${minutes} ${TIME_UNITS.MINUTE}`);
      remainingSeconds = remainingSeconds % MINUTE_SECONDS;
    }
    
    // Seconds
    const seconds = Math.floor(remainingSeconds);
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} ${TIME_UNITS.SECOND}`);
    }
    
    const result = parts.join(' ');
    return isNegative ? `-${result}` : result;
}

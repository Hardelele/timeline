import { TIME_UNITS } from '../constants/timeScaleConstants';

// ENUM для временных интервалов
export const TimeInterval = {
  // Секунды
  ONE_SECOND: 1000,
  TWO_SECONDS: 2000,
  FIVE_SECONDS: 5000,
  TEN_SECONDS: 10000,
  FIFTEEN_SECONDS: 15000,
  TWENTY_SECONDS: 20000,
  THIRTY_SECONDS: 30000,
  ONE_MINUTE: 60000,

  // Минуты
  TWO_MINUTES: 2 * 60000,
  FIVE_MINUTES: 5 * 60000,
  TEN_MINUTES: 10 * 60000,
  FIFTEEN_MINUTES: 15 * 60000,
  TWENTY_MINUTES: 20 * 60000,
  THIRTY_MINUTES: 30 * 60000,
  ONE_HOUR: 60 * 60000,

  // Часы
  TWO_HOURS: 2 * 60 * 60000,
  FOUR_HOURS: 4 * 60 * 60000,
  SIX_HOURS: 6 * 60 * 60000,
  TWELVE_HOURS: 12 * 60 * 60000,
  ONE_DAY: 24 * 60 * 60000,

  // Дни
  TWO_DAYS: 2 * 24 * 60 * 60000,
  ONE_WEEK: 7 * 24 * 60 * 60000,
  TWO_WEEKS: 14 * 24 * 60 * 60000,
  ONE_MONTH: 30 * 24 * 60 * 60000,
  TWO_MONTHS: 2 * 30 * 24 * 60 * 60000,
  THREE_MONTHS: 3 * 30 * 24 * 60 * 60000,
  SIX_MONTHS: 6 * 30 * 24 * 60 * 60000,
  ONE_YEAR: 12 * 30 * 24 * 60 * 60000, // 12 месяцев

  // Годы
  TWO_YEARS: 2 * 12 * 30 * 24 * 60 * 60000,
  FIVE_YEARS: 5 * 12 * 30 * 24 * 60 * 60000,
  TEN_YEARS: 10 * 12 * 30 * 24 * 60 * 60000,
  TWENTY_FIVE_YEARS: 25 * 12 * 30 * 24 * 60 * 60000,
  FIFTY_YEARS: 50 * 12 * 30 * 24 * 60 * 60000,
  ONE_CENTURY: 100 * 12 * 30 * 24 * 60 * 60000,

  // Века
  TWO_CENTURIES: 2 * 100 * 12 * 30 * 24 * 60 * 60000,
  FIVE_CENTURIES: 5 * 100 * 12 * 30 * 24 * 60 * 60000,
  ONE_MILLENNIUM: 10 * 100 * 12 * 30 * 24 * 60 * 60000,
  
  // Тысячелетия
  TWO_MILLENNIA: 2 * 1000 * 12 * 30 * 24 * 60 * 60000,
  FIVE_MILLENNIA: 5 * 1000 * 12 * 30 * 24 * 60 * 60000,
  TEN_MILLENNIA: 10 * 1000 * 12 * 30 * 24 * 60 * 60000,
} as const;

export type TimeInterval = typeof TimeInterval[keyof typeof TimeInterval];

export class TimeIntervalService {
  private static instance: TimeIntervalService;

  // Полный список временных интервалов в миллисекундах
  private readonly timeIntervals = Object.values(TimeInterval).filter(value => typeof value === 'number') as number[];

  private currentIntervalIndex: number = 0;

  private constructor() {}

  public static getInstance(): TimeIntervalService {
    if (!TimeIntervalService.instance) {
      TimeIntervalService.instance = new TimeIntervalService();
    }
    return TimeIntervalService.instance;
  }

  // Получить текущий интервал в миллисекундах
  public getCurrentIntervalMs(): number {
    return this.timeIntervals[this.currentIntervalIndex];
  }

  // Получить текущий интервал в секундах
  public getCurrentIntervalSeconds(): number {
    return this.timeIntervals[this.currentIntervalIndex] / 1000;
  }

  // Получить текущий интервал как ENUM
  public getCurrentInterval(): TimeInterval {
    return this.timeIntervals[this.currentIntervalIndex] as TimeInterval;
  }

  // Получить название текущего интервала
  public getCurrentIntervalName(): string {
    const currentMs = this.getCurrentIntervalMs();
    const intervalName = Object.keys(TimeInterval).find(key => 
      TimeInterval[key as keyof typeof TimeInterval] === currentMs
    );
    return intervalName || 'UNKNOWN';
  }

  // Увеличить масштаб (уменьшить интервал)
  public zoomIn(): void {
    if (this.currentIntervalIndex > 0) {
      this.currentIntervalIndex--;
    }
  }

  // Уменьшить масштаб (увеличить интервал)
  public zoomOut(): void {
    if (this.currentIntervalIndex < this.timeIntervals.length - 1) {
      this.currentIntervalIndex++;
    }
  }

  // Установить конкретный интервал
  public setInterval(intervalMs: number): void {
    const index = this.timeIntervals.findIndex(interval => interval === intervalMs);
    if (index !== -1) {
      this.currentIntervalIndex = index;
    }
  }

  // Получить следующий интервал
  public getNextInterval(): TimeInterval | null {
    if (this.currentIntervalIndex < this.timeIntervals.length - 1) {
      return this.timeIntervals[this.currentIntervalIndex + 1] as TimeInterval;
    }
    return null;
  }

  // Получить предыдущий интервал
  public getPreviousInterval(): TimeInterval | null {
    if (this.currentIntervalIndex > 0) {
      return this.timeIntervals[this.currentIntervalIndex - 1] as TimeInterval;
    }
    return null;
  }

  // Проверить, нужно ли переключиться на следующий интервал
  public shouldSwitchToNextInterval(currentPixelsPerDivision: number): boolean {
    const nextInterval = this.getNextInterval();
    if (!nextInterval) return false;

    const currentIntervalMs = this.getCurrentIntervalMs();
    const nextIntervalMs = nextInterval;
    
    // Отношение: currentInterval / nextInterval
    const ratio = currentIntervalMs / nextIntervalMs;
    const thresholdPixels = 40 * ratio; // 40px * отношение (новое значение по умолчанию)
    
    return currentPixelsPerDivision <= thresholdPixels;
  }

  // Проверить, нужно ли переключиться на предыдущий интервал
  public shouldSwitchToPreviousInterval(currentPixelsPerDivision: number): boolean {
    const previousInterval = this.getPreviousInterval();
    if (!previousInterval) return false;

    const currentIntervalMs = this.getCurrentIntervalMs();
    const previousIntervalMs = previousInterval;
    
    // Отношение: currentInterval / previousInterval
    const ratio = currentIntervalMs / previousIntervalMs;
    const thresholdPixels = 40 * ratio; // 40px * отношение (новое значение по умолчанию)
    
    return currentPixelsPerDivision >= thresholdPixels;
  }

  // Переключиться на следующий интервал
  public switchToNextInterval(): boolean {
    if (this.currentIntervalIndex < this.timeIntervals.length - 1) {
      this.currentIntervalIndex++;
      return true;
    }
    return false;
  }

  // Переключиться на предыдущий интервал
  public switchToPreviousInterval(): boolean {
    if (this.currentIntervalIndex > 0) {
      this.currentIntervalIndex--;
      return true;
    }
    return false;
  }

  // Получить все доступные интервалы
  public getAllIntervals(): number[] {
    return [...this.timeIntervals];
  }

  // Получить текущий индекс
  public getCurrentIndex(): number {
    return this.currentIntervalIndex;
  }

  // Форматировать интервал для отображения
  public formatInterval(intervalMs: number): string {
    const seconds = intervalMs / 1000;
    
    if (seconds < 60) {
      return `${seconds} сек`;
    } else if (seconds < 3600) {
      return `${seconds / 60} мин`;
    } else if (seconds < 86400) {
      return `${seconds / 3600} ч`;
    } else if (seconds < 2592000) {
      return `${seconds / 86400} дн`;
    } else if (seconds < 31536000) {
      return `${seconds / 2592000} мес`;
    } else if (seconds < 3153600000) {
      return `${seconds / 31536000} год`;
    } else if (seconds < 31536000000) {
      return `${seconds / 3153600000} век`;
    } else {
      return `${seconds / 31536000000} тыс`;
    }
  }

  /**
   * Форматирует время в миллисекундах в детализированную строку
   * @param timeMs - время в миллисекундах
   * @returns отформатированная строка времени
   */
  public formatTime(timeMs: number): string {
    const totalSeconds = Math.abs(timeMs) / 1000;
    const isNegative = timeMs < 0;
    
    // Используем существующие TimeInterval константы и маппинг единиц
    const MINUTE_SECONDS = TimeInterval.ONE_MINUTE / 1000;
    const HOUR_SECONDS = TimeInterval.ONE_HOUR / 1000;
    const DAY_SECONDS = TimeInterval.ONE_DAY / 1000;
    const MONTH_SECONDS = TimeInterval.ONE_MONTH / 1000;
    const YEAR_SECONDS = TimeInterval.ONE_YEAR / 1000;
    const CENTURY_SECONDS = TimeInterval.ONE_CENTURY / 1000;
    const MILLENNIUM_SECONDS = TimeInterval.ONE_MILLENNIUM / 1000;
    
    const parts: string[] = [];
    let remainingSeconds = totalSeconds;
    
    // Тысячелетия
    if (remainingSeconds >= MILLENNIUM_SECONDS) {
      const millennia = Math.floor(remainingSeconds / MILLENNIUM_SECONDS);
      parts.push(`${millennia} ${TIME_UNITS.MILLENNIUM}`);
      remainingSeconds = remainingSeconds % MILLENNIUM_SECONDS;
    }
    
    // Века
    if (remainingSeconds >= CENTURY_SECONDS) {
      const centuries = Math.floor(remainingSeconds / CENTURY_SECONDS);
      parts.push(`${centuries} ${TIME_UNITS.CENTURY}`);
      remainingSeconds = remainingSeconds % CENTURY_SECONDS;
    }
    
    // Годы
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
    
    // Дни
    if (remainingSeconds >= DAY_SECONDS) {
      const days = Math.floor(remainingSeconds / DAY_SECONDS);
      parts.push(`${days} ${TIME_UNITS.DAY}`);
      remainingSeconds = remainingSeconds % DAY_SECONDS;
    }
    
    // Часы
    if (remainingSeconds >= HOUR_SECONDS) {
      const hours = Math.floor(remainingSeconds / HOUR_SECONDS);
      parts.push(`${hours} ${TIME_UNITS.HOUR}`);
      remainingSeconds = remainingSeconds % HOUR_SECONDS;
    }
    
    // Минуты
    if (remainingSeconds >= MINUTE_SECONDS) {
      const minutes = Math.floor(remainingSeconds / MINUTE_SECONDS);
      parts.push(`${minutes} ${TIME_UNITS.MINUTE}`);
      remainingSeconds = remainingSeconds % MINUTE_SECONDS;
    }
    
    // Секунды
    const seconds = Math.floor(remainingSeconds);
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} ${TIME_UNITS.SECOND}`);
    }
    
    const result = parts.join(' ');
    return isNegative ? `-${result}` : result;
  }
}

// Экспортируем singleton instance
export const timeIntervalService = TimeIntervalService.getInstance();

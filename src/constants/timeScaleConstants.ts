/**
 * Константы для временной шкалы
 */

// Константы для вычисления делений
export const TIME_SCALE_CONSTANTS = {
  // Количество делений по умолчанию для отображения
  DEFAULT_DIVISIONS_IN_HALF: 10,
  
  // Минимальное количество делений
  MIN_DIVISIONS_IN_HALF: 5,
  
  // Максимальное количество делений
  MAX_DIVISIONS_IN_HALF: 50,
  
  // Коэффициент для вычисления количества делений на основе высоты экрана
  DIVISIONS_CALCULATION_FACTOR: 2,
} as const;

// Сокращения для единиц времени (используется с TimeInterval константами)
export const TIME_UNITS = {
  SECOND: 'сек',
  MINUTE: 'мин',
  HOUR: 'ч',
  DAY: 'дн',
  MONTH: 'мес',
  YEAR: 'год',
  CENTURY: 'век',
  MILLENNIUM: 'тыс',
} as const;

// Константы для позиционирования элементов
export const POSITIONING_CONSTANTS = {
  // Смещение текста относительно засечки
  TEXT_OFFSET_X: 10,
  TEXT_OFFSET_Y: -8,
  
  // Размеры засечки
  TICK_LENGTH: 10, // общая длина засечки
  TICK_HALF_LENGTH: 5, // половина длины засечки
  
  // Размеры по умолчанию
  DEFAULT_FONT_SIZE: 12,
  DEFAULT_STROKE_WIDTH: 1,
} as const;

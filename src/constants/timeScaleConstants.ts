/**
 * Constants for time scale
 */

// Constants for calculating divisions
export const TIME_SCALE_CONSTANTS = {
  // Minimum number of divisions
  MIN_DIVISIONS_IN_HALF: 5,

  // Maximum number of divisions
  MAX_DIVISIONS_IN_HALF: 50,

  // Factor for calculating number of divisions based on screen height
  DIVISIONS_CALCULATION_FACTOR: 2,
} as const;

// Abbreviations for time units, used when formatting a duration
export const TIME_UNITS = {
  SECOND: 'sec',
  MINUTE: 'min',
  HOUR: 'h',
  DAY: 'd',
  MONTH: 'mo',
  YEAR: 'y',
  CENTURY: 'c',
  MILLENNIUM: 'k',
} as const;

// Constants for element positioning
export const POSITIONING_CONSTANTS = {
  // Text offset relative to tick mark
  TEXT_OFFSET_X: 10,
  TEXT_OFFSET_Y: -8,

  // Half of a tick's length, measured either side of the axis
  TICK_HALF_LENGTH: 5,

  // Default sizes
  DEFAULT_FONT_SIZE: 12,
  DEFAULT_STROKE_WIDTH: 1,
} as const;

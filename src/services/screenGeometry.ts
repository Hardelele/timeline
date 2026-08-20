/**
 * Pure geometry helpers for placing time on the canvas.
 *
 * These used to live on a mutable ScreenService singleton that also held the
 * canvas size. The size now lives in the timeline store, so nothing here needs
 * state: every function takes what it needs and returns a number.
 */

/** Center point of a canvas of the given size. */
export const getCenter = (width: number, height: number): { x: number; y: number } => ({
  x: width / 2,
  y: height / 2,
});

/** Y-coordinate of the zero point of the time axis. */
export const getZeroTimeY = (centerY: number, offsetPixels: number): number =>
  centerY + offsetPixels;

/** Y-coordinate of a division, counted from the zero point. */
export const getTimeDivisionY = (
  zeroTimeY: number,
  divisionIndex: number,
  pixelsPerDivision: number
): number => zeroTimeY - divisionIndex * pixelsPerDivision;

/** Milliseconds covered by a single pixel at the current scale. */
export const getTimePerPixel = (intervalMs: number, pixelsPerDivision: number): number =>
  intervalMs / pixelsPerDivision;

/**
 * Pure geometry: turning a moment in time into a Y-coordinate.
 *
 * These used to be methods on a mutable ScreenService singleton that also held
 * the canvas size. The size now lives in the timeline store, so nothing here
 * needs state — which is what makes this file the natural place to unit-test
 * the arithmetic without rendering anything.
 */

export interface TimeProjection {
  /** Milliseconds represented by the whole current division. */
  intervalMs: number;
  /** Height of one division, in pixels. */
  pixelsPerDivision: number;
  /** How far the timeline is scrolled, in milliseconds. */
  offsetMs: number;
  /** Canvas height, in pixels. */
  canvasHeight: number;
}

/** Milliseconds covered by a single pixel at the current scale. */
export const getTimePerPixel = (intervalMs: number, pixelsPerDivision: number): number =>
  intervalMs / pixelsPerDivision;

/** Y-coordinate of a moment in time on a canvas of the given projection. */
export const timeToY = (timeMs: number, projection: TimeProjection): number => {
  const { intervalMs, pixelsPerDivision, offsetMs, canvasHeight } = projection;

  const offsetPixels = offsetMs / getTimePerPixel(intervalMs, pixelsPerDivision);
  const zeroTimeY = canvasHeight / 2 + offsetPixels;

  return zeroTimeY - (timeMs / intervalMs) * pixelsPerDivision;
};

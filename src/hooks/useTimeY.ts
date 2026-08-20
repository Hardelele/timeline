import { useCallback } from 'react';
import { useTimelineStore } from '../stores/timelineStoreContext';
import { getCenter, getTimeDivisionY, getTimePerPixel, getZeroTimeY } from '../services/screenGeometry';

/**
 * Hook for calculating Y-coordinate of any time on timeline
 * @returns Function that takes timeMs and returns Y-coordinate
 */
export const useTimeY = () => {
  const pixelsPerDivision = useTimelineStore((s) => s.pixelsPerDivision);
  const intervalMs = useTimelineStore((s) => s.currentInterval);
  const offsetMs = useTimelineStore((s) => s.offsetMs);
  const canvasHeight = useTimelineStore((s) => s.canvasHeight);

  return useCallback((timeMs: number): number => {
    // Calculate positioning parameters
    const { y: centerY } = getCenter(0, canvasHeight);
    const timePerPixel = getTimePerPixel(intervalMs, pixelsPerDivision);
    const offsetPixels = offsetMs / timePerPixel;
    const zeroTimeY = getZeroTimeY(centerY, offsetPixels);

    // Calculate Y-coordinate for time
    const divisionIndex = timeMs / intervalMs;
    return getTimeDivisionY(zeroTimeY, divisionIndex, pixelsPerDivision);
  }, [pixelsPerDivision, intervalMs, offsetMs, canvasHeight]);
};

import { useCallback } from 'react';
import { useTimelineStore } from '../stores/timelineStoreContext';
import { currentIntervalMs } from '../stores/createTimelineStore';
import { timeToY } from '../services/screenGeometry';

/**
 * Hook for calculating Y-coordinate of any time on timeline
 *
 * A thin wrapper: the arithmetic itself is `timeToY` in screenGeometry, so it
 * can be tested without rendering.
 *
 * @returns Function that takes timeMs and returns Y-coordinate
 */
export const useTimeY = () => {
  const pixelsPerDivision = useTimelineStore((s) => s.pixelsPerDivision);
  const intervalMs = useTimelineStore(currentIntervalMs);
  const offsetMs = useTimelineStore((s) => s.offsetMs);
  const canvasHeight = useTimelineStore((s) => s.canvasHeight);

  return useCallback(
    (timeMs: number): number =>
      timeToY(timeMs, { intervalMs, pixelsPerDivision, offsetMs, canvasHeight }),
    [intervalMs, pixelsPerDivision, offsetMs, canvasHeight]
  );
};

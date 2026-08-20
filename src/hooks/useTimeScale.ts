import { useCallback, useMemo } from 'react';
import { useTimelineStore } from '../stores/timelineStoreContext';
import { currentIntervalMs } from '../stores/createTimelineStore';
import { formatTime } from '../services/timeScale';
import { useTimeY } from './useTimeY';
import { TIME_SCALE_CONSTANTS } from '../constants/timeScaleConstants';

/**
 * Hook for working with time scale
 * Encapsulates logic for finding nearest divisions and their rendering
 */
export const useTimeScale = () => {
  const offsetMs = useTimelineStore((s) => s.offsetMs);
  const pixelsPerDivision = useTimelineStore((s) => s.pixelsPerDivision);
  const intervalMs = useTimelineStore(currentIntervalMs);
  const canvasWidth = useTimelineStore((s) => s.canvasWidth);
  const canvasHeight = useTimelineStore((s) => s.canvasHeight);

  const centerX = canvasWidth / 2;

  // Hook for calculating time Y-coordinate
  const getTimeY = useTimeY();

  /**
   * Finds nearest tick mark to offsetMs
   */
  const findNearestDivision = useCallback(
    () => Math.round(offsetMs / intervalMs) * intervalMs,
    [offsetMs, intervalMs]
  );

  /**
   * Calculates number of divisions to display
   */
  const getDivisionsCount = useCallback(() => {
    const divisionsInHalf = Math.floor(canvasHeight / TIME_SCALE_CONSTANTS.DIVISIONS_CALCULATION_FACTOR / pixelsPerDivision);

    // Limit number of divisions for performance
    return Math.max(
      TIME_SCALE_CONSTANTS.MIN_DIVISIONS_IN_HALF,
      Math.min(divisionsInHalf, TIME_SCALE_CONSTANTS.MAX_DIVISIONS_IN_HALF)
    );
  }, [pixelsPerDivision, canvasHeight]);

  /**
   * Generates array of divisions for rendering
   */
  const generateDivisions = useMemo(() => {
    const nearestDivisionMs = findNearestDivision();
    const divisionsInHalf = getDivisionsCount();

    const divisions = [];

    // Generate divisions from -divisionsInHalf to +divisionsInHalf from nearest
    for (let i = -divisionsInHalf; i <= divisionsInHalf; i++) {
      const divisionMs = nearestDivisionMs + i * intervalMs;

      divisions.push({
        key: `nearest-${i}`,
        x: centerX,
        y: getTimeY(divisionMs),
        text: formatTime(divisionMs),
        timeMs: divisionMs
      });
    }

    return divisions;
  }, [findNearestDivision, intervalMs, getDivisionsCount, getTimeY, centerX]);

  return { divisions: generateDivisions };
};

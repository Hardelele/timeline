import { useCallback } from 'react';
import { useTimelineStore } from '../stores/timelineStore';
import { screenService } from '../services/screenService';

/**
 * Hook for calculating Y-coordinate of any time on timeline
 * @returns Function that takes timeMs and returns Y-coordinate
 */
export const useTimeY = () => {
  const { 
    pixelsPerDivision, 
    getCurrentIntervalMs, 
    offsetMs, 
    getTimePerPixel 
  } = useTimelineStore();
  
  const { y: centerY } = screenService.getCenter();

  return useCallback((timeMs: number): number => {
    // Calculate positioning parameters
    const intervalMs = getCurrentIntervalMs();
    const timePerPixel = getTimePerPixel();
    const offsetPixels = offsetMs / timePerPixel;
    const zeroTimeY = screenService.getZeroTimeY(centerY, offsetPixels);
    
    // Calculate Y-coordinate for time
    const divisionIndex = timeMs / intervalMs;
    return screenService.getTimeDivisionY(zeroTimeY, divisionIndex, pixelsPerDivision);
  }, [pixelsPerDivision, offsetMs, getCurrentIntervalMs, getTimePerPixel, centerY]);
};

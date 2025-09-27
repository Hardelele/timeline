import { useCallback, useMemo } from 'react';
import { useTimelineStore } from '../stores/timelineStore';
import { screenService } from '../services/screenService';
import { timeIntervalService } from '../services/timeIntervalService';
import { useTimeY } from './useTimeY';
import { TIME_SCALE_CONSTANTS } from '../constants/timeScaleConstants';

/**
 * Hook for working with time scale
 * Encapsulates logic for finding nearest divisions and their rendering
 */
export const useTimeScale = () => {
  const {
    offsetMs,
    pixelsPerDivision,
    getCurrentIntervalMs
  } = useTimelineStore();

  // Get screen center
  const { x: centerX } = screenService.getCenter();
  
  // Hook for calculating time Y-coordinate
  const getTimeY = useTimeY();

  /**
   * Finds nearest tick mark to offsetMs
   */
  const findNearestDivision = useCallback(() => {
    const intervalMs = getCurrentIntervalMs();
    const nearestDivisionMs = Math.round(offsetMs / intervalMs) * intervalMs;
    return nearestDivisionMs;
  }, [offsetMs, getCurrentIntervalMs]);

  /**
   * Formats time for display
   */
  const formatTime = useCallback((timeMs: number): string => {
    return timeIntervalService.formatTime(timeMs);
  }, []);

  /**
   * Calculates number of divisions to display
   */
  const getDivisionsCount = useCallback(() => {
    const { height } = screenService.getCanvasSize();
    const divisionsInHalf = Math.floor(height / TIME_SCALE_CONSTANTS.DIVISIONS_CALCULATION_FACTOR / pixelsPerDivision);
    
    // Limit number of divisions for performance
    return Math.max(
      TIME_SCALE_CONSTANTS.MIN_DIVISIONS_IN_HALF,
      Math.min(divisionsInHalf, TIME_SCALE_CONSTANTS.MAX_DIVISIONS_IN_HALF)
    );
  }, [pixelsPerDivision]);

  /**
   * Generates array of divisions for rendering
   */
  const generateDivisions = useMemo(() => {
    const nearestDivisionMs = findNearestDivision();
    const intervalMs = getCurrentIntervalMs();
    const divisionsInHalf = getDivisionsCount();
    
    const divisions = [];
    
    // Generate divisions from -divisionsInHalf to +divisionsInHalf from nearest
    for (let i = -divisionsInHalf; i <= divisionsInHalf; i++) {
      const divisionMs = nearestDivisionMs + i * intervalMs;
      const y = getTimeY(divisionMs);
      const timeText = formatTime(divisionMs);
      
      divisions.push({
        key: `nearest-${i}`,
        x: centerX,
        y,
        text: timeText,
        timeMs: divisionMs
      });
    }
    
    return divisions;
  }, [findNearestDivision, getCurrentIntervalMs, getDivisionsCount, getTimeY, formatTime, centerX]);

  return {
    divisions: generateDivisions,
    findNearestDivision,
    formatTime,
    getDivisionsCount
  };
};

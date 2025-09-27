import { useCallback } from 'react';
import { useTimelineStore } from '../stores/timelineStore';
import { screenService } from '../services/screenService';

/**
 * Хук для вычисления Y-координаты любого времени на таймлайне
 * @returns Функция, которая принимает timeMs и возвращает Y-координату
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
    // Вычисляем параметры для позиционирования
    const intervalMs = getCurrentIntervalMs();
    const timePerPixel = getTimePerPixel();
    const offsetPixels = offsetMs / timePerPixel;
    const zeroTimeY = screenService.getZeroTimeY(centerY, offsetPixels);
    
    // Вычисляем Y-координату для времени
    const divisionIndex = timeMs / intervalMs;
    return screenService.getTimeDivisionY(zeroTimeY, divisionIndex, pixelsPerDivision);
  }, [pixelsPerDivision, offsetMs, getCurrentIntervalMs, getTimePerPixel, centerY]);
};

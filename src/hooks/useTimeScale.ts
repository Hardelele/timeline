import { useCallback, useMemo } from 'react';
import { useTimelineStore } from '../stores/timelineStore';
import { screenService } from '../services/screenService';
import { timeIntervalService } from '../services/timeIntervalService';
import { useTimeY } from './useTimeY';
import { TIME_SCALE_CONSTANTS } from '../constants/timeScaleConstants';

/**
 * Хук для работы с временной шкалой
 * Инкапсулирует логику поиска ближайших делений и их рендеринга
 */
export const useTimeScale = () => {
  const {
    offsetMs,
    pixelsPerDivision,
    getCurrentIntervalMs
  } = useTimelineStore();

  // Получаем центр экрана
  const { x: centerX } = screenService.getCenter();
  
  // Хук для вычисления Y-координаты времени
  const getTimeY = useTimeY();

  /**
   * Находит ближайшую засечку к offsetMs
   */
  const findNearestDivision = useCallback(() => {
    const intervalMs = getCurrentIntervalMs();
    const nearestDivisionMs = Math.round(offsetMs / intervalMs) * intervalMs;
    return nearestDivisionMs;
  }, [offsetMs, getCurrentIntervalMs]);

  /**
   * Форматирует время для отображения
   */
  const formatTime = useCallback((timeMs: number): string => {
    return timeIntervalService.formatTime(timeMs);
  }, []);

  /**
   * Вычисляет количество делений для отображения
   */
  const getDivisionsCount = useCallback(() => {
    const { height } = screenService.getCanvasSize();
    const divisionsInHalf = Math.floor(height / TIME_SCALE_CONSTANTS.DIVISIONS_CALCULATION_FACTOR / pixelsPerDivision);
    
    // Ограничиваем количество делений для производительности
    return Math.max(
      TIME_SCALE_CONSTANTS.MIN_DIVISIONS_IN_HALF,
      Math.min(divisionsInHalf, TIME_SCALE_CONSTANTS.MAX_DIVISIONS_IN_HALF)
    );
  }, [pixelsPerDivision]);

  /**
   * Генерирует массив делений для рендеринга
   */
  const generateDivisions = useMemo(() => {
    const nearestDivisionMs = findNearestDivision();
    const intervalMs = getCurrentIntervalMs();
    const divisionsInHalf = getDivisionsCount();
    
    const divisions = [];
    
    // Генерируем деления от -divisionsInHalf до +divisionsInHalf от ближайшей
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

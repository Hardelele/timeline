import { create } from 'zustand';
import { timeIntervalService, TimeInterval } from '../services/timeIntervalService';

// Константы
const DEFAULT_PIXELS_PER_DIVISION = 40; // пикселей на деление по умолчанию

interface TimelineState {
  // Основные параметры таймлайна
  offsetMs: number; // смещение в миллисекундах
  pixelsPerDivision: number; // пикселей на деление (может быть 80, 40, и т.д.)
  currentInterval: TimeInterval; // текущий временной интервал
  
  // Действия для изменения состояния
  setOffsetMs: (offsetMs: number) => void;
  setPixelsPerDivision: (pixelsPerDivision: number) => void;
  setCurrentInterval: (interval: TimeInterval) => void;
  
  // Действия для масштабирования
  zoomIn: () => void;
  zoomOut: () => void;
  smoothZoom: (deltaPixels: number) => void; // плавное масштабирование
  
  // Вычисляемые значения
  getCurrentIntervalMs: () => number;
  getCurrentIntervalSeconds: () => number;
  getCurrentIntervalName: () => string;
  getTimePerPixel: () => number; // миллисекунд на 1 пиксель
  getScaledRadius: () => number;
  getScaledFontSize: () => number;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  // Начальные значения
  offsetMs: 0, // смещение в миллисекундах
  pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION, // пикселей на деление
  currentInterval: TimeInterval.ONE_SECOND, // начинаем с 1 секунды
  
  // Действия
  setOffsetMs: (offsetMs) => set({ offsetMs }),
  setPixelsPerDivision: (pixelsPerDivision) => {
    // Проверяем, нужно ли переключиться на другой интервал
    if (timeIntervalService.shouldSwitchToNextInterval(pixelsPerDivision)) {
      // Переключаемся на следующий интервал и сбрасываем пиксели на дефолтное значение
      if (timeIntervalService.switchToNextInterval()) {
        const newInterval = timeIntervalService.getCurrentInterval();
        set({ 
          pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION,
          currentInterval: newInterval 
        });
        return;
      }
    }
    
    if (timeIntervalService.shouldSwitchToPreviousInterval(pixelsPerDivision)) {
      // Переключаемся на предыдущий интервал и сбрасываем пиксели на дефолтное значение
      if (timeIntervalService.switchToPreviousInterval()) {
        const newInterval = timeIntervalService.getCurrentInterval();
        set({ 
          pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION,
          currentInterval: newInterval 
        });
        return;
      }
    }
    
    // Если переключения не произошло, просто обновляем пиксели
    set({ pixelsPerDivision });
  },
  setCurrentInterval: (interval) => {
    timeIntervalService.setInterval(interval);
    set({ currentInterval: interval });
  },
  
  // Действия для масштабирования
  zoomIn: () => {
    timeIntervalService.zoomIn();
    const newInterval = timeIntervalService.getCurrentInterval();
    const pixelsPerDivision = get().pixelsPerDivision;
    
    // Обновляем текущий интервал в store
    set({ currentInterval: newInterval });
    
    // Если интервал стал меньше, можно увеличить пиксели на деление для лучшей читаемости
    if (newInterval < TimeInterval.ONE_SECOND && pixelsPerDivision > DEFAULT_PIXELS_PER_DIVISION) {
      set({ pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION });
    }
  },
  
  zoomOut: () => {
    timeIntervalService.zoomOut();
    const newInterval = timeIntervalService.getCurrentInterval();
    const pixelsPerDivision = get().pixelsPerDivision;
    
    // Обновляем текущий интервал в store
    set({ currentInterval: newInterval });
    
    // Если интервал стал больше, можно уменьшить пиксели на деление
    if (newInterval > TimeInterval.ONE_MINUTE && pixelsPerDivision < DEFAULT_PIXELS_PER_DIVISION) {
      set({ pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION });
    }
  },

  // Плавное масштабирование (например, колесиком мыши)
  smoothZoom: (deltaPixels) => {
    const { pixelsPerDivision } = get();
    const newPixelsPerDivision = Math.max(10, Math.min(200, pixelsPerDivision + deltaPixels));
    
    // Используем setPixelsPerDivision, который автоматически проверит переключение интервалов
    get().setPixelsPerDivision(newPixelsPerDivision);
  },
  
  // Вычисляемые значения
  getCurrentIntervalMs: () => timeIntervalService.getCurrentIntervalMs(),
  getCurrentIntervalSeconds: () => timeIntervalService.getCurrentIntervalSeconds(),
  getCurrentIntervalName: () => timeIntervalService.getCurrentIntervalName(),
  
  getTimePerPixel: () => {
    const { pixelsPerDivision } = get();
    const intervalMs = timeIntervalService.getCurrentIntervalMs();
    return intervalMs / pixelsPerDivision; // миллисекунд на 1 пиксель
  },
  
  getScaledRadius: () => {
    const timePerPixel = get().getTimePerPixel();
    const baseRadius = 5;
    // Радиус зависит от масштаба времени
    return Math.max(2, baseRadius * (1000 / timePerPixel)); // минимум 2px
  },
  
  getScaledFontSize: () => {
    const timePerPixel = get().getTimePerPixel();
    const baseFontSize = 14;
    // Размер шрифта зависит от масштаба времени
    return Math.max(10, baseFontSize * (1000 / timePerPixel)); // минимум 10px
  },
}));

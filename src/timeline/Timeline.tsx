import React, { useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { CoordinateAxes } from './CoordinateAxes';
import { TimeScale } from './TimeScale';
import { screenService } from '../services/screenService';
import { dragService } from '../services/dragService';
import { useTimelineStore } from '../stores/timelineStore';

export interface TimelineProps {
  /** Ширина компонента в пикселях */
  width?: number;
  /** Высота компонента в пикселях */
  height?: number;
  /** Фон компонента */
  backgroundColor?: string;
  /** Обработчик изменения размера */
  onResize?: (size: { width: number; height: number }) => void;
  /** Обработчик изменения масштаба */
  onZoom?: (zoomDelta: number) => void;
  /** Обработчик изменения смещения */
  onOffsetChange?: (offsetMs: number) => void;
  /** Показывать ли координатные оси */
  showAxes?: boolean;
  /** Показывать ли временную шкалу */
  showTimeScale?: boolean;
  /** Кастомные стили для контейнера */
  containerStyle?: React.CSSProperties;
}

/**
 * Переиспользуемый компонент таймлайна
 * Предоставляет интерактивную временную шкалу с возможностью масштабирования и перетаскивания
 */
export const Timeline: React.FC<TimelineProps> = ({
  width,
  height,
  backgroundColor = '#f5f5f5',
  onResize,
  onZoom,
  onOffsetChange,
  showAxes = true,
  showTimeScale = true,
  containerStyle = {},
}) => {
  const [canvasSize, setCanvasSize] = useState(() => {
    const defaultSize = screenService.getCanvasSize();
    return {
      width: width || defaultSize.width,
      height: height || defaultSize.height,
    };
  });

  const [isDragging, setIsDragging] = useState(false);

  const { smoothZoom, offsetMs } = useTimelineStore();

  // Обновляем размеры canvas при изменении пропсов или размера окна
  useEffect(() => {
    const updateSize = () => {
      const newSize = {
        width: width || window.innerWidth,
        height: height || window.innerHeight,
      };
      
      screenService.updateCanvasSize(newSize.width, newSize.height);
      setCanvasSize(newSize);
      
      // Уведомляем родительский компонент об изменении размера
      onResize?.(newSize);
    };

    updateSize();
    
    // Добавляем слушатель только если размеры не заданы явно
    if (!width || !height) {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [width, height, onResize]);

  // Настраиваем отслеживание состояния перетаскивания
  useEffect(() => {
    dragService.setOnDragStateChange(setIsDragging);
  }, []);

  // Уведомляем родительский компонент об изменении смещения
  useEffect(() => {
    onOffsetChange?.(offsetMs);
  }, [offsetMs, onOffsetChange]);

  // Обработчик колесика мыши для масштабирования
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const deltaY = e.evt.deltaY;
    const zoomDelta = deltaY > 0 ? -5 : 5; // Инвертируем для естественного зума
    
    smoothZoom(zoomDelta);
    
    // Уведомляем родительский компонент о масштабировании
    onZoom?.(zoomDelta);
  };

  // Стили для контейнера
  const containerStyles: React.CSSProperties = {
    width: canvasSize.width,
    height: canvasSize.height,
    backgroundColor,
    cursor: isDragging ? 'grabbing' : 'grab',
    ...containerStyle,
  };

  return (
    <div style={containerStyles}>
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={dragService.handleMouseDown}
        onMouseMove={dragService.handleMouseMove}
        onMouseUp={dragService.handleMouseUp}
        onMouseLeave={dragService.handleMouseLeave}
        onWheel={handleWheel}
      >
        <Layer>
          {showAxes && <CoordinateAxes />}
          {showTimeScale && <TimeScale />}
        </Layer>
      </Stage>
    </div>
  );
};

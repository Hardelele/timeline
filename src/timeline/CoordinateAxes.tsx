import React from 'react';
import { Line } from 'react-konva';
import { screenService } from '../services/screenService';
import { TimeScale } from './TimeScale';
import { useTimeY } from '../hooks/useTimeY';

export const CoordinateAxes: React.FC = () => {
  // Получаем размеры и центр из сервиса
  const { width: canvasWidth, height: canvasHeight } = screenService.getCanvasSize();
  const { x: centerX } = screenService.getCenter();
  
  // Хук для вычисления Y-координаты времени
  const getTimeY = useTimeY();
  
  // Y-координата нулевой точки времени
  const zeroTimeY = getTimeY(0);

  return (
    <>
      {/* Ось X - горизонтальная линия */}
      <Line
        points={[0, zeroTimeY, canvasWidth, zeroTimeY]}
        stroke="#999"
        strokeWidth={0.5}
      />
      
      {/* Ось Y - вертикальная линия */}
      <Line
        points={[centerX, 0, centerX, canvasHeight]}
        stroke="#999"
        strokeWidth={0.5}
      />
      
      {/* Временная шкала с засечками */}
      <TimeScale />
    </>
  );
};

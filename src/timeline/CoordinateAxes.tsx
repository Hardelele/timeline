import React from 'react';
import { Line } from 'react-konva';
import { screenService } from '../services/screenService';
import { TimeScale } from './TimeScale';
import { useTimeY } from '../hooks/useTimeY';

export const CoordinateAxes: React.FC = () => {
  // Get dimensions and center from service
  const { width: canvasWidth, height: canvasHeight } = screenService.getCanvasSize();
  const { x: centerX } = screenService.getCenter();
  
  // Hook for calculating time Y-coordinate
  const getTimeY = useTimeY();
  
  // Y-coordinate of zero time point
  const zeroTimeY = getTimeY(0);

  return (
    <>
      {/* X-axis - horizontal line */}
      <Line
        points={[0, zeroTimeY, canvasWidth, zeroTimeY]}
        stroke="#999"
        strokeWidth={0.5}
      />
      
      {/* Y-axis - vertical line */}
      <Line
        points={[centerX, 0, centerX, canvasHeight]}
        stroke="#999"
        strokeWidth={0.5}
      />
      
      {/* Time scale with tick marks */}
      <TimeScale />
    </>
  );
};

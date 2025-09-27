import React, { useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { CoordinateAxes } from './CoordinateAxes';
import { TimeScale } from './TimeScale';
import { screenService } from '../services/screenService';
import { dragService } from '../services/dragService';
import { useTimelineStore } from '../stores/timelineStore';

export interface TimelineProps {
  /** Component width in pixels */
  width?: number;
  /** Component height in pixels */
  height?: number;
  /** Component background color */
  backgroundColor?: string;
  /** Resize handler */
  onResize?: (size: { width: number; height: number }) => void;
  /** Zoom change handler */
  onZoom?: (zoomDelta: number) => void;
  /** Offset change handler */
  onOffsetChange?: (offsetMs: number) => void;
  /** Whether to show coordinate axes */
  showAxes?: boolean;
  /** Whether to show time scale */
  showTimeScale?: boolean;
  /** Custom styles for container */
  containerStyle?: React.CSSProperties;
}

/**
 * Reusable timeline component
 * Provides interactive timeline with zoom and drag capabilities
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

  // Update canvas dimensions when props or window size changes
  useEffect(() => {
    const updateSize = () => {
      const newSize = {
        width: width || window.innerWidth,
        height: height || window.innerHeight,
      };
      
      screenService.updateCanvasSize(newSize.width, newSize.height);
      setCanvasSize(newSize);
      
      // Notify parent component about size change
      onResize?.(newSize);
    };

    updateSize();
    
    // Add listener only if dimensions are not explicitly set
    if (!width || !height) {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [width, height, onResize]);

  // Setup drag state tracking
  useEffect(() => {
    dragService.setOnDragStateChange(setIsDragging);
  }, []);

  // Notify parent component about offset change
  useEffect(() => {
    onOffsetChange?.(offsetMs);
  }, [offsetMs, onOffsetChange]);

  // Mouse wheel handler for zooming
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const deltaY = e.evt.deltaY;
    const zoomDelta = deltaY > 0 ? -5 : 5; // Invert for natural zoom
    
    smoothZoom(zoomDelta);
    
    // Notify parent component about zoom
    onZoom?.(zoomDelta);
  };

  // Container styles
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

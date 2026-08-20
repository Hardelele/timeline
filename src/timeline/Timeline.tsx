import React, { useEffect, useMemo, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { CoordinateAxes } from './CoordinateAxes';
import { TimeScale } from './TimeScale';
import { createDragController } from '../services/dragController';
import { createTimelineStore } from '../stores/createTimelineStore';
import { TimelineStoreProvider } from '../stores/TimelineStoreProvider';
import { useStore } from 'zustand';

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
 *
 * Every instance owns its state: the store, the scale tracker and the drag
 * controller are created here rather than imported as singletons, so several
 * timelines can live on one page without sharing zoom, size or drag state.
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
  const [store] = useState(() =>
    createTimelineStore({
      canvasWidth: width ?? window.innerWidth,
      canvasHeight: height ?? window.innerHeight,
    })
  );

  const dragController = useMemo(() => createDragController(store), [store]);

  const canvasWidth = useStore(store, (s) => s.canvasWidth);
  const canvasHeight = useStore(store, (s) => s.canvasHeight);
  const isDragging = useStore(store, (s) => s.isDragging);
  const offsetMs = useStore(store, (s) => s.offsetMs);

  // Update canvas dimensions when props or window size changes
  useEffect(() => {
    const updateSize = () => {
      const newSize = {
        width: width ?? window.innerWidth,
        height: height ?? window.innerHeight,
      };

      store.getState().setCanvasSize(newSize.width, newSize.height);

      // Notify parent component about size change
      onResize?.(newSize);
    };

    updateSize();

    // Add listener only if dimensions are not explicitly set
    if (!width || !height) {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [width, height, onResize, store]);

  // Notify parent component about offset change
  useEffect(() => {
    onOffsetChange?.(offsetMs);
  }, [offsetMs, onOffsetChange]);

  // Mouse wheel handler for zooming
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const zoomDelta = e.evt.deltaY > 0 ? -5 : 5; // Invert for natural zoom

    store.getState().smoothZoom(zoomDelta);

    // Notify parent component about zoom
    onZoom?.(zoomDelta);
  };

  // Container styles
  const containerStyles: React.CSSProperties = {
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor,
    cursor: isDragging ? 'grabbing' : 'grab',
    ...containerStyle,
  };

  return (
    <div style={containerStyles}>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={dragController.handleMouseDown}
        onMouseMove={dragController.handleMouseMove}
        onMouseUp={dragController.handleMouseUp}
        onMouseLeave={dragController.handleMouseLeave}
        onWheel={handleWheel}
      >
        <TimelineStoreProvider store={store}>
          <Layer>
            {showAxes && <CoordinateAxes />}
            {showTimeScale && <TimeScale />}
          </Layer>
        </TimelineStoreProvider>
      </Stage>
    </div>
  );
};

import React from 'react';
import { Line } from 'react-konva';
import { useTimelineStore } from '../stores/timelineStoreContext';
import { useTimeY } from '../hooks/useTimeY';

/**
 * Coordinate axes only.
 *
 * The time scale is rendered by Timeline as a sibling, not from here:
 * nesting it made the whole scale draw twice whenever both showAxes and
 * showTimeScale were enabled, which is the default.
 *
 * Internal: reads the enclosing Timeline's store and cannot be rendered on its
 * own.
 */
export const CoordinateAxes: React.FC = () => {
  // Canvas size comes from the store, so a resize re-renders the axes
  const canvasWidth = useTimelineStore((s) => s.canvasWidth);
  const canvasHeight = useTimelineStore((s) => s.canvasHeight);

  // Hook for calculating time Y-coordinate
  const getTimeY = useTimeY();

  // Y-coordinate of zero time point
  const zeroTimeY = getTimeY(0);
  const centerX = canvasWidth / 2;

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
    </>
  );
};

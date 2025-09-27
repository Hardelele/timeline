import React from 'react';
import { TimeDivision } from './TimeDivision';
import { useTimeScale } from '../hooks/useTimeScale';

/**
 * Time scale component
 * Displays time divisions with labels
 */
export const TimeScale: React.FC = () => {
  const { divisions } = useTimeScale();

  return (
    <>
      {divisions.map((division) => (
        <TimeDivision
          key={division.key}
          x={division.x}
          y={division.y}
          text={division.text}
        />
      ))}
    </>
  );
};
import React from 'react';
import { Line, Text } from 'react-konva';
import { POSITIONING_CONSTANTS } from '../constants/timeScaleConstants';

interface TimeDivisionProps {
  x: number;
  y: number;
  text: string;
}

export const TimeDivision: React.FC<TimeDivisionProps> = ({ x, y, text }) => {
  return (
    <>
      {/* Text with time label */}
      <Text
        x={x + POSITIONING_CONSTANTS.TEXT_OFFSET_X}
        y={y + POSITIONING_CONSTANTS.TEXT_OFFSET_Y}
        text={text}
        fontSize={POSITIONING_CONSTANTS.DEFAULT_FONT_SIZE}
        fill="black"
      />

      {/* Small tick mark */}
      <Line
        points={[
          x - POSITIONING_CONSTANTS.TICK_HALF_LENGTH,
          y,
          x + POSITIONING_CONSTANTS.TICK_HALF_LENGTH,
          y
        ]}
        stroke="black"
        strokeWidth={POSITIONING_CONSTANTS.DEFAULT_STROKE_WIDTH}
      />
    </>
  );
};

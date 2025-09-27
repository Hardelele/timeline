import React from 'react';
import { Line, Text } from 'react-konva';
import { POSITIONING_CONSTANTS } from '../constants/timeScaleConstants';

interface TimeDivisionProps {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
}

export const TimeDivision: React.FC<TimeDivisionProps> = ({ 
  x, 
  y, 
  text, 
  fontSize = POSITIONING_CONSTANTS.DEFAULT_FONT_SIZE 
}) => {
  return (
    <>
      {/* Текст с обозначением времени */}
      <Text
        x={x + POSITIONING_CONSTANTS.TEXT_OFFSET_X}
        y={y + POSITIONING_CONSTANTS.TEXT_OFFSET_Y}
        text={text}
        fontSize={fontSize}
        fill="black"
      />
      
      {/* Маленькая засечка */}
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

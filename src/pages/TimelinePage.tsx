import React from 'react';
import { Timeline } from '../timeline';

/**
 * Страница с таймлайном
 * Демонстрирует использование компонента Timeline на полный экран
 */
export const TimelinePage: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Timeline
        backgroundColor="#f5f5f5"
        showAxes={true}
        showTimeScale={true}
      />
    </div>
  );
};

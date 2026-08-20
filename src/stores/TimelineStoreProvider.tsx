import React from 'react';
import type { StoreApi } from 'zustand/vanilla';
import type { TimelineState } from './createTimelineStore';
import { TimelineStoreContext } from './timelineStoreContext';

interface TimelineStoreProviderProps {
  store: StoreApi<TimelineState>;
  children: React.ReactNode;
}

/**
 * Hands one Timeline's store down to its canvas children.
 *
 * Rendered inside <Stage>: react-konva runs a separate reconciler, and while it
 * has bridged React context since 18.2.2, keeping the provider next to the
 * Layer makes the ownership obvious.
 */
export const TimelineStoreProvider: React.FC<TimelineStoreProviderProps> = ({ store, children }) => (
  <TimelineStoreContext.Provider value={store}>{children}</TimelineStoreContext.Provider>
);

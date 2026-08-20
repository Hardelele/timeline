import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import type { StoreApi } from 'zustand/vanilla';
import type { TimelineState } from './createTimelineStore';

export const TimelineStoreContext = createContext<StoreApi<TimelineState> | null>(null);

/** Raw store of the enclosing Timeline, for imperative reads outside render. */
export const useTimelineStoreApi = (): StoreApi<TimelineState> => {
  const store = useContext(TimelineStoreContext);
  if (!store) {
    throw new Error('Timeline components must be rendered inside <Timeline>');
  }
  return store;
};

/**
 * Reads a slice of the enclosing Timeline's state.
 *
 * A selector is required on purpose: the previous store was consumed as
 * `useTimelineStore()` with destructuring, which subscribes to every field and
 * re-renders the consumer on any change.
 */
export const useTimelineStore = <T,>(selector: (state: TimelineState) => T): T =>
  useStore(useTimelineStoreApi(), selector);

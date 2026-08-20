import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';
import { createTimeIntervalService, TimeInterval } from '../services/timeIntervalService';

// Constants
const DEFAULT_PIXELS_PER_DIVISION = 40; // default pixels per division
const MIN_PIXELS_PER_DIVISION = 10;
const MAX_PIXELS_PER_DIVISION = 200;

export interface TimelineState {
  // Main timeline parameters
  offsetMs: number; // offset in milliseconds
  pixelsPerDivision: number; // pixels per division (can be 80, 40, etc.)
  currentInterval: TimeInterval; // current time interval, in milliseconds

  // Canvas geometry, kept here so that every consumer re-renders on resize
  canvasWidth: number;
  canvasHeight: number;

  // Interaction
  isDragging: boolean;

  // Actions for state changes
  setOffsetMs: (offsetMs: number) => void;
  setPixelsPerDivision: (pixelsPerDivision: number) => void;
  setCanvasSize: (width: number, height: number) => void;
  setDragging: (isDragging: boolean) => void;

  // Actions for zooming
  smoothZoom: (deltaPixels: number) => void; // smooth zooming
}

export interface CreateTimelineStoreOptions {
  canvasWidth?: number;
  canvasHeight?: number;
}

/**
 * Creates a timeline store owned by a single Timeline component.
 *
 * Previously the store was a module-level singleton and the scale, canvas size
 * and drag state lived on three more singletons in ../services. Two timelines
 * on one page therefore shared one zoom level, one canvas size and one drag
 * flag. Everything mutable now hangs off this factory, so each component
 * instance gets its own state and tests get a fresh store per case.
 */
export const createTimelineStore = (
  options: CreateTimelineStoreOptions = {}
): StoreApi<TimelineState> => {
  // Owned by this store: the scale tracker knows which step of the interval
  // table the timeline currently sits at.
  const intervals = createTimeIntervalService();

  return createStore<TimelineState>((set, get) => ({
    // Initial values
    offsetMs: 0, // offset in milliseconds
    pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION, // pixels per division
    currentInterval: intervals.getCurrentInterval(), // start with 1 second

    canvasWidth: options.canvasWidth ?? 0,
    canvasHeight: options.canvasHeight ?? 0,

    isDragging: false,

    // Actions
    setOffsetMs: (offsetMs) => set({ offsetMs }),

    setPixelsPerDivision: (pixelsPerDivision) => {
      // Check if need to switch to another interval
      if (intervals.shouldSwitchToNextInterval(pixelsPerDivision) && intervals.switchToNextInterval()) {
        // Switched to next interval, reset pixels to default value
        set({
          pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION,
          currentInterval: intervals.getCurrentInterval(),
        });
        return;
      }

      if (intervals.shouldSwitchToPreviousInterval(pixelsPerDivision) && intervals.switchToPreviousInterval()) {
        // Switched to previous interval, reset pixels to default value
        set({
          pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION,
          currentInterval: intervals.getCurrentInterval(),
        });
        return;
      }

      // If no switching occurred, just update pixels
      set({ pixelsPerDivision });
    },

    setCanvasSize: (width, height) => {
      const { canvasWidth, canvasHeight } = get();
      if (canvasWidth === width && canvasHeight === height) return;

      set({ canvasWidth: width, canvasHeight: height });
    },

    setDragging: (isDragging) => {
      if (get().isDragging === isDragging) return;

      set({ isDragging });
    },

    // Smooth zooming (e.g., with mouse wheel)
    smoothZoom: (deltaPixels) => {
      const { pixelsPerDivision, setPixelsPerDivision } = get();
      const next = Math.max(
        MIN_PIXELS_PER_DIVISION,
        Math.min(MAX_PIXELS_PER_DIVISION, pixelsPerDivision + deltaPixels)
      );

      // Use setPixelsPerDivision which will automatically check interval switching
      setPixelsPerDivision(next);
    },
  }));
};

import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';
import {
  DEFAULT_PIXELS_PER_DIVISION,
  DEFAULT_TIME_INTERVALS,
  resolveScaleIndex,
} from '../services/timeScale';

const MIN_PIXELS_PER_DIVISION = 10;
const MAX_PIXELS_PER_DIVISION = 200;

/**
 * Where the camera is pointing — not what it is looking at.
 *
 * Deliberately named "viewport": this state is per component instance, so a
 * document (events, lanes, branches) must NOT live here. Two views of the same
 * timeline have to show the same events while sitting at different zoom levels.
 */
export interface TimelineViewportState {
  // Main timeline parameters
  offsetMs: number; // offset in milliseconds
  pixelsPerDivision: number; // pixels per division (can be 80, 40, etc.)

  /** Ladder of scale steps, ascending. A parameter, not a global table. */
  intervals: readonly number[];
  /** Index into `intervals`: the single home of the current scale step. */
  intervalIndex: number;

  // Canvas geometry, kept here so that every consumer re-renders on resize
  canvasWidth: number;
  canvasHeight: number;

  /** Pointer Y where the current drag was last sampled; null when not dragging. */
  dragAnchorY: number | null;

  // Actions for state changes
  setOffsetMs: (offsetMs: number) => void;
  setPixelsPerDivision: (pixelsPerDivision: number) => void;
  setCanvasSize: (width: number, height: number) => void;
  setDragAnchorY: (dragAnchorY: number | null) => void;

  // Actions for zooming
  smoothZoom: (deltaPixels: number) => void; // smooth zooming
}

export interface CreateTimelineStoreOptions {
  canvasWidth?: number;
  canvasHeight?: number;
  offsetMs?: number;
  pixelsPerDivision?: number;
  /** Scale ladder to use. Defaults to the built-in seconds-to-millennia table. */
  intervals?: readonly number[];
  /** Scale step to start at, as an index into `intervals`. */
  intervalIndex?: number;
}

/** Milliseconds of the current division. */
export const currentIntervalMs = (state: TimelineViewportState): number =>
  state.intervals[state.intervalIndex];

/** Whether a drag is in progress. Derived — there is no separate flag to desync. */
export const isDragging = (state: TimelineViewportState): boolean => state.dragAnchorY !== null;

/**
 * Creates the viewport state owned by a single Timeline component.
 *
 * Previously this store was a module-level singleton and three more singletons
 * in ../services held the canvas size, the drag state and the scale step. Two
 * timelines on one page therefore shared all of it. Everything mutable now
 * hangs off this factory, so each instance gets its own state and tests get a
 * fresh store per case.
 */
export const createTimelineStore = (
  options: CreateTimelineStoreOptions = {}
): StoreApi<TimelineViewportState> => {
  const intervals = options.intervals ?? DEFAULT_TIME_INTERVALS;

  return createStore<TimelineViewportState>((set, get) => ({
    // Initial values
    offsetMs: options.offsetMs ?? 0, // offset in milliseconds
    pixelsPerDivision: options.pixelsPerDivision ?? DEFAULT_PIXELS_PER_DIVISION,

    intervals,
    intervalIndex: options.intervalIndex ?? 0, // start with the finest step

    canvasWidth: options.canvasWidth ?? 0,
    canvasHeight: options.canvasHeight ?? 0,

    dragAnchorY: null,

    // Actions
    setOffsetMs: (offsetMs) => set({ offsetMs }),

    setPixelsPerDivision: (pixelsPerDivision) => {
      const { intervalIndex } = get();
      const nextIndex = resolveScaleIndex(intervalIndex, pixelsPerDivision, intervals);

      if (nextIndex !== intervalIndex) {
        // Switched step: density restarts from the default for the new one
        set({ intervalIndex: nextIndex, pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION });
        return;
      }

      set({ pixelsPerDivision });
    },

    setCanvasSize: (width, height) => {
      const { canvasWidth, canvasHeight } = get();
      if (canvasWidth === width && canvasHeight === height) return;

      set({ canvasWidth: width, canvasHeight: height });
    },

    setDragAnchorY: (dragAnchorY) => set({ dragAnchorY }),

    // Smooth zooming (e.g., with mouse wheel)
    smoothZoom: (deltaPixels) => {
      const { pixelsPerDivision, setPixelsPerDivision } = get();

      setPixelsPerDivision(
        Math.max(
          MIN_PIXELS_PER_DIVISION,
          Math.min(MAX_PIXELS_PER_DIVISION, pixelsPerDivision + deltaPixels)
        )
      );
    },
  }));
};

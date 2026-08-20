import type { KonvaEventObject } from 'konva/lib/Node';
import type { StoreApi } from 'zustand/vanilla';
import { currentIntervalMs } from '../stores/createTimelineStore';
import type { TimelineViewportState } from '../stores/createTimelineStore';
import { getTimePerPixel } from './screenGeometry';

export interface DragController {
  handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
}

/**
 * Creates a drag controller bound to one timeline store.
 *
 * This used to be a singleton holding drag state plus a single
 * onDragStateChange callback slot, so mounting a second timeline stole the
 * callback from the first. The controller now keeps nothing of its own: the
 * anchor lives in the store it was handed, and "is dragging" is derived from it
 * rather than mirrored into a second field.
 */
export const createDragController = (store: StoreApi<TimelineViewportState>): DragController => {
  const stop = () => store.getState().setDragAnchorY(null);

  return {
    handleMouseDown: (e) => {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      store.getState().setDragAnchorY(pos.y);
    },

    handleMouseMove: (e) => {
      const state = store.getState();
      if (state.dragAnchorY === null) return;

      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      const deltaY = pos.y - state.dragAnchorY;
      const timePerPixel = getTimePerPixel(currentIntervalMs(state), state.pixelsPerDivision);

      state.setOffsetMs(state.offsetMs + deltaY * timePerPixel);
      state.setDragAnchorY(pos.y);
    },

    handleMouseUp: stop,
    handleMouseLeave: stop,
  };
};

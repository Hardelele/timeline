import type { KonvaEventObject } from 'konva/lib/Node';
import type { StoreApi } from 'zustand/vanilla';
import type { TimelineState } from '../stores/createTimelineStore';
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
 * This used to be a singleton holding a single onDragStateChange callback, so a
 * second timeline on the page would overwrite the first one's callback and
 * leave it stuck in the dragging state. Drag state now lives in the store the
 * controller was handed, and each timeline gets its own controller.
 */
export const createDragController = (store: StoreApi<TimelineState>): DragController => {
  let lastPointerY: number | null = null;

  const stop = () => {
    lastPointerY = null;
    store.getState().setDragging(false);
  };

  return {
    handleMouseDown: (e) => {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      lastPointerY = pos.y;
      store.getState().setDragging(true);
    },

    handleMouseMove: (e) => {
      if (lastPointerY === null) return;

      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      const deltaY = pos.y - lastPointerY;
      const { offsetMs, pixelsPerDivision, currentInterval, setOffsetMs } = store.getState();
      const timePerPixel = getTimePerPixel(currentInterval, pixelsPerDivision);

      setOffsetMs(offsetMs + deltaY * timePerPixel);
      lastPointerY = pos.y;
    },

    handleMouseUp: stop,
    handleMouseLeave: stop,
  };
};

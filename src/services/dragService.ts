import { useTimelineStore } from '../stores/timelineStore';

export class DragService {
  private static instance: DragService;
  private isDragging: boolean = false;
  private lastPointerPosition: { x: number; y: number } | null = null;
  private onDragStateChange?: (isDragging: boolean) => void;

  private constructor() {}

  public static getInstance(): DragService {
    if (!DragService.instance) {
      DragService.instance = new DragService();
    }
    return DragService.instance;
  }

  // Set callback for drag state change notifications
  public setOnDragStateChange(callback: (isDragging: boolean) => void): void {
    this.onDragStateChange = callback;
  }

  // Mouse down handler for drag start
  public handleMouseDown = (e: any): void => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    this.isDragging = true;
    this.lastPointerPosition = pos;
    this.onDragStateChange?.(true);
  };

  // Mouse move handler during drag
  public handleMouseMove = (e: any): void => {
    if (!this.isDragging || !this.lastPointerPosition) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const deltaY = pos.y - this.lastPointerPosition.y;
    
    // Get current state and update offsetMs
    const { offsetMs, setOffsetMs, getTimePerPixel } = useTimelineStore.getState();
    const timePerPixel = getTimePerPixel();
    setOffsetMs(offsetMs + deltaY * timePerPixel); // Remove inversion for natural movement
    
    this.lastPointerPosition = pos;
  };

  // Mouse up handler for drag end
  public handleMouseUp = (): void => {
    this.isDragging = false;
    this.lastPointerPosition = null;
    this.onDragStateChange?.(false);
  };

  // Mouse leave handler (also stops dragging)
  public handleMouseLeave = (): void => {
    this.handleMouseUp();
  };

  // Get current drag state
  public getIsDragging(): boolean {
    return this.isDragging;
  }
}

// Export singleton instance
export const dragService = DragService.getInstance();

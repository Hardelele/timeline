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

  // Устанавливаем callback для уведомления об изменении состояния перетаскивания
  public setOnDragStateChange(callback: (isDragging: boolean) => void): void {
    this.onDragStateChange = callback;
  }

  // Обработчик начала перетаскивания
  public handleMouseDown = (e: any): void => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    this.isDragging = true;
    this.lastPointerPosition = pos;
    this.onDragStateChange?.(true);
  };

  // Обработчик движения мыши при перетаскивании
  public handleMouseMove = (e: any): void => {
    if (!this.isDragging || !this.lastPointerPosition) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const deltaY = pos.y - this.lastPointerPosition.y;
    
    // Получаем текущее состояние и обновляем offsetMs
    const { offsetMs, setOffsetMs, getTimePerPixel } = useTimelineStore.getState();
    const timePerPixel = getTimePerPixel();
    setOffsetMs(offsetMs + deltaY * timePerPixel); // Убираем инверсию для естественного движения
    
    this.lastPointerPosition = pos;
  };

  // Обработчик окончания перетаскивания
  public handleMouseUp = (): void => {
    this.isDragging = false;
    this.lastPointerPosition = null;
    this.onDragStateChange?.(false);
  };

  // Обработчик выхода мыши за границы (тоже останавливает перетаскивание)
  public handleMouseLeave = (): void => {
    this.handleMouseUp();
  };

  // Получить текущее состояние перетаскивания
  public getIsDragging(): boolean {
    return this.isDragging;
  }
}

// Экспортируем singleton instance
export const dragService = DragService.getInstance();

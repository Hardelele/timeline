export class ScreenService {
  private static instance: ScreenService;
  private canvasWidth: number = 800;
  private canvasHeight: number = 600;

  private constructor() {}

  public static getInstance(): ScreenService {
    if (!ScreenService.instance) {
      ScreenService.instance = new ScreenService();
    }
    return ScreenService.instance;
  }

  // Обновить размеры canvas
  public updateCanvasSize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  // Получить размеры canvas
  public getCanvasSize(): { width: number; height: number } {
    return {
      width: this.canvasWidth,
      height: this.canvasHeight
    };
  }

  // Получить центр экрана
  public getCenter(): { x: number; y: number } {
    return {
      x: this.canvasWidth / 2,
      y: this.canvasHeight / 2
    };
  }

  // Получить ширину
  public getWidth(): number {
    return this.canvasWidth;
  }

  // Получить высоту
  public getHeight(): number {
    return this.canvasHeight;
  }

  // Вычислить Y-координату для временного деления
  public getTimeDivisionY(
    zeroTimeY: number,
    divisionIndex: number,
    pixelsPerDivision: number
  ): number {
    return zeroTimeY - divisionIndex * pixelsPerDivision;
  }

  // Вычислить Y-координату нулевой точки времени
  public getZeroTimeY(centerY: number, offsetPixels: number): number {
    return centerY + offsetPixels;
  }
}

// Экспортируем singleton instance
export const screenService = ScreenService.getInstance();

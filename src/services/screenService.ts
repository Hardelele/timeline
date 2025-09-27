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

  // Update canvas dimensions
  public updateCanvasSize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  // Get canvas dimensions
  public getCanvasSize(): { width: number; height: number } {
    return {
      width: this.canvasWidth,
      height: this.canvasHeight
    };
  }

  // Get screen center
  public getCenter(): { x: number; y: number } {
    return {
      x: this.canvasWidth / 2,
      y: this.canvasHeight / 2
    };
  }

  // Get width
  public getWidth(): number {
    return this.canvasWidth;
  }

  // Get height
  public getHeight(): number {
    return this.canvasHeight;
  }

  // Calculate Y-coordinate for time division
  public getTimeDivisionY(
    zeroTimeY: number,
    divisionIndex: number,
    pixelsPerDivision: number
  ): number {
    return zeroTimeY - divisionIndex * pixelsPerDivision;
  }

  // Calculate Y-coordinate of zero time point
  public getZeroTimeY(centerY: number, offsetPixels: number): number {
    return centerY + offsetPixels;
  }
}

// Export singleton instance
export const screenService = ScreenService.getInstance();

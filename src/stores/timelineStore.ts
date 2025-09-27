import { create } from 'zustand';
import { timeIntervalService, TimeInterval } from '../services/timeIntervalService';

// Constants
const DEFAULT_PIXELS_PER_DIVISION = 40; // default pixels per division

interface TimelineState {
  // Main timeline parameters
  offsetMs: number; // offset in milliseconds
  pixelsPerDivision: number; // pixels per division (can be 80, 40, etc.)
  currentInterval: TimeInterval; // current time interval
  
  // Actions for state changes
  setOffsetMs: (offsetMs: number) => void;
  setPixelsPerDivision: (pixelsPerDivision: number) => void;
  setCurrentInterval: (interval: TimeInterval) => void;
  
  // Actions for zooming
  zoomIn: () => void;
  zoomOut: () => void;
  smoothZoom: (deltaPixels: number) => void; // smooth zooming
  
  // Computed values
  getCurrentIntervalMs: () => number;
  getCurrentIntervalSeconds: () => number;
  getCurrentIntervalName: () => string;
  getTimePerPixel: () => number; // milliseconds per 1 pixel
  getScaledRadius: () => number;
  getScaledFontSize: () => number;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  // Initial values
  offsetMs: 0, // offset in milliseconds
  pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION, // pixels per division
  currentInterval: TimeInterval.ONE_SECOND, // start with 1 second
  
  // Actions
  setOffsetMs: (offsetMs) => set({ offsetMs }),
  setPixelsPerDivision: (pixelsPerDivision) => {
    // Check if need to switch to another interval
    if (timeIntervalService.shouldSwitchToNextInterval(pixelsPerDivision)) {
      // Switch to next interval and reset pixels to default value
      if (timeIntervalService.switchToNextInterval()) {
        const newInterval = timeIntervalService.getCurrentInterval();
        set({ 
          pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION,
          currentInterval: newInterval 
        });
        return;
      }
    }
    
    if (timeIntervalService.shouldSwitchToPreviousInterval(pixelsPerDivision)) {
      // Switch to previous interval and reset pixels to default value
      if (timeIntervalService.switchToPreviousInterval()) {
        const newInterval = timeIntervalService.getCurrentInterval();
        set({ 
          pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION,
          currentInterval: newInterval 
        });
        return;
      }
    }
    
    // If no switching occurred, just update pixels
    set({ pixelsPerDivision });
  },
  setCurrentInterval: (interval) => {
    timeIntervalService.setInterval(interval);
    set({ currentInterval: interval });
  },
  
  // Actions for zooming
  zoomIn: () => {
    timeIntervalService.zoomIn();
    const newInterval = timeIntervalService.getCurrentInterval();
    const pixelsPerDivision = get().pixelsPerDivision;
    
    // Update current interval in store
    set({ currentInterval: newInterval });
    
    // If interval became smaller, can increase pixels per division for better readability
    if (newInterval < TimeInterval.ONE_SECOND && pixelsPerDivision > DEFAULT_PIXELS_PER_DIVISION) {
      set({ pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION });
    }
  },
  
  zoomOut: () => {
    timeIntervalService.zoomOut();
    const newInterval = timeIntervalService.getCurrentInterval();
    const pixelsPerDivision = get().pixelsPerDivision;
    
    // Update current interval in store
    set({ currentInterval: newInterval });
    
    // If interval became larger, can decrease pixels per division
    if (newInterval > TimeInterval.ONE_MINUTE && pixelsPerDivision < DEFAULT_PIXELS_PER_DIVISION) {
      set({ pixelsPerDivision: DEFAULT_PIXELS_PER_DIVISION });
    }
  },

  // Smooth zooming (e.g., with mouse wheel)
  smoothZoom: (deltaPixels) => {
    const { pixelsPerDivision } = get();
    const newPixelsPerDivision = Math.max(10, Math.min(200, pixelsPerDivision + deltaPixels));
    
    // Use setPixelsPerDivision which will automatically check interval switching
    get().setPixelsPerDivision(newPixelsPerDivision);
  },
  
  // Computed values
  getCurrentIntervalMs: () => timeIntervalService.getCurrentIntervalMs(),
  getCurrentIntervalSeconds: () => timeIntervalService.getCurrentIntervalSeconds(),
  getCurrentIntervalName: () => timeIntervalService.getCurrentIntervalName(),
  
  getTimePerPixel: () => {
    const { pixelsPerDivision } = get();
    const intervalMs = timeIntervalService.getCurrentIntervalMs();
    return intervalMs / pixelsPerDivision; // milliseconds per 1 pixel
  },
  
  getScaledRadius: () => {
    const timePerPixel = get().getTimePerPixel();
    const baseRadius = 5;
    // Radius depends on time scale
    return Math.max(2, baseRadius * (1000 / timePerPixel)); // minimum 2px
  },
  
  getScaledFontSize: () => {
    const timePerPixel = get().getTimePerPixel();
    const baseFontSize = 14;
    // Font size depends on time scale
    return Math.max(10, baseFontSize * (1000 / timePerPixel)); // minimum 10px
  },
}));

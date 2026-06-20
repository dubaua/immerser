import type { ILayerMetrics } from './types';

/** Calculates how much of a layer overlaps the viewport as a value from 0 to 1. */
export default function calculateLayerProgress(
  layer: ILayerMetrics,
  scrollY: number,
  viewportHeight: number,
): number {
  const viewportBottom = scrollY + viewportHeight;
  const layerHeight = layer.bottom - layer.top;
  const overlap = Math.min(layer.bottom, viewportBottom) - Math.max(layer.top, scrollY);
  const overlapBase = Math.min(layerHeight, viewportHeight);
  return overlapBase <= 0 ? 0 : Math.max(0, Math.min(1, overlap / overlapBase));
}

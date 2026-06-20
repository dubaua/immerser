import type { ILayerMetrics } from './types';

/** Returns the nearest layer-edge scroll target without clamping it to a scroll container's bounds. */
export default function calculateScrollTarget({
  activeLayer,
  scrollAdjustThreshold,
  scrollY,
  viewportHeight,
}: {
  activeLayer: ILayerMetrics;
  scrollAdjustThreshold: number;
  scrollY: number;
  viewportHeight: number;
}): number | null {
  const topThreshold = Math.abs(scrollY - activeLayer.top);
  const bottomThreshold = Math.abs(scrollY + viewportHeight - activeLayer.bottom);

  if (topThreshold !== 0 && bottomThreshold !== 0) {
    if (topThreshold <= bottomThreshold && topThreshold <= scrollAdjustThreshold) {
      return activeLayer.top;
    }
    if (bottomThreshold <= topThreshold && bottomThreshold <= scrollAdjustThreshold) {
      return activeLayer.bottom - viewportHeight;
    }
  }

  return null;
}

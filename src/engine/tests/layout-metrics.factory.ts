import type { ILayerMetrics, ILayoutMetrics } from '../types';

export default function createLayoutMetrics({
  layers,
  rootHeight = 0,
  rootTop = 0,
  viewportHeight = 0,
}: {
  layers: readonly ILayerMetrics[];
  rootHeight?: number;
  rootTop?: number;
  viewportHeight?: number;
}): ILayoutMetrics {
  return {
    layers,
    rootHeight,
    rootTop,
    viewportHeight,
  };
}

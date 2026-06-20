import type { ILayerCalculation } from './types';

/** Selects the layer crossing the configured pager point while preserving the previous index outside all layers. */
export default function calculateActiveIndex(
  layerStateArray: readonly ILayerCalculation[],
  scrollY: number,
  viewportHeight: number,
  pagerThreshold: number,
  previousActiveIndex: number,
): number {
  const pagerScrollActivePoint = scrollY + viewportHeight * (1 - pagerThreshold);
  let activeIndex = previousActiveIndex;

  layerStateArray.forEach(({ bottom, top }, layerIndex) => {
    if (top <= pagerScrollActivePoint && pagerScrollActivePoint < bottom) {
      activeIndex = layerIndex;
    }
  });

  return activeIndex;
}

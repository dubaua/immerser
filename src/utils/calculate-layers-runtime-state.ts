import type { ICalculationResult, ILayerCalculation } from '../internal-types';

/** Calculates the scroll-derived runtime snapshot for all prepared layers. */
export default function calculateLayersRuntimeState({
  layerCalculationArray,
  pagerThreshold,
  previousActiveIndex,
  rootHeight,
  scrollY,
  viewportHeight,
}: {
  layerCalculationArray: ILayerCalculation[];
  pagerThreshold: number;
  previousActiveIndex: number;
  rootHeight: number;
  scrollY: number;
  viewportHeight: number;
}): ICalculationResult {
  const pagerScrollActivePoint = scrollY + viewportHeight * (1 - pagerThreshold);
  let activeIndex = previousActiveIndex;
  const layerProgressArray: number[] = [];
  const transforms = layerCalculationArray.map((layer, layerIndex) => {
    if (layer.top <= pagerScrollActivePoint && pagerScrollActivePoint < layer.bottom) {
      activeIndex = layerIndex;
    }

    const viewportBottom = scrollY + viewportHeight;
    const layerHeight = layer.bottom - layer.top;
    const overlap = Math.min(layer.bottom, viewportBottom) - Math.max(layer.top, scrollY);
    const overlapBase = Math.min(layerHeight, viewportHeight);
    layerProgressArray.push(overlapBase <= 0 ? 0 : Math.max(0, Math.min(1, overlap / overlapBase)));

    let progress: number;

    if (layer.beginEnter > scrollY) {
      progress = rootHeight;
    } else if (layer.beginEnter <= scrollY && scrollY < layer.endEnter) {
      progress = layer.endEnter - scrollY;
    } else if (layer.endEnter <= scrollY && scrollY < layer.beginLeave) {
      progress = 0;
    } else if (layer.beginLeave <= scrollY && scrollY < layer.endLeave) {
      progress = layer.beginLeave - scrollY;
    } else {
      progress = -rootHeight;
    }

    return progress;
  });

  return {
    activeIndex,
    layerProgressArray,
    previousActiveIndex,
    transforms,
  };
}

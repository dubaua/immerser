import type { ILayerCalculation } from '../internal-types';

/** Derives scroll transition boundaries for every layer from the measured layout. */
export default function calculateLayerStateArray({
  layers,
  rootHeight,
  rootTop,
}: {
  layers: readonly Pick<ILayerCalculation, 'bottom' | 'top'>[];
  rootHeight: number;
  rootTop: number;
}): ILayerCalculation[] {
  return layers.map(({ bottom, top }) => {
    const endEnter = top - rootTop;
    const beginEnter = endEnter - rootHeight;
    const endLeave = bottom - rootTop;
    const beginLeave = endLeave - rootHeight;

    return {
      beginEnter,
      beginLeave,
      bottom,
      endEnter,
      endLeave,
      top,
    };
  });
}

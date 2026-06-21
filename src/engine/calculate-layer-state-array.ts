import type { ILayerCalculation, ILayoutMetrics } from './types';

/** Derives scroll transition boundaries for every layer from the measured layout. */
export default function calculateLayerStateArray(layout: ILayoutMetrics): ILayerCalculation[] {
  return layout.layers.map(({ bottom, top }) => {
    const endEnter = top - layout.rootTop;
    const beginEnter = endEnter - layout.rootHeight;
    const endLeave = bottom - layout.rootTop;
    const beginLeave = endLeave - layout.rootHeight;

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

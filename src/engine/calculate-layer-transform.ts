import type { ILayerCalculation, ILayerTransform } from './types';

/** Calculates opposite mask transforms that expose the layer-specific solid group. */
export default function calculateLayerTransform(
  layer: ILayerCalculation,
  scrollY: number,
  rootHeight: number,
): ILayerTransform {
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

  return {
    innerTranslateY: progress === 0 ? 0 : -progress,
    maskTranslateY: progress,
  };
}

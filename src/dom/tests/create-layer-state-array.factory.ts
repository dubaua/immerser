import type { IDomLayerState } from '../types';

export default function createLayerStateArray(
  solidClassnamesArray: IDomLayerState['solidClassnames'][] = [null, null],
): IDomLayerState[] {
  return solidClassnamesArray.map((solidClassnames, layerIndex) => ({
    id: `${layerIndex === 0 ? 'first' : 'second'}-layer`,
    layerNode: document.createElement('section'),
    maskInnerNode: null,
    maskNode: null,
    order: layerIndex,
    solidClassnames,
  }));
}

import type { IDomLayerState } from '../types';

export default function createLayerStateArray(
  solidClassnameArray: IDomLayerState['solidClassnames'][] = [null, null],
): IDomLayerState[] {
  return solidClassnameArray.map((solidClassnames, layerIndex) => ({
    id: `${layerIndex === 0 ? 'first' : 'second'}-layer`,
    layerNode: document.createElement('section'),
    maskInnerNode: null,
    maskNode: null,
    solidClassnames,
  }));
}

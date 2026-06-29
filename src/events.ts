/** @public All available immerser event names. */
export const EventNames = {
  init: 'init',
  mount: 'mount',
  unmount: 'unmount',
  destroy: 'destroy',
  structureChange: 'structureChange',
  layoutChange: 'layoutChange',
  activeLayerChange: 'activeLayerChange',
  layerProgressChange: 'layerProgressChange',
  stateChange: 'stateChange',
} as const;

/** @public All available immerser event names as an iterable array. */
export const EventNameArray = Object.values(EventNames);

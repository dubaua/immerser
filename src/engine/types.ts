export interface IEngineOptions {
  pagerThreshold: number;
}

export interface ILayerMetrics {
  top: number;
  bottom: number;
}

export interface ILayoutMetrics {
  layers: readonly ILayerMetrics[];
  rootHeight: number;
  rootTop: number;
  viewportHeight: number;
}

export interface ILayerCalculation extends ILayerMetrics {
  beginEnter: number;
  beginLeave: number;
  endEnter: number;
  endLeave: number;
}

export interface ILayerTransform {
  innerTranslateY: number;
  maskTranslateY: number;
}

export interface IEngineSnapshot {
  activeIndex: number;
  layerProgressArray: readonly number[];
  transforms: readonly ILayerTransform[];
}

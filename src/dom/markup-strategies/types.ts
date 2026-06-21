import type { IDomLayerState, IReportParams } from '../types';

export interface IMarkupSelectors {
  mask: string;
  maskInner: string;
  solid: string;
}

export interface IMarkupStrategyParams {
  report(params: IReportParams): void;
  rootNode: HTMLElement;
  selectors: IMarkupSelectors;
}

export interface IMarkupStrategy {
  cleanup(layerStateArray: IDomLayerState[]): void;
  prepare(layerStateArray: IDomLayerState[]): IDomLayerState[];
}

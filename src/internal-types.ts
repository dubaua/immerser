import { SolidClassnames } from './types';

export interface ILayerCalculation {
  top: number;
  bottom: number;
  beginEnter: number;
  beginLeave: number;
  endEnter: number;
  endLeave: number;
}

export interface ILayerTransform {
  innerTranslateY: number;
  maskTranslateY: number;
}

export interface ICalculationResult {
  activeIndex: number;
  layerProgressArray: readonly number[];
  transforms: readonly ILayerTransform[];
}

export interface IReportParams {
  docsHash?: string;
  error?: unknown;
  isWarning?: boolean;
  message: string;
}

export interface IImmerserLayerState {
  calculation: ILayerCalculation | null;
  id: string;
  layerNode: HTMLElement;
  maskInnerNode: HTMLElement | null;
  maskNode: HTMLElement | null;
  order: number;
  solidClassnames: SolidClassnames | null;
}

export interface ICalculationTransition {
  previousActiveIndex: number;
  calculation: ICalculationResult;
}

export interface IMaskMarkup {
  createdMask: boolean;
  maskInnerNode: HTMLElement;
  maskNode: HTMLElement;
}

export interface IClonedSolid {
  maskInnerNode: HTMLElement;
  node: HTMLElement;
}

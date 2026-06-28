import { SolidClassnames } from './types';

/** @internal */
export interface ILayerCalculation {
  top: number;
  bottom: number;
  beginEnter: number;
  beginLeave: number;
  endEnter: number;
  endLeave: number;
}

/** @internal */
export interface ILayerTransform {
  innerTranslateY: number;
  maskTranslateY: number;
}

/** @internal */
export interface ICalculationResult {
  activeIndex: number;
  layerProgressArray: readonly number[];
  previousActiveIndex: number;
  transforms: readonly ILayerTransform[];
}

/** @internal */
export interface IReportParams {
  docsHash?: string;
  error?: unknown;
  isWarning?: boolean;
  message: string;
}

/** @internal */
export interface IImmerserLayerState {
  calculation: ILayerCalculation | null;
  id: string;
  layerNode: HTMLElement;
  maskInnerNode: HTMLElement | null;
  maskNode: HTMLElement | null;
  order: number;
  solidClassnames: SolidClassnames | null;
}

/** @internal */
export interface IMaskMarkup {
  createdMask: boolean;
  maskInnerNode: HTMLElement;
  maskNode: HTMLElement;
}

/** @internal */
export interface IClonedSolid {
  maskInnerNode: HTMLElement;
  node: HTMLElement;
}

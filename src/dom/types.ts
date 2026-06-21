import type ImmerserEngine from '../engine/immerser-engine';
import type { IEngineSnapshot } from '../engine/types';
import type { Options, SolidClassnames } from '../types';

export type DomAdapterOptions = Pick<
  Options,
  | 'markupMode'
  | 'fromViewportWidth'
  | 'hasToUpdateHash'
  | 'isScrollHandled'
  | 'pagerLinkActiveClassname'
  | 'scrollAdjustDelay'
  | 'scrollAdjustThreshold'
  | 'solidClassnameArray'
>;

export interface IDomLayerState {
  id: string;
  layerNode: HTMLElement;
  maskInnerNode: HTMLElement | null;
  maskNode: HTMLElement | null;
  solidClassnames: SolidClassnames | null;
}

export interface IReportParams {
  docsHash?: string;
  error?: unknown;
  isWarning?: boolean;
  message: string;
}

export interface IImmerserDomAdapterCallbacks {
  onActiveLayerChange(layerIndex: number): void;
  onBind(): void;
  onDestroy(): void;
  onLayersUpdate(layersProgress: number[]): void;
  onUnbind(): void;
  report(params: IReportParams): void;
}

export interface IImmerserDomAdapterParams {
  callbacks: IImmerserDomAdapterCallbacks;
  engine: ImmerserEngine;
  options: DomAdapterOptions;
}

export interface ISnapshotTransition {
  previousActiveIndex: number;
  snapshot: IEngineSnapshot;
}

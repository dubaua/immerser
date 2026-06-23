import calculateActiveIndex from './calculate-active-index';
import calculateLayerProgress from './calculate-layer-progress';
import calculateLayerStateArray from './calculate-layer-state-array';
import calculateLayerTransform from './calculate-layer-transform';
import calculateScrollTarget from './calculate-scroll-target';
import type {
  IEngineOptions,
  IEngineSnapshot,
  ILayerCalculation,
  ILayoutMetrics,
} from './types';

export default class ImmerserEngine {
  private _layerStateArray: ILayerCalculation[] = [];
  private _layout: ILayoutMetrics | null = null;
  private _options: IEngineOptions;
  private _snapshot: IEngineSnapshot = {
    activeIndex: -1,
    layerProgressArray: [],
    transforms: [],
  };

  constructor(options: IEngineOptions) {
    this._options = options;
  }

  public updateOptions(options: IEngineOptions): void {
    this._options = options;
  }

  public setLayout(layout: ILayoutMetrics): void {
    this._layout = layout;
    this._layerStateArray = calculateLayerStateArray(layout);
    if (this._snapshot.layerProgressArray.length === 0) {
      this._snapshot = {
        ...this._snapshot,
        layerProgressArray: layout.layers.map(() => 0),
      };
    }
  }

  public calculate(scrollY: number): IEngineSnapshot {
    if (!this._layout) {
      throw new Error('ImmerserEngine layout is not set.');
    }

    const layerProgressArray = this._layerStateArray.map((layer) =>
      calculateLayerProgress(layer, scrollY, this._layout.viewportHeight),
    );
    const transforms = this._layerStateArray.map((layer) =>
      calculateLayerTransform(layer, scrollY, this._layout.rootHeight),
    );
    const activeIndex = calculateActiveIndex(
      this._layerStateArray,
      scrollY,
      this._layout.viewportHeight,
      this._options.pagerThreshold,
      this._snapshot.activeIndex,
    );

    this._snapshot = {
      activeIndex,
      layerProgressArray,
      transforms,
    };
    return this._snapshot;
  }

  public calculateScrollTarget(scrollY: number, scrollAdjustThreshold: number): number | null {
    if (!this._layout) {
      throw new Error('ImmerserEngine layout is not set.');
    }

    const activeLayer = this._layerStateArray[this._snapshot.activeIndex];
    if (!activeLayer) {
      return null;
    }

    return calculateScrollTarget({
      activeLayer,
      scrollAdjustThreshold,
      scrollY,
      viewportHeight: this._layout.viewportHeight,
    });
  }

  public resetActiveIndex(): void {
    this._snapshot = {
      ...this._snapshot,
      activeIndex: -1,
    };
  }

  public reset(): void {
    this._layerStateArray = [];
    this._layout = null;
    this._snapshot = {
      activeIndex: -1,
      layerProgressArray: [],
      transforms: [],
    };
  }

  public get snapshot(): IEngineSnapshot {
    return this._snapshot;
  }
}

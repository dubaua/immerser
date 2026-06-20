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
  private _activeIndex = -1;
  private _layerStateArray: ILayerCalculation[] = [];
  private _layout: ILayoutMetrics | null = null;
  private readonly _options: IEngineOptions;

  constructor(options: IEngineOptions) {
    this._options = options;
  }

  public setLayout(layout: ILayoutMetrics): void {
    this._layout = layout;
    this._layerStateArray = calculateLayerStateArray(layout);
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
    this._activeIndex = calculateActiveIndex(
      this._layerStateArray,
      scrollY,
      this._layout.viewportHeight,
      this._options.pagerThreshold,
      this._activeIndex,
    );

    return {
      activeIndex: this._activeIndex,
      layerProgressArray,
      transforms,
    };
  }

  public calculateScrollTarget(scrollY: number, scrollAdjustThreshold: number): number | null {
    if (!this._layout) {
      throw new Error('ImmerserEngine layout is not set.');
    }

    const activeLayer = this._layerStateArray[this._activeIndex];
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
    this._activeIndex = -1;
  }

  public reset(): void {
    this.resetActiveIndex();
    this._layerStateArray = [];
    this._layout = null;
  }
}

import Observable from '@dubaua/observable';
import ImmerserMarkupController from './immerser-markup-controller';
import { ImmerserSelectors } from './selectors';
import getLastScrollPosition from './utils/get-last-scroll-position';
import queryElementArray from './utils/query-element-array';
import type { IEngineSnapshot } from '../engine/types';
import type {
  DomControllerOptions,
  IDomLayerState,
  IImmerserDomControllerCallbacks,
  IImmerserDomControllerParams,
  IReportParams,
  ISnapshotTransition,
} from './types';
import type ImmerserEngine from '../engine/immerser-engine';
import type { SolidClassnames } from '../types';

type SynchroHoverSnapshot = {
  hadHoverClass: boolean;
  node: HTMLElement;
};

export default class ImmerserDomController {
  private readonly _callbacks: IImmerserDomControllerCallbacks;
  private readonly _engine: ImmerserEngine;
  private _options: DomControllerOptions;
  private _selectors = ImmerserSelectors;
  private _layerStateById = new Map<string, IDomLayerState>();
  private _isMounted = false;
  private _isBound = false;
  private _rootNode: HTMLElement | null = null;
  private _layerNodeArray: HTMLElement[] = [];
  private _pagerLinkNodeArray: HTMLElement[] = [];
  private _synchroHoverNodeArray: HTMLElement[] = [];
  private _synchroHoverSnapshots: SynchroHoverSnapshot[] = [];
  private _markupController: ImmerserMarkupController | null = null;
  private _resizeFrameId: number | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _scrollFrameId: number | null = null;
  private _scrollAdjustTimerId: ReturnType<typeof setTimeout> | null = null;
  private _reactiveWindowWidth = new Observable<number>(-1);
  private _reactiveSynchroHoverId = new Observable<string | null>(null);
  private _unsubscribeSynchroHover: (() => void) | null = null;
  private _unsubscribeToggleBindOnResize: (() => void) | null = null;
  private _onResize: (() => void) | null = null;
  private _onScroll: (() => void) | null = null;
  private _onSynchroHoverMouseOver: ((e: MouseEvent) => void) | null = null;
  private _onSynchroHoverMouseOut: (() => void) | null = null;

  /** Stores the runtime collaborators required by the DOM controller. */
  constructor({ callbacks, engine, options }: IImmerserDomControllerParams) {
    this._callbacks = callbacks;
    this._engine = engine;
    this._options = options;
  }

  /** Discovers DOM state, validates configuration and starts responsive runtime handling. */
  public mount(selectorRoot: ParentNode = document): void {
    if (this._isMounted) {
      return;
    }
    this._setDomNodes(selectorRoot);
    this._validateMarkup();
    this._validateLayerIds();
    this._readClassnamesFromMarkup();
    this._validateSolidClassnamesConfig();
    this._initLayerStateMap();
    this._initMarkupController();
    this._isMounted = true;
    this._toggleBindOnResizeObserver();
    this._setSizes();
    this._addScrollAndResizeListeners();
  }

  /** Creates the controller that derives markup ownership from the current DOM. */
  private _initMarkupController(): void {
    this._markupController = new ImmerserMarkupController({
      report: this._report.bind(this),
      rootNode: this._rootNode,
      selectors: this._selectors,
    });
  }

  /** Routes DOM controller diagnostics through the configured reporting callback. */
  private _report(params: IReportParams): void {
    this._callbacks.report(params);
  }

  /** Returns layer states in DOM order for the array-based engine boundary. */
  private get _orderedLayerStateArray(): IDomLayerState[] {
    return Array.from(this._layerStateById.values()).sort((a, b) => a.order - b.order);
  }

  /** Collects root, layer and solid nodes from DOM. */
  private _setDomNodes(selectorRoot: ParentNode): void {
    this._rootNode = selectorRoot.querySelector<HTMLElement>(this._selectors.root);
    this._layerNodeArray = queryElementArray({ selector: this._selectors.layer, parent: selectorRoot });
  }

  /** Validates required markup presence and reports descriptive errors. */
  private _validateMarkup(): void {
    if (!this._rootNode) {
      this._report({
        message: 'root node not found.',
        docsHash: '#prepare-your-markup',
      });
    }
    if (this._layerNodeArray.length === 0) {
      this._report({
        message: 'layer nodes not found.',
        docsHash: '#prepare-your-markup',
      });
    }
  }

  /** Reads per-layer classname configs from data attributes if provided. */
  private _readClassnamesFromMarkup(): void {
    this._layerNodeArray.forEach((layerNode) => {
      if (layerNode.dataset.immerserLayerConfig) {
        try {
          this._options.solidClassnamesByLayerId[layerNode.id] = JSON.parse(layerNode.dataset.immerserLayerConfig);
        } catch (error) {
          this._report({
            message: 'Failed to parse JSON classname configuration.',
            error,
            docsHash: '#options',
          });
        }
      }
    });
  }

  /** Ensures every layer has the explicit unique id required by the public contract. */
  private _validateLayerIds(): void {
    const layerIdSet = new Set<string>();
    this._layerNodeArray.forEach((layerNode, layerIndex) => {
      const { id } = layerNode;
      if (!id) {
        this._report({
          message: `layer id not found for layer at index ${layerIndex}.`,
          docsHash: '#prepare-your-markup',
        });
      }
      if (layerIdSet.has(id)) {
        this._report({
          message: `duplicate layer id "${id}".`,
          docsHash: '#prepare-your-markup',
        });
      }
      layerIdSet.add(id);
    });
  }

  /** Ensures classname configuration references only existing layer ids. */
  private _validateSolidClassnamesConfig(): void {
    const solidClassnamesByLayerId = this._options.solidClassnamesByLayerId;
    if (
      !solidClassnamesByLayerId ||
      typeof solidClassnamesByLayerId !== 'object' ||
      Array.isArray(solidClassnamesByLayerId)
    ) {
      this._report({
        message: 'solidClassnamesByLayerId must be an object',
        docsHash: '#options',
      });
      return;
    }

    const entries = Object.entries(solidClassnamesByLayerId);
    const hasInvalidEntry = entries.some(
      (entry) =>
        !entry[1] ||
        typeof entry[1] !== 'object' ||
        Array.isArray(entry[1]) ||
        Object.values(entry[1]).some((classname) => typeof classname !== 'string'),
    );
    if (hasInvalidEntry) {
      this._report({
        message: 'solidClassnamesByLayerId entries must map solid ids to classname strings',
        docsHash: '#options',
      });
      return;
    }

    const layerIdArray = this._layerNodeArray.map(({ id }) => id);
    const unknownLayerId = entries.map(([layerId]) => layerId).find((layerId) => !layerIdArray.includes(layerId));
    if (unknownLayerId) {
      this._report({
        message: `solidClassnamesByLayerId contains unknown layer id "${unknownLayerId}"`,
        docsHash: '#options',
      });
    }
  }

  /** Creates initial LayerState entries for every layer. */
  private _initLayerStateMap(): void {
    this._layerNodeArray.forEach((layerNode, order) => {
      this._addLayerState(layerNode.id, layerNode, order, this._options.solidClassnamesByLayerId[layerNode.id] ?? null);
    });
  }

  /** Adds one validated layer state to the registry. */
  private _addLayerState(
    id: string,
    layerNode: HTMLElement,
    order: number,
    solidClassnames: SolidClassnames | null = null,
  ): IDomLayerState {
    this._validateLayerStateInput(id, layerNode, order, solidClassnames);
    const layerState: IDomLayerState = {
      id,
      layerNode,
      maskInnerNode: null,
      maskNode: null,
      order,
      solidClassnames,
    };
    layerNode.id = id;
    this._layerStateById.set(id, layerState);
    return layerState;
  }

  /** Ensures dynamic layer input does not break id/order based runtime addressing. */
  private _validateLayerStateInput(
    id: string,
    layerNode: HTMLElement,
    order: number,
    solidClassnames: SolidClassnames | null,
  ): void {
    if (!id) {
      this._report({
        message: 'layer id must be a non-empty string.',
        docsHash: '#prepare-your-markup',
      });
    }
    if (!(layerNode instanceof HTMLElement)) {
      this._report({
        message: `layer node for layer "${id}" must be an HTMLElement.`,
        docsHash: '#prepare-your-markup',
      });
    }
    if (!Number.isInteger(order)) {
      this._report({
        message: `layer order for layer "${id}" must be an integer.`,
        docsHash: '#prepare-your-markup',
      });
    }
    if (this._layerStateById.has(id)) {
      this._report({
        message: `duplicate layer id "${id}".`,
        docsHash: '#prepare-your-markup',
      });
    }
    if (this._orderedLayerStateArray.some((state) => state.order === order)) {
      this._report({
        message: `duplicate layer order "${order}".`,
        docsHash: '#prepare-your-markup',
      });
    }
    this._validateSolidClassnames(id, solidClassnames);
  }

  /** Ensures one layer classname config maps solid ids to strings. */
  private _validateSolidClassnames(layerId: string, solidClassnames: SolidClassnames | null): void {
    if (solidClassnames === null) {
      return;
    }
    if (!solidClassnames || typeof solidClassnames !== 'object' || Array.isArray(solidClassnames)) {
      this._report({
        message: `solid classnames for layer "${layerId}" must be an object.`,
        docsHash: '#options',
      });
      return;
    }
    if (Object.values(solidClassnames).some((classname) => typeof classname !== 'string')) {
      this._report({
        message: `solid classnames for layer "${layerId}" must map solid ids to classname strings.`,
        docsHash: '#options',
      });
    }
  }

  /** Subscribes to window width changes to enable/disable runtime based on breakpoint. */
  private _toggleBindOnResizeObserver(): void {
    this._unsubscribeToggleBindOnResize = this._reactiveWindowWidth.subscribe((nextWindowWidth) => {
      if (nextWindowWidth >= this._options.fromViewportWidth) {
        if (!this._isBound) {
          this.enable();
        }
      } else if (this._isBound) {
        this.disable();
      }
    });
  }

  /** Applies runtime option changes without rebuilding generated markup. */
  public updateOptions(options: DomControllerOptions, previousOptions: DomControllerOptions): void {
    this._options = options;
    this._engine.updateOptions({ pagerThreshold: options.pagerThreshold });

    if (
      previousOptions.scrollAdjustDelay !== options.scrollAdjustDelay ||
      previousOptions.scrollAdjustThreshold !== options.scrollAdjustThreshold
    ) {
      this._clearScrollAdjustTimer();
    }

    if (!this._isMounted) {
      return;
    }

    if (previousOptions.isScrollHandled !== options.isScrollHandled) {
      options.isScrollHandled ? this._addScrollListener() : this._removeScrollListener();
    }
    if (previousOptions.fromViewportWidth !== options.fromViewportWidth) {
      this._setSizes();
    } else if (previousOptions.pagerThreshold !== options.pagerThreshold) {
      this.render();
    }
  }

  /** Recalculates sizes and thresholds for each layer and updates window width observable. */
  private _setSizes(): void {
    this._engine.setLayout({
      layers: this._orderedLayerStateArray.map(({ layerNode }) => ({
        bottom: layerNode.offsetTop + layerNode.offsetHeight,
        top: layerNode.offsetTop,
      })),
      rootHeight: (this._rootNode as HTMLElement).offsetHeight,
      rootTop: (this._rootNode as HTMLElement).offsetTop,
      viewportHeight: window.innerHeight,
    });

    this._reactiveWindowWidth.value = window.innerWidth;
  }

  /** Attaches scroll and resize listeners respecting isScrollHandled flag. */
  private _addScrollAndResizeListeners(): void {
    if (this._options.isScrollHandled) {
      this._addScrollListener();
    }
    this._onResize = this._handleResize.bind(this);
    window.addEventListener('resize', this._onResize, false);
    window.addEventListener('orientationchange', this._onResize, false);
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(this._onResize);
      this._resizeObserver.observe(this._rootNode);
    }
  }

  /** Attaches the scroll listener once when scroll handling is enabled. */
  private _addScrollListener(): void {
    if (this._onScroll) {
      return;
    }
    this._onScroll = this._handleScroll.bind(this);
    window.addEventListener('scroll', this._onScroll, false);
  }

  /** Clears internal caches, observables and references after destroy. */
  private _resetInternalState(): void {
    this._layerStateById.clear();
    this._isMounted = false;
    this._isBound = false;
    this._rootNode = null;
    this._layerNodeArray = [];
    this._pagerLinkNodeArray = [];
    this._synchroHoverNodeArray = [];
    this._synchroHoverSnapshots = [];
    this._markupController = null;
    this._engine.reset();
    this._resizeFrameId = null;
    this._resizeObserver = null;
    this._scrollFrameId = null;
    this._scrollAdjustTimerId = null;
    this._reactiveWindowWidth.reset();
    this._reactiveSynchroHoverId.reset();
    this._unsubscribeSynchroHover = null;
    this._unsubscribeToggleBindOnResize = null;
    this._onResize = null;
    this._onScroll = null;
    this._onSynchroHoverMouseOver = null;
    this._onSynchroHoverMouseOut = null;
  }

  /** Prepares markup from the current DOM structure. */
  private _prepareMarkup(): void {
    this._orderedLayerStateArray.forEach((layerState) => {
      this._setLayerState(this._markupController.prepareLayer(layerState));
    });
    this._syncCreatedMasksAria();
  }

  /** Restores markup according to controller-recorded ownership. */
  private _cleanupMarkup(): void {
    this._markupController.cleanup();
    this._orderedLayerStateArray.forEach((layerState) => {
      this._setLayerState({ ...layerState, maskInnerNode: null, maskNode: null });
    });
  }

  /** Writes an updated layer state into the id registry. */
  private _setLayerState(layerState: IDomLayerState): void {
    this._layerStateById.set(layerState.id, layerState);
  }

  /** Applies created mask aria-hidden according to current layer order. */
  private _syncCreatedMasksAria(): void {
    this._markupController.syncCreatedMasksAria(this._orderedLayerStateArray.map(({ id }) => id));
  }

  /** Collects pager links that will receive runtime active state. */
  private _initPagerLinks(): void {
    this._pagerLinkNodeArray = queryElementArray({ selector: this._selectors.pagerLink, parent: this._rootNode });
  }

  /** Sets up synchro hover listeners and reactive updates. */
  private _initHoverSynchro(): void {
    this._synchroHoverNodeArray = queryElementArray({ selector: this._selectors.synchroHover, parent: this._rootNode });
    this._synchroHoverSnapshots = this._synchroHoverNodeArray.map((node) => ({
      hadHoverClass: node.classList.contains('_hover'),
      node,
    }));

    this._onSynchroHoverMouseOver = (e: MouseEvent): void => {
      const target = e.currentTarget as HTMLElement;
      const synchroHoverId = target.dataset.immerserSynchroHover;
      this._reactiveSynchroHoverId.value = synchroHoverId;
    };

    this._onSynchroHoverMouseOut = (): void => {
      this._reactiveSynchroHoverId.value = null;
    };

    this._synchroHoverNodeArray.forEach((synchroHoverNode) => {
      synchroHoverNode.addEventListener('mouseover', this._onSynchroHoverMouseOver!);
      synchroHoverNode.addEventListener('mouseout', this._onSynchroHoverMouseOut!);
    });
  }

  /** Subscribes to synchronized hover updates. */
  private _attachCallbacks(): void {
    if (this._synchroHoverNodeArray.length > 0) {
      this._unsubscribeSynchroHover = this._reactiveSynchroHoverId.subscribe(this._drawSynchroHover.bind(this));
    }
  }

  /** Unsubscribes from synchronized hover updates. */
  private _detachCallbacks(): void {
    this._unsubscribeSynchroHover?.();
  }

  /** Removes hover listeners from synchro hover nodes. */
  private _removeSyncroHoverListeners(): void {
    this._synchroHoverNodeArray.forEach((synchroHoverNode) => {
      synchroHoverNode.removeEventListener('mouseover', this._onSynchroHoverMouseOver!);
      synchroHoverNode.removeEventListener('mouseout', this._onSynchroHoverMouseOut!);
    });
  }

  /** Clears runtime active state from pager links. */
  private _clearPagerLinks(): void {
    this._pagerLinkNodeArray.forEach((node) => {
      node.classList.remove(this._options.pagerLinkActiveClassname);
    });
  }

  /** Restores synchronized hover classes changed during the bound lifecycle. */
  private _restoreSynchroHoverClasses(): void {
    this._synchroHoverSnapshots.forEach(({ hadHoverClass, node }) => {
      node.classList.toggle('_hover', hadHoverClass);
    });
    this._synchroHoverSnapshots = [];
  }

  /** Removes browser listeners that outlive individual runtime cycles. */
  private _removeScrollAndResizeListeners(): void {
    this._removeScrollListener();
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize, false);
      window.removeEventListener('orientationchange', this._onResize, false);
    }
    this._resizeObserver?.disconnect();
  }

  /** Removes the scroll listener if it is attached. */
  private _removeScrollListener(): void {
    if (!this._onScroll) {
      return;
    }
    window.removeEventListener('scroll', this._onScroll, false);
    this._onScroll = null;
  }

  /** Cancels the pending scroll animation frame. */
  private _cancelScrollFrame(): void {
    if (this._scrollFrameId !== null) {
      window.cancelAnimationFrame(this._scrollFrameId);
      this._scrollFrameId = null;
    }
  }

  /** Cancels the pending resize animation frame. */
  private _cancelResizeFrame(): void {
    if (this._resizeFrameId !== null) {
      window.cancelAnimationFrame(this._resizeFrameId);
      this._resizeFrameId = null;
    }
  }

  /** Clears the pending scroll-adjust timer. */
  private _clearScrollAdjustTimer(): void {
    if (this._scrollAdjustTimerId !== null) {
      clearTimeout(this._scrollAdjustTimerId);
      this._scrollAdjustTimerId = null;
    }
  }

  /** Cancels deferred runtime work before bound markup is cleaned. */
  private _cancelScheduledRuntimeWork(): void {
    this._cancelScrollFrame();
    this._cancelResizeFrame();
    this._clearScrollAdjustTimer();
  }

  /**
   * Captures the active index before calculation replaces the engine's current snapshot.
   * Returning both values prevents callers from reading the new index as if it were the previous one.
   */
  private _calculateSnapshotTransition(scrollY?: number): ISnapshotTransition {
    const previousActiveIndex = this.activeIndex;
    const snapshot = this._engine.calculate(scrollY ?? getLastScrollPosition().y);
    return { previousActiveIndex, snapshot };
  }

  /** Applies transforms based on scroll position and updates active layer state. */
  private _draw(snapshot: IEngineSnapshot, previousActiveIndex: number): void {
    this._orderedLayerStateArray.forEach(({ maskNode, maskInnerNode }, layerIndex) => {
      if (!maskNode || !maskInnerNode) {
        return;
      }
      const transform = snapshot.transforms[layerIndex];
      maskNode.style.transform = `translateY(${transform.maskTranslateY}px)`;
      maskInnerNode.style.transform = `translateY(${transform.innerTranslateY}px)`;
    });

    if (!this._isBound || snapshot.activeIndex === previousActiveIndex) {
      return;
    }
    if (this._pagerLinkNodeArray.length > 0) {
      this._drawPagerLinks(snapshot.activeIndex);
    }
    if (this._options.hasToUpdateHash) {
      this._drawHash(snapshot.activeIndex);
    }
    this._callbacks.onActiveLayerChange(snapshot.activeIndex);
  }

  /** Adds or removes active pager classname according to current layer. */
  private _drawPagerLinks(layerIndex?: number): void {
    const layerId = layerIndex === undefined ? undefined : this._orderedLayerStateArray[layerIndex]?.id;
    this._pagerLinkNodeArray.forEach((pagerLinkNode) => {
      const hrefLayerId = (pagerLinkNode as HTMLAnchorElement).getAttribute('href')?.slice(1);
      if (hrefLayerId === layerId) {
        pagerLinkNode.classList.add(this._options.pagerLinkActiveClassname);
      } else {
        pagerLinkNode.classList.remove(this._options.pagerLinkActiveClassname);
      }
    });
  }

  /** Updates window hash to match active layer id. */
  private _drawHash(layerIndex: number): void {
    const layerState = this._orderedLayerStateArray[layerIndex];
    if (!layerState) {
      return;
    }
    const { id, layerNode } = layerState;
    layerNode.removeAttribute('id');
    window.location.hash = id;
    layerNode.setAttribute('id', id);
  }

  /** Syncs hover state across elements with matching synchroHover id. */
  private _drawSynchroHover(synchroHoverId?: string): void {
    this._synchroHoverNodeArray.forEach((synchroHoverNode) => {
      if (synchroHoverNode.dataset.immerserSynchroHover === synchroHoverId) {
        synchroHoverNode.classList.add('_hover');
      } else {
        synchroHoverNode.classList.remove('_hover');
      }
    });
  }

  /** Adjusts scroll to layer edges when near thresholds, improving alignment. */
  private _adjustScroll(): void {
    const { x, y } = getLastScrollPosition();
    const scrollTarget = this._engine.calculateScrollTarget(y, this._options.scrollAdjustThreshold);
    if (scrollTarget !== null) {
      window.scrollTo(x, scrollTarget);
    }
  }

  /** RAF-throttled scroll handler that draws and optionally snaps scroll. */
  private _handleScroll(): void {
    if (this._isBound) {
      this._cancelScrollFrame();
      this._scrollFrameId = window.requestAnimationFrame(() => {
        const y = getLastScrollPosition().y;
        const { previousActiveIndex, snapshot } = this._calculateSnapshotTransition(y);
        this._callbacks.onLayersUpdate([...snapshot.layerProgressArray]);
        this._draw(snapshot, previousActiveIndex);
        if (this._options.scrollAdjustThreshold > 0) {
          this._clearScrollAdjustTimer();
          this._scrollAdjustTimerId = setTimeout(this._adjustScroll.bind(this), this._options.scrollAdjustDelay);
        }
      });
    }
  }

  /** RAF-throttled resize handler that recalculates sizes and redraws. */
  private _handleResize(): void {
    this._cancelResizeFrame();
    this._resizeFrameId = window.requestAnimationFrame(() => {
      this.render();
    });
  }

  /**
   * Enables runtime behavior: prepares markup, attaches hover runtime and triggers first draw; also emits bind event.
   * Intended to be idempotent for toggling immerser on when viewport width allows.
   */
  public enable(): void {
    if (this._isBound) {
      return;
    }
    this._prepareMarkup();
    this._initPagerLinks();
    this._initHoverSynchro();
    this._attachCallbacks();
    this._isBound = true;
    const { previousActiveIndex, snapshot } = this._calculateSnapshotTransition();
    this._draw(snapshot, previousActiveIndex);
    this._callbacks.onBind();
  }

  /**
   * Disables runtime behavior: restores DOM, resets active layer and emits unbind event.
   * Safe to call multiple times; no-op when already disabled.
   */
  public disable(): void {
    if (!this._isBound) {
      return;
    }
    this._cancelScheduledRuntimeWork();
    this._detachCallbacks();
    this._removeSyncroHoverListeners();
    this._clearPagerLinks();
    this._restoreSynchroHoverClasses();
    this._cleanupMarkup();
    this._isBound = false;
    this._callbacks.onUnbind();
    this._engine.resetActiveIndex();
  }

  /**
   * Fully destroys immerser: disables runtime, removes mount-level listeners, runs destroy event and clears references.
   * Use when component is permanently removed.
   */
  public destroy(): void {
    this.disable();
    this._unsubscribeToggleBindOnResize?.();
    this._removeScrollAndResizeListeners();
    this._callbacks.onDestroy();
    this._resetInternalState();
  }

  /**
   * Manually recomputes sizes and redraws masks; call after DOM mutations that change layout.
   * Exposed for dynamic content updates without reinitializing immerser.
   *
   * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
   */
  public render(): void {
    this._setSizes();
    const { previousActiveIndex, snapshot } = this._calculateSnapshotTransition();
    this._draw(snapshot, previousActiveIndex);
  }

  /**
   * Syncs immerser with an externally controlled scroll position.
   * `isScrollHandled=false` option flag is required to call this method.
   * Call when using a custom scroll engine.
   *
   * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
   */
  public syncScroll(): void {
    if (this._options.isScrollHandled) {
      this._report({
        message: 'syncScroll requires the isScrollHandled flag set to false. Call ignored.',
        isWarning: true,
        docsHash: '#external-scroll-engine',
      });
      return;
    }
    const { previousActiveIndex, snapshot } = this._calculateSnapshotTransition();
    this._draw(snapshot, previousActiveIndex);
  }

  /** Adds one layer to the registry and prepares its runtime markup when enabled. */
  public addLayer(
    id: string,
    layerNode: HTMLElement,
    order: number,
    solidClassnames: SolidClassnames | null = null,
  ): void {
    const layerState = this._addLayerState(id, layerNode, order, solidClassnames);
    if (this._isBound) {
      this._setLayerState(this._markupController.prepareLayer(layerState));
      this._syncCreatedMasksAria();
      this._initPagerLinks();
      this.render();
      return;
    }
    this._setSizes();
  }

  /** Removes one layer and its owned runtime markup. */
  public removeLayer(id: string): void {
    if (!this._layerStateById.has(id)) {
      return;
    }
    if (this._isBound) {
      this._markupController.cleanupLayer(id);
    }
    this._layerStateById.delete(id);
    this._syncCreatedMasksAria();
    this._initPagerLinks();
    this.render();
  }

  /** Returns the active layer index from the latest engine snapshot. */
  public get activeIndex(): number {
    return this._engine.snapshot.activeIndex;
  }

  /** Indicates whether markup and runtime behavior are currently active. */
  public get isBound(): boolean {
    return this._isBound;
  }

  /** Indicates whether DOM discovery and mount-level listeners are active. */
  public get isMounted(): boolean {
    return this._isMounted;
  }

  /** Exposes the root element connected during initialization. */
  public get rootNode(): HTMLElement | null {
    return this._rootNode;
  }

  /** Returns per-layer progress values from the latest engine snapshot. */
  public get layerProgressArray(): readonly number[] {
    return this._engine.snapshot.layerProgressArray;
  }
}

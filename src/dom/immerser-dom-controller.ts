import Observable from '@dubaua/observable';
import ImmerserMarkupController from './immerser-markup-controller';
import { ImmerserSelectors } from './selectors';
import getLastScrollPosition from './utils/get-last-scroll-position';
import queryElementArray from './utils/query-element-array';
import validateSolidClassnameArray from '../validate-solid-classname-array';
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

type PagerLinkSnapshot = {
  hadActiveClass: boolean;
  layerIndex: string | null;
  node: HTMLElement;
};

type SynchroHoverSnapshot = {
  hadHoverClass: boolean;
  node: HTMLElement;
};

export default class ImmerserDomController {
  private readonly _callbacks: IImmerserDomControllerCallbacks;
  private readonly _engine: ImmerserEngine;
  private readonly _options: DomControllerOptions;
  private _selectors = ImmerserSelectors;
  private _layerStateArray: IDomLayerState[] = [];
  private _layerStateIndexById: Record<string, number> = {};
  private _isBound = false;
  private _rootNode: HTMLElement | null = null;
  private _layerNodeArray: HTMLElement[] = [];
  private _pagerLinkNodeArray: HTMLElement[] = [];
  private _pagerLinkSnapshots: PagerLinkSnapshot[] = [];
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
  public initialize(): void {
    this._setDomNodes();
    this._validateMarkup();
    this._readClassnamesFromMarkup();
    this._validateSolidClassnameArray();
    this._initSectionIds();
    this._initLayerStateArray();
    this._initMarkupController();
    this._toggleBindOnResizeObserver();
    this._setSizes();
    this._addScrollAndResizeListeners();
  }

  /** Creates the controller that derives markup ownership from the current DOM. */
  private _initMarkupController(): void {
    this._markupController = new ImmerserMarkupController({
      report: this._report.bind(this),
      rootNode: this._rootNode as HTMLElement,
      selectors: this._selectors,
    });
  }

  /** Routes DOM controller diagnostics through the configured reporting callback. */
  private _report(params: IReportParams): void {
    this._callbacks.report(params);
  }

  /** Collects root, layer and solid nodes from DOM. */
  private _setDomNodes(): void {
    this._rootNode = document.querySelector<HTMLElement>(this._selectors.root);
    this._layerNodeArray = queryElementArray({ selector: this._selectors.layer });
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
    this._layerNodeArray.forEach((layerNode, layerIndex) => {
      if (layerNode.dataset.immerserLayerConfig) {
        try {
          this._options.solidClassnameArray[layerIndex] = JSON.parse(layerNode.dataset.immerserLayerConfig);
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

  /** Ensures classname configuration length matches layers count. */
  private _validateSolidClassnameArray(): void {
    if (this._options.solidClassnameArray.length === 0) {
      return;
    }
    const validationResult = validateSolidClassnameArray(
      this._options.solidClassnameArray,
      this._layerNodeArray.length,
    );
    if (validationResult.isValid === false) {
      this._report({
        message: validationResult.message,
        docsHash: '#options',
      });
    }
  }

  /** Assigns ids to layers when missing and records their indexes. */
  private _initSectionIds(): void {
    this._layerNodeArray.forEach((layerNode, layerIndex) => {
      let id = layerNode.id;
      if (!id) {
        id = `immerser-section-${layerIndex}`;
        layerNode.id = id;
        (layerNode as any).__immerserCustomId = true;
      }
      this._layerStateIndexById[id] = layerIndex;
    });
  }

  /** Creates initial LayerState entries for every layer. */
  private _initLayerStateArray(): void {
    this._layerStateArray = this._layerNodeArray.map((layerNode, layerIndex) => {
      const solidClassnames = this._options.solidClassnameArray[layerIndex];
      const { id } = layerNode;
      return {
        id,
        maskInnerNode: null,
        maskNode: null,
        layerNode: layerNode,
        solidClassnames,
      } as IDomLayerState;
    });
  }

  /** Subscribes to window width changes to bind/unbind based on breakpoint. */
  private _toggleBindOnResizeObserver(): void {
    this._unsubscribeToggleBindOnResize = this._reactiveWindowWidth.subscribe((nextWindowWidth) => {
      if (nextWindowWidth >= this._options.fromViewportWidth) {
        if (!this._isBound) {
          this.bind();
        }
      } else if (this._isBound) {
        this.unbind();
      }
    });
  }

  /** Recalculates sizes and thresholds for each layer and updates window width observable. */
  private _setSizes(): void {
    this._engine.setLayout({
      layers: this._layerStateArray.map(({ layerNode }) => ({
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
      this._onScroll = this._handleScroll.bind(this);
      window.addEventListener('scroll', this._onScroll, false);
    }
    this._onResize = this._handleResize.bind(this);
    window.addEventListener('resize', this._onResize, false);
    window.addEventListener('orientationchange', this._onResize, false);
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(this._onResize);
      this._resizeObserver.observe(this._rootNode);
    }
  }

  /** Clears internal caches, observables and references after destroy. */
  private _resetInternalState(): void {
    this._layerStateArray = [];
    this._layerStateIndexById = {};
    this._isBound = false;
    this._rootNode = null;
    this._layerNodeArray = [];
    this._pagerLinkNodeArray = [];
    this._pagerLinkSnapshots = [];
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
    this._layerStateArray = this._markupController.prepare(this._layerStateArray);
  }

  /** Restores markup according to controller-recorded ownership. */
  private _cleanupMarkup(): void {
    this._markupController.cleanup();
  }

  /** Parses pager links and maps them to layer indexes using href hash. */
  private _initPagerLinks(): void {
    this._pagerLinkNodeArray = queryElementArray({ selector: this._selectors.pagerLink, parent: this._rootNode });
    this._pagerLinkSnapshots = this._pagerLinkNodeArray.map((node) => ({
      hadActiveClass: node.classList.contains(this._options.pagerLinkActiveClassname),
      layerIndex: node.getAttribute('data-immerser-layer-index'),
      node,
    }));
    this._pagerLinkNodeArray.forEach((pagerLinkNode) => {
      const { href } = pagerLinkNode as HTMLAnchorElement;
      if (href) {
        const layerId = href.split('#')[1];
        if (layerId) {
          const layerIndex = this._layerStateIndexById[layerId];
          pagerLinkNode.dataset.immerserLayerIndex = layerIndex.toString();
        }
      }
    });
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

  /** Restores pager attributes and classes changed during the bound lifecycle. */
  private _restorePagerLinks(): void {
    this._pagerLinkSnapshots.forEach(({ hadActiveClass, layerIndex, node }) => {
      node.classList.toggle(this._options.pagerLinkActiveClassname, hadActiveClass);
      if (layerIndex === null) {
        node.removeAttribute('data-immerser-layer-index');
      } else {
        node.setAttribute('data-immerser-layer-index', layerIndex);
      }
    });
    this._pagerLinkSnapshots = [];
  }

  /** Restores synchronized hover classes changed during the bound lifecycle. */
  private _restoreSynchroHoverClasses(): void {
    this._synchroHoverSnapshots.forEach(({ hadHoverClass, node }) => {
      node.classList.toggle('_hover', hadHoverClass);
    });
    this._synchroHoverSnapshots = [];
  }

  /** Drops autogenerated ids from layers on teardown. */
  private _clearCustomSectionIds(): void {
    this._layerStateArray.forEach((state) => {
      if ((state.layerNode as any).__immerserCustomId) {
        state.layerNode.removeAttribute('id');
      }
    });
  }

  /** Removes browser listeners that outlive individual bind cycles. */
  private _removeScrollAndResizeListeners(): void {
    if (this._options.isScrollHandled) {
      window.removeEventListener('scroll', this._onScroll!, false);
    }
    window.removeEventListener('resize', this._onResize!, false);
    window.removeEventListener('orientationchange', this._onResize!, false);
    this._resizeObserver?.disconnect();
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
    this._layerStateArray.forEach(({ maskNode, maskInnerNode }, layerIndex) => {
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
    this._pagerLinkNodeArray.forEach((pagerLinkNode) => {
      if (parseInt(pagerLinkNode.dataset.immerserLayerIndex, 10) === layerIndex) {
        pagerLinkNode.classList.add(this._options.pagerLinkActiveClassname);
      } else {
        pagerLinkNode.classList.remove(this._options.pagerLinkActiveClassname);
      }
    });
  }

  /** Updates window hash to match active layer id. */
  private _drawHash(layerIndex: number): void {
    const { id, layerNode } = this._layerStateArray[layerIndex];
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
   * Prepares markup, attaches listeners and triggers first draw; also emits bind event.
   * Intended to be idempotent for toggling immerser on when viewport width allows.
   */
  public bind(): void {
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
   * Tears down generated markup and listeners, restores DOM, resets active layer and emits unbind event.
   * Safe to call multiple times; no-op when already unbound.
   */
  public unbind(): void {
    if (!this._isBound) {
      return;
    }
    this._cancelScheduledRuntimeWork();
    this._detachCallbacks();
    this._removeSyncroHoverListeners();
    this._restorePagerLinks();
    this._restoreSynchroHoverClasses();
    this._clearCustomSectionIds();
    this._cleanupMarkup();
    this._isBound = false;
    this._callbacks.onUnbind();
    this._engine.resetActiveIndex();
  }

  /**
   * Fully destroys immerser: unbinds, removes window listeners, runs destroy event and clears all references.
   * Use when component is permanently removed.
   */
  public destroy(): void {
    this.unbind();
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

  /** Returns the active layer index from the latest engine snapshot. */
  public get activeIndex(): number {
    return this._engine.snapshot.activeIndex;
  }

  /** Indicates whether markup and bound runtime behavior are currently active. */
  public get isBound(): boolean {
    return this._isBound;
  }

  /** Exposes the root element connected during initialization. */
  public get rootNode(): HTMLElement {
    return this._rootNode;
  }

  /** Returns per-layer progress values from the latest engine snapshot. */
  public get layerProgressArray(): readonly number[] {
    return this._engine.snapshot.layerProgressArray;
  }
}

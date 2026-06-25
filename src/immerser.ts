import mergeOptions from '@dubaua/merge-options';
import Observable from '@dubaua/observable';
import calculateLayerStateArray from './utils/calculate-layer-state-array';
import calculateLayersRuntimeState from './utils/calculate-layers-runtime-state';
import calculateScrollTarget from './utils/calculate-scroll-target';
import { EventNames } from './events';
import { CroppedFullAbsoluteStyles, InteractiveStyles, NotInteractiveStyles } from './utils/styles';
import { ImmerserSelectors } from './utils/selectors';
import { InitialDebug, OptionConfig } from './options';
import { getOriginalHandler, wrapOnceHandler } from './utils/once-handler';
import assignInlineStyles from './utils/assign-inline-styles';
import getLastScrollPosition from './utils/get-last-scroll-position';
import queryElementArray from './utils/query-element-array';
import validateImmerserMarkup from './utils/validate-immerser-markup';
import type {
  ICalculationResult,
  ICalculationTransition,
  IClonedSolid,
  IImmerserLayerState,
  ILayerCalculation,
  IMaskMarkup,
  IReportParams,
} from './internal-types';
import type {
  ActiveLayerChangeHandler,
  BaseHandler,
  EventHandlers,
  EventName,
  HandlerArgs,
  HandlerByEventName,
  LayersUpdateHandler,
  Options,
  RuntimeOptions,
  SolidClassnames,
  SolidClassnamesByLayerId,
} from './types';

const MessagePrefix = '[immerser]:';
const RuntimeOptionNames: (keyof RuntimeOptions)[] = [
  'debug',
  'fromViewportWidth',
  'hasToUpdateHash',
  'pagerThreshold',
  'scrollAdjustDelay',
  'scrollAdjustThreshold',
];

/** @public Main Immerser controller orchestrating markup cloning and scroll-driven transitions. */
export default class Immerser {
  private _options!: Options;
  private _selectors = ImmerserSelectors;
  private _userOptions: Partial<Options> = {};
  private _layerStateArray: IImmerserLayerState[] = [];
  private _isMounted = false;
  private _rootNode: HTMLElement | null = null;
  private _selectorRoot: ParentNode = document;
  private _layerNodeArray: HTMLElement[] = [];
  private _maskNodeArray: HTMLElement[] = [];
  private _pagerLinkNodeArray: HTMLElement[] = [];
  private _originalSolidNodeArray: HTMLElement[] = [];
  private _clonedSolidArray: IClonedSolid[] = [];
  private _preparedMaskMarkupArray: IMaskMarkup[] = [];
  private _solidNodeArray: HTMLElement[] = [];
  private _synchroHoverNodeArray: HTMLElement[] = [];
  private _activeIndex = -1;
  private _rootHeight = 0;
  private _viewportHeight = 0;
  private _resizeObserver: ResizeObserver | null = null;
  private _flushFrameId: number | null = null;
  private _scrollAdjustTimerId: ReturnType<typeof setTimeout> | null = null;
  private _reactiveSynchroHoverId = new Observable<string | null>(null);
  private _unsubscribeSynchroHover: (() => void) | null = null;
  private _handlers: Record<EventName, Set<HandlerByEventName[EventName]>> = {
    init: new Set(),
    mount: new Set(),
    unmount: new Set(),
    destroy: new Set(),
    activeLayerChange: new Set(),
    layersUpdate: new Set(),
    // layerProgressChange
    // structureChange
  };
  private _onResize: (() => void) | null = null;
  private _onScroll: (() => void) | null = null;
  private _onSynchroHoverMouseOver: ((e: MouseEvent) => void) | null = null;
  private _onSynchroHoverMouseOut: (() => void) | null = null;
  private _isLayoutSet = false;
  private _layerProgressArray: number[] = [];
  private _structureSignature = '';
  private _layoutSignature = '';
  private _drawSignature = '';
  private _pendingSync = {
    structure: false,
    layout: false,
    draw: false,
  };

  /** Enables warnings/errors reporting. Defaults to NODE_ENV===development. */
  public debug = InitialDebug;

  /**
   * Creates immerser instance and runs DOM setup unless autoMount is disabled.
   * @param userOptions - overrides for defaults defined in OptionConfig if pass validation
   */
  constructor(userOptions?: Partial<Options>) {
    this._init(userOptions);
  }

  private _init(userOptions?: Partial<Options>): void {
    this._userOptions = userOptions ?? {};
    const options = this._mergeOptions(this._userOptions);
    this._options = options;
    this._selectorRoot = options.selectorRoot ?? document;
    this.debug = options.debug;
    this._registerHandlersFromOptions();
    this._addResizeListener();

    if (options.autoMount) {
      this.mount();
    }

    this._emit('init', this);
  }

  /** Saves event handlers passed via options into internal registry. */
  private _registerHandlersFromOptions(): void {
    if (!this._options.on) {
      return;
    }
    EventNames.forEach((eventName) => {
      const handler = !this._options.on[eventName];
      if (typeof handler === 'function') {
        this.on(eventName, handler);
      }
    });
  }

  /** Executes registered event handlers with provided arguments. */
  private _emit<K extends EventName>(eventName: K, ...args: HandlerArgs<K>): void {
    const handlerSet = this._handlers[eventName];
    handlerSet.forEach((handler: HandlerByEventName[K]) => {
      try {
        handler.apply(undefined, args);
      } catch (error) {
        this._report({
          message: `handler for ${eventName} event failed`,
          error,
          docsHash: '#events',
        });
      }
    });
  }

  private _report({ message, error, isWarning = false, docsHash = '' }: IReportParams): void {
    const resultMessage = `${MessagePrefix} ${message} \nCheck out documentation https://github.com/dubaua/immerser${docsHash}`;

    if (isWarning) {
      if (!this.debug) {
        return;
      }

      error !== undefined ? console.warn(resultMessage, error) : console.warn(resultMessage);

      return;
    }

    throw new Error(resultMessage, { cause: error });
  }

  /** DOC ME  */
  private _syncStructure(): void {
    this._rootNode = this._selectorRoot.querySelector<HTMLElement>(this._selectors.root);
    this._layerNodeArray = queryElementArray({ selector: this._selectors.layer, parent: this._selectorRoot });
    this._maskNodeArray = queryElementArray({ selector: this._selectors.mask, parent: this._rootNode });

    this._validateMarkup();

    const previousLayerStateById = new Map(this._layerStateArray.map((layerState) => [layerState.id, layerState]));

    this._layerStateArray = this._layerNodeArray.map((layerNode, order) => {
      const previousLayerState = previousLayerStateById.get(layerNode.id);

      return {
        calculation: previousLayerState?.calculation ?? null,
        id: layerNode.id,
        layerNode,
        maskInnerNode: previousLayerState?.maskInnerNode ?? null,
        maskNode: previousLayerState?.maskNode ?? null,
        order,
        solidClassnames: this._options.solidClassnamesByLayerId[layerNode.id] ?? null,
      };
    });

    this._structureSignature = this._createLayerSignature(this._layerNodeArray);
  }

  /** Validates required markup and option references. */
  private _validateMarkup(): void {
    const messageArray = validateImmerserMarkup({
      layerNodeArray: this._layerNodeArray,
      maskInnerSelector: this._selectors.maskInner,
      maskNodeArray: this._maskNodeArray,
      rootNode: this._rootNode,
      solidClassnamesByLayerId: this._options.solidClassnamesByLayerId,
    });

    if (messageArray.length > 0) {
      messageArray.forEach((message) => {
        this._report({
          message,
          docsHash: '#prepare-your-markup',
        });
      });
    }
  }

  /** Merges user options with defaults and attaches helper metadata to messages. */
  private _mergeOptions(userOptions?: Partial<Options>): Options {
    return mergeOptions({
      optionConfig: OptionConfig,
      userOptions,
      prefix: MessagePrefix,
      suffix: '\nCheck out documentation https://github.com/dubaua/immerser#options',
      strict: false,
    });
  }

  private _createLayerSignature(layerNodeArray: HTMLElement[]): string {
    return layerNodeArray.map((layerNode) => layerNode.id).join('|');
  }

  private _getLayerSignature(): string {
    const layerNodeArray = queryElementArray({ selector: this._selectors.layer, parent: this._selectorRoot });
    return this._createLayerSignature(layerNodeArray);
  }

  private _shouldMount(): boolean {
    return window.innerWidth >= this._options.fromViewportWidth;
  }

  /** Recalculates sizes and thresholds for each layer. */
  private _setSizes(): void {
    const rootNode = this._rootNode as HTMLElement;
    const layers = this._layerStateArray.map(({ layerNode }) => ({
      bottom: layerNode.offsetTop + layerNode.offsetHeight,
      top: layerNode.offsetTop,
    }));
    this._isLayoutSet = true;
    this._rootHeight = rootNode.offsetHeight;
    this._viewportHeight = window.innerHeight;
    const layerCalculationArray = calculateLayerStateArray({
      layers,
      rootHeight: this._rootHeight,
      rootTop: rootNode.offsetTop,
    });
    this._layerStateArray = this._layerStateArray.map((layerState, layerIndex) => ({
      ...layerState,
      calculation: layerCalculationArray[layerIndex],
    }));
    if (this._layerProgressArray.length === 0) {
      this._layerProgressArray = layers.map(() => 0);
    }

    this._layoutSignature = this._createLayoutSignature();
    this._drawSignature = ''; // TODO check if need here.
  }

  private _createLayoutSignature(): string {
    const rootNode = this._rootNode as HTMLElement;

    return [
      window.innerHeight,
      rootNode.offsetHeight,
      ...this._layerStateArray.map(({ layerNode }) => layerNode.offsetHeight),
    ].join('|');
  }

  private _addResizeListener(): void {
    if (!this._onResize) {
      this._onResize = this._handleResize.bind(this);
      window.addEventListener('resize', this._onResize, false);
      window.addEventListener('orientationchange', this._onResize, false);
    }
  }

  /** Attaches runtime listeners respecting isScrollHandled flag. */
  private _addMountedListeners(): void {
    if (!this._options.hasExternalScroll && !this._onScroll) {
      this._onScroll = this._handleScroll.bind(this);
      window.addEventListener('scroll', this._onScroll, false);
    }
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(this._onResize);
      this._resizeObserver.observe(this._rootNode);
    }
  }

  /** Clears internal caches, observables and references after destroy. */
  private _resetInternalState(): void {
    this._layerStateArray = [];
    this._isMounted = false;
    this._rootNode = null;
    this._selectorRoot = document;
    this._layerNodeArray = [];
    this._maskNodeArray = [];
    this._pagerLinkNodeArray = [];
    this._synchroHoverNodeArray = [];
    this._resizeObserver = null;
    this._flushFrameId = null;
    this._scrollAdjustTimerId = null;
    this._reactiveSynchroHoverId.reset();
    this._unsubscribeSynchroHover = null;
    this._onResize = null;
    this._onScroll = null;
    this._onSynchroHoverMouseOver = null;
    this._onSynchroHoverMouseOut = null;
    this._originalSolidNodeArray = [];
    this._clonedSolidArray = [];
    this._preparedMaskMarkupArray = [];
    this._solidNodeArray = [];
    this._structureSignature = '';
    this._layoutSignature = '';
    this._drawSignature = '';
    this._pendingSync.structure = false;
    this._pendingSync.layout = false;
    this._pendingSync.draw = false;
    this._reset();
  }

  /** Prepares markup from the current DOM structure. */
  private _prepareMarkup(): void {
    if (!this._options.hasExternalRenderer) {
      return;
    }
    if (this._preparedMaskMarkupArray.length > 0) {
      this._cleanupMarkup();
    }

    const layerStateArray = this._layerStateArray;
    const maskMarkupArray = this._resolveMaskMarkup(layerStateArray);
    const nextLayerStateArray = this._connectLayerStates(layerStateArray, maskMarkupArray);
    const originalSolidNodeArray = this._findSourceSolids(maskMarkupArray);
    const clonedSolidArray = this._cloneSolids(nextLayerStateArray, originalSolidNodeArray);
    const solidNodeArray = this._collectSolidNodes(maskMarkupArray, clonedSolidArray);

    this._reportEmptyMarkup(originalSolidNodeArray, maskMarkupArray);
    this._applyTechnicalStyles(maskMarkupArray, solidNodeArray);
    this._commitNodes(maskMarkupArray, clonedSolidArray);
    this._applyCreatedMasksAria(maskMarkupArray);
    this._savePreparedMarkupState(maskMarkupArray, clonedSolidArray, originalSolidNodeArray, solidNodeArray);
    this._detachOriginalSolids(originalSolidNodeArray);
  }

  /** Restores markup according to controller-recorded ownership. */
  private _cleanupMarkup(): void {
    if (!this._options.hasExternalRenderer) {
      return;
    }
    this._removeClonedSolids();
    this._restoreOriginalSolids();
    this._clearTechnicalStyles();
    this._removeCreatedMasks();
    this._resetMarkupState();
    this._layerStateArray = this._layerStateArray.map((layerState) => ({
      ...layerState,
      maskInnerNode: null,
      maskNode: null,
    }));
  }

  /** Collects pager links that will receive runtime active state. */
  private _initPagerLinks(): void {
    this._pagerLinkNodeArray = queryElementArray({ selector: this._selectors.pagerLink, parent: this._rootNode });
  }

  /** Sets up synchro hover listeners and reactive updates. */
  private _initHoverSynchro(): void {
    this._synchroHoverNodeArray = queryElementArray({ selector: this._selectors.synchroHover, parent: this._rootNode });

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

  private _removeResizeListener(): void {
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize, false);
      window.removeEventListener('orientationchange', this._onResize, false);
      this._onResize = null;
    }
  }

  /** Removes runtime listeners while keeping breakpoint resize handling alive. */
  private _removeMountedListeners(): void {
    if (!this._options.hasExternalScroll && this._onScroll) {
      window.removeEventListener('scroll', this._onScroll, false);
      this._onScroll = null;
    }
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }

  private _cancelFlushFrame(): void {
    if (this._flushFrameId !== null) {
      window.cancelAnimationFrame(this._flushFrameId);
      this._flushFrameId = null;
    }
  }

  /** Clears the pending scroll-adjust timer. */
  private _clearScrollAdjustTimer(): void {
    if (this._scrollAdjustTimerId !== null) {
      clearTimeout(this._scrollAdjustTimerId);
      this._scrollAdjustTimerId = null;
    }
  }

  /** Cancels deferred runtime work before mounted markup is cleaned. */
  private _cancelScheduledRuntimeWork(): void {
    this._cancelFlushFrame();
    this._clearScrollAdjustTimer();
    this._pendingSync.structure = false;
    this._pendingSync.layout = false;
    this._pendingSync.draw = false;
  }

  private _invalidateStructure(): void {
    if (!this.isMounted || this._pendingSync.structure) {
      return;
    }

    const nextLayerSignature = this._getLayerSignature();

    if (nextLayerSignature === this._structureSignature) {
      this._invalidateLayout();
      return;
    }

    this._pendingSync.structure = true;
    this._pendingSync.layout = true;
    this._pendingSync.draw = true;
    this._scheduleFlush();
  }

  private _invalidateLayout(): void {
    if (!this.isMounted || this._pendingSync.layout) {
      return;
    }

    const nextLayoutSignature = this._createLayoutSignature();

    if (nextLayoutSignature === this._layoutSignature) {
      this._invalidateDraw();
      return;
    }

    this._pendingSync.layout = true;
    this._pendingSync.draw = true;
    this._scheduleFlush();
  }

  private _invalidateDraw(): void {
    if (!this.isMounted) {
      return;
    }

    this._pendingSync.draw = true;
    this._scheduleFlush();
  }

  private _scheduleFlush(): void {
    if (this._flushFrameId !== null) {
      return;
    }

    this._flushFrameId = window.requestAnimationFrame(() => {
      this._flushFrameId = null;
      this._flush();
    });
  }

  private _flush(): void {
    if (!this.isMounted) {
      return;
    }

    if (this._pendingSync.structure) {
      this._pendingSync.structure = false;
      this._syncStructure();
    }

    if (this._pendingSync.layout) {
      this._pendingSync.layout = false;
      this._setSizes();
    }

    if (this._pendingSync.draw) {
      this._pendingSync.draw = false;
      this._drawCurrentState();
    }
  }

  private _drawCurrentState(): void {
    if (!this._isLayoutSet) {
      return;
    }

    const { previousActiveIndex, calculation } = this._calculateTransition();
    const nextDrawSignature = this._createDrawSignature(calculation.activeIndex, calculation.layerProgressArray);

    if (nextDrawSignature === this._drawSignature) {
      return;
    }

    this._drawSignature = nextDrawSignature;
    this._emit('layersUpdate', [...calculation.layerProgressArray], this);
    this._draw(calculation, previousActiveIndex);
  }

  /**
   * Captures the active index before calculation replaces the current active index.
   * Returning both values prevents callers from reading the new index as if it were the previous one.
   */
  private _calculateTransition(scrollY?: number): ICalculationTransition {
    const previousActiveIndex = this.activeIndex;
    const calculation = this._calculate(scrollY ?? getLastScrollPosition().y);
    return { previousActiveIndex, calculation };
  }

  private _getLayerCalculationArray(): ILayerCalculation[] {
    return this._layerStateArray.map(({ calculation }) => {
      if (!calculation) {
        throw new Error('Immerser layout is not set.');
      }
      return calculation;
    });
  }

  private _calculate(scrollY: number): ICalculationResult {
    if (!this._isLayoutSet) {
      throw new Error('Immerser layout is not set.');
    }

    const calculation = calculateLayersRuntimeState({
      layerCalculationArray: this._getLayerCalculationArray(),
      pagerThreshold: this._options.pagerThreshold,
      previousActiveIndex: this._activeIndex,
      rootHeight: this._rootHeight,
      scrollY,
      viewportHeight: this._viewportHeight,
    });

    this._activeIndex = calculation.activeIndex;
    this._layerProgressArray = [...calculation.layerProgressArray];

    return calculation;
  }

  private _createDrawSignature(activeIndex: number, layerProgressArray: readonly number[]): string {
    return `${activeIndex}:${[layerProgressArray].join('|')}`;
  }

  /** Applies transforms based on scroll position and updates active layer state. */
  private _draw(calculation: ICalculationResult, previousActiveIndex: number): void {
    this._layerStateArray.forEach(({ maskNode, maskInnerNode }, layerIndex) => {
      if (!maskNode || !maskInnerNode) {
        return;
      }
      const transform = calculation.transforms[layerIndex];
      maskNode.style.transform = `translateY(${transform.maskTranslateY}px)`;
      maskInnerNode.style.transform = `translateY(${transform.innerTranslateY}px)`;
    });

    if (!this._isMounted || calculation.activeIndex === previousActiveIndex) {
      return;
    }
    if (this._pagerLinkNodeArray.length > 0) {
      this._drawPagerLinks(calculation.activeIndex);
    }
    if (this._options.hasToUpdateHash) {
      this._drawHash(calculation.activeIndex);
    }
    this._emit('activeLayerChange', calculation.activeIndex, this);
  }

  /** Adds or removes active pager classname according to current layer. */
  private _drawPagerLinks(layerIndex?: number): void {
    const layerId = layerIndex === undefined ? undefined : this._layerStateArray[layerIndex]?.id;
    this._pagerLinkNodeArray.forEach((pagerLinkNode) => {
      const href = (pagerLinkNode as HTMLAnchorElement).getAttribute('href');

      pagerLinkNode.classList.toggle(
        this._options.pagerLinkActiveClassname,
        Boolean(layerId && href?.endsWith(`#${layerId}`)),
      );
    });
  }

  /** Updates window hash to match active layer id. */
  private _drawHash(layerIndex: number): void {
    const layerState = this._layerStateArray[layerIndex];
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
    const scrollTarget = this._calculateScrollTarget(y, this._options.scrollAdjustThreshold);
    if (scrollTarget !== null) {
      window.scrollTo(x, scrollTarget);
    }
  }

  private _calculateScrollTarget(scrollY: number, scrollAdjustThreshold: number): number | null {
    if (!this._isLayoutSet) {
      throw new Error('Immerser layout is not set.');
    }

    const activeLayer = this._layerStateArray[this._activeIndex]?.calculation;
    if (!activeLayer) {
      return null;
    }

    return calculateScrollTarget({
      activeLayer,
      scrollAdjustThreshold,
      scrollY,
      viewportHeight: this._viewportHeight,
    });
  }

  /** Invalidates draw on scroll and optionally schedules scroll snapping. */
  private _handleScroll(): void {
    if (!this._isMounted) {
      return;
    }

    this._invalidateDraw();

    if (this._options.scrollAdjustThreshold > 0) {
      this._clearScrollAdjustTimer();
      this._scrollAdjustTimerId = setTimeout(this._adjustScroll.bind(this), this._options.scrollAdjustDelay);
    }
  }

  /** Invalidates layout on resize-like changes and toggles mount state by breakpoint. */
  private _handleResize(): void {
    if (!this._shouldMount()) {
      this.unmount();
      return;
    }
    if (!this._isMounted) {
      this.mount();
      return;
    }
    this._invalidateLayout();
  }

  /** Keeps updateOptions scoped to runtime fields even when called from plain JavaScript. */
  private _pickRuntimeOptions(userOptions: Partial<Options>): Partial<RuntimeOptions> {
    return RuntimeOptionNames.reduce<Partial<RuntimeOptions>>((result, optionName) => {
      if (optionName in userOptions) {
        result[optionName] = userOptions[optionName] as never;
      }
      return result;
    }, {});
  }

  /** Uses complete existing masks by layer id or creates a detached mask set when none exists. */
  private _resolveMaskMarkup(layerStateArray: IImmerserLayerState[]): IMaskMarkup[] {
    const existingMaskNodeArray = queryElementArray({ selector: this._selectors.mask, parent: this._rootNode });
    if (existingMaskNodeArray.length === 0) {
      return layerStateArray.map(({ id }) => this._createMaskMarkup(id));
    }
    if (existingMaskNodeArray.length !== layerStateArray.length) {
      const message = 'existing markup mask count differs from count of layers.';
      this._report({ message, docsHash: '#prepare-your-markup' });
      throw new Error(message);
    }

    return layerStateArray.map(({ id }) => {
      const maskNodeArray = existingMaskNodeArray.filter((maskNode) => maskNode.dataset.immerserLayerId === id);
      if (maskNodeArray.length > 1) {
        const message = `existing markup has duplicate mask layer id "${id}".`;
        this._report({ message, docsHash: '#prepare-your-markup' });
        throw new Error(message);
      }
      const maskNode = maskNodeArray[0];
      if (!maskNode) {
        const message = `existing markup mask not found for layer id "${id}".`;
        this._report({ message, docsHash: '#prepare-your-markup' });
        throw new Error(message);
      }
      return this._connectMaskMarkup(maskNode, id);
    });
  }

  /** Creates one detached mask and its required inner node. */
  private _createMaskMarkup(layerId: string): IMaskMarkup {
    const maskNode = document.createElement('div');
    const maskInnerNode = document.createElement('div');
    maskNode.dataset.immerserMask = '';
    maskNode.dataset.immerserLayerId = layerId;
    maskInnerNode.dataset.immerserMaskInner = '';
    maskNode.appendChild(maskInnerNode);
    return { createdMask: true, maskInnerNode, maskNode };
  }

  /** Validates and connects the inner node belonging to an existing mask. */
  private _connectMaskMarkup(maskNode: HTMLElement, layerId: string): IMaskMarkup {
    const maskInnerNode = maskNode.querySelector<HTMLElement>(this._selectors.maskInner);
    if (!maskInnerNode) {
      const message = `existing markup mask-inner not found for layer id "${layerId}".`;
      this._report({ message, docsHash: '#prepare-your-markup' });
      throw new Error(message);
    }
    return { createdMask: false, maskInnerNode, maskNode };
  }

  /** Associates each layer state with its corresponding validated mask pair. */
  private _connectLayerStates(
    layerStateArray: IImmerserLayerState[],
    maskMarkupArray: IMaskMarkup[],
  ): IImmerserLayerState[] {
    const nextLayerStateArray = layerStateArray.map((layerState, layerIndex) => ({
      ...layerState,
      maskInnerNode: maskMarkupArray[layerIndex].maskInnerNode,
      maskNode: maskMarkupArray[layerIndex].maskNode,
    }));
    this._layerStateArray = nextLayerStateArray;
    return nextLayerStateArray;
  }

  /** Finds source solids while excluding client-owned content already placed inside masks. */
  private _findSourceSolids(maskMarkupArray: IMaskMarkup[]): HTMLElement[] {
    return queryElementArray({ selector: this._selectors.solid, parent: this._rootNode }).filter(
      (solidNode) => !maskMarkupArray.some(({ maskNode }) => maskNode.contains(solidNode)),
    );
  }

  /** Builds configured clones and records the inner node that will receive each clone. */
  private _cloneSolids(layerStateArray: IImmerserLayerState[], originalSolidNodeArray: HTMLElement[]): IClonedSolid[] {
    return layerStateArray.reduce<IClonedSolid[]>((result, { maskInnerNode, solidClassnames }) => {
      originalSolidNodeArray.forEach((originalSolidNode) => {
        const clonedSolidNode = originalSolidNode.cloneNode(true);
        if (clonedSolidNode instanceof HTMLElement && maskInnerNode) {
          const solidId = clonedSolidNode.dataset.immerserSolid;
          const classname = solidId ? solidClassnames?.[solidId] : undefined;
          if (classname) {
            clonedSolidNode.classList.add(classname);
          }
          result.push({ maskInnerNode, node: clonedSolidNode });
        }
      });
      return result;
    }, []);
  }

  /** Collects existing and cloned solids that require interactive technical styles. */
  private _collectSolidNodes(maskMarkupArray: IMaskMarkup[], clonedSolidArray: IClonedSolid[]): HTMLElement[] {
    const existingSolidNodeArray = maskMarkupArray.flatMap(({ maskInnerNode }) =>
      queryElementArray({ selector: this._selectors.solid, parent: maskInnerNode }),
    );
    return [...existingSolidNodeArray, ...clonedSolidArray.map(({ node }) => node)];
  }

  /** Warns when neither source solids nor existing mask content can produce a visual result. */
  private _reportEmptyMarkup(originalSolidNodeArray: HTMLElement[], maskMarkupArray: IMaskMarkup[]): void {
    if (
      originalSolidNodeArray.length === 0 &&
      maskMarkupArray.every(({ maskInnerNode }) => maskInnerNode.children.length === 0)
    ) {
      this._report({
        message: 'immerser will do nothing without source solids or existing mask content.',
        docsHash: '#prepare-your-markup',
        isWarning: true,
      });
    }
  }

  /** Replaces inline styles on controller-managed runtime nodes with technical styles. */
  private _applyTechnicalStyles(maskMarkupArray: IMaskMarkup[], solidNodeArray: HTMLElement[]): void {
    this._setTechnicalStyles(this._rootNode as HTMLElement, NotInteractiveStyles);
    maskMarkupArray.forEach(({ maskInnerNode, maskNode }) => {
      this._setTechnicalStyles(maskNode, { ...CroppedFullAbsoluteStyles, transform: '' });
      this._setTechnicalStyles(maskInnerNode, { ...CroppedFullAbsoluteStyles, transform: '' });
    });
    solidNodeArray.forEach((node) => {
      this._setTechnicalStyles(node, InteractiveStyles);
    });
  }

  /** Drops client inline styles before assigning the complete technical style set. */
  private _setTechnicalStyles(node: HTMLElement, styles: Record<string, string>): void {
    node.removeAttribute('style');
    assignInlineStyles(node, styles);
  }

  /** Inserts staged clones and appends controller-created masks to the live root. */
  private _commitNodes(maskMarkupArray: IMaskMarkup[], clonedSolidArray: IClonedSolid[]): void {
    clonedSolidArray.forEach(({ maskInnerNode, node }) => {
      maskInnerNode.appendChild(node);
    });
    maskMarkupArray
      .filter(({ createdMask }) => createdMask)
      .forEach(({ maskNode }) => (this._rootNode as HTMLElement).appendChild(maskNode));
  }

  /** Hides duplicate content only on masks created by this instance. */
  private _applyCreatedMasksAria(maskMarkupArray: IMaskMarkup[]): void {
    maskMarkupArray
      .filter(({ createdMask }) => createdMask)
      .forEach(({ maskNode }, maskIndex) => {
        if (maskIndex !== 0) {
          maskNode.setAttribute('aria-hidden', 'true');
        }
      });
  }

  /** Stores references required to clean the committed markup lifecycle. */
  private _savePreparedMarkupState(
    maskMarkupArray: IMaskMarkup[],
    clonedSolidArray: IClonedSolid[],
    originalSolidNodeArray: HTMLElement[],
    solidNodeArray: HTMLElement[],
  ): void {
    this._clonedSolidArray = clonedSolidArray;
    this._preparedMaskMarkupArray = maskMarkupArray;
    this._originalSolidNodeArray = originalSolidNodeArray;
    this._solidNodeArray = solidNodeArray;
  }

  /** Detaches source solids after every clone and mask has been committed successfully. */
  private _detachOriginalSolids(originalSolidNodeArray: HTMLElement[]): void {
    originalSolidNodeArray.forEach((solidNode) => solidNode.remove());
  }

  /** Removes every clone owned by this instance without touching existing mask content. */
  private _removeClonedSolids(): void {
    this._clonedSolidArray.forEach(({ node }) => node.remove());
  }

  /** Returns detached source solids to the root in their original relative order. */
  private _restoreOriginalSolids(): void {
    this._originalSolidNodeArray.forEach((solidNode) => (this._rootNode as HTMLElement).appendChild(solidNode));
  }

  /** Clears technical styles from the root and client-owned existing masks. */
  private _clearTechnicalStyles(): void {
    (this._rootNode as HTMLElement).removeAttribute('style');
    this._preparedMaskMarkupArray.forEach(({ createdMask, maskInnerNode, maskNode }) => {
      if (!createdMask) {
        maskNode.removeAttribute('style');
        maskInnerNode.removeAttribute('style');
      }
    });
    this._solidNodeArray.forEach((node) => node.removeAttribute('style'));
  }

  /** Removes only masks that were created by this instance. */
  private _removeCreatedMasks(): void {
    this._preparedMaskMarkupArray.filter(({ createdMask }) => createdMask).forEach(({ maskNode }) => maskNode.remove());
  }

  /** Clears committed ownership references after cleanup completes. */
  private _resetMarkupState(): void {
    this._originalSolidNodeArray = [];
    this._clonedSolidArray = [];
    this._preparedMaskMarkupArray = [];
    this._solidNodeArray = [];
  }

  private _resetActiveIndex(): void {
    this._activeIndex = -1;
  }

  private _reset(): void {
    this._isLayoutSet = false;
    this._rootHeight = 0;
    this._viewportHeight = 0;
    this._activeIndex = -1;
    this._layerProgressArray = [];
  }

  /** Discovers DOM state, validates configuration and starts runtime when breakpoint allows it. */
  public mount(): void {
    if (this._isMounted || !this._shouldMount()) {
      return;
    }
    this._syncStructure();
    this._prepareMarkup();
    this._setSizes();
    this._initPagerLinks();
    this._initHoverSynchro();
    this._attachCallbacks();
    this._addMountedListeners();
    this._isMounted = true;
    this._drawCurrentState();
    this._emit('mount', this);
  }

  /**
   * Stops runtime behavior while keeping resize handling active for breakpoint remount.
   * Safe to call multiple times; no-op when already unmounted.
   */
  public unmount(): void {
    if (!this._isMounted) {
      return;
    }
    this._cancelScheduledRuntimeWork();
    this._detachCallbacks();
    this._removeSyncroHoverListeners();
    this._clearPagerLinks();
    this._removeMountedListeners();
    this._cleanupMarkup();
    this._isMounted = false;
    this._emit('unmount', this);
    this._reset();
  }

  /** Updates runtime options and applies minimal side effects without remounting the instance. */
  public updateOptions(userOptions: Partial<RuntimeOptions>): void {
    const previousOptions = this._options;
    const runtimeOptions = this._pickRuntimeOptions(userOptions as Partial<Options>);
    this._userOptions = { ...this._userOptions, ...runtimeOptions };
    const options = this._mergeOptions(this._userOptions);
    this._options = options;
    this.debug = options.debug;

    if (
      previousOptions.scrollAdjustDelay !== options.scrollAdjustDelay ||
      previousOptions.scrollAdjustThreshold !== options.scrollAdjustThreshold
    ) {
      this._clearScrollAdjustTimer();
    }

    if (previousOptions.fromViewportWidth !== options.fromViewportWidth) {
      if (this._isMounted || this._onResize) {
        this._handleResize();
      }
    } else if (previousOptions.pagerThreshold !== options.pagerThreshold) {
      this._invalidateDraw();
    }
  }

  /**
   * Fully destroys immerser: unmounts runtime, removes resize handling, runs destroy event and clears references.
   * Use when component is permanently removed.
   */
  public destroy(): void {
    this.unmount();
    this._removeResizeListener();
    this._emit('destroy', this);
    this._resetInternalState();
    EventNames.forEach((eventName) => this._handlers[eventName].clear());
  }

  // TODO Fix Docs here in in docs
  /**
   * Manually recomputes sizes and redraws masks; call after DOM mutations that change layout.
   * Exposed for dynamic content updates without reinitializing immerser.
   *
   * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
   */
  public render(): void {
    this._invalidateStructure();
  }

  // TODO Fix Docs here in in docs
  /**
   * Syncs immerser with an externally controlled scroll position.
   * `hasExternalScroll=true` option flag is required to call this method.
   * Call when using a custom scroll handler.
   *
   * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
   */
  public syncScroll(): void {
    this._invalidateDraw();
  }

  /** Register persistent event handler. */
  public on<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void {
    this._handlers[eventName].add(handler);
  }

  /** Register event handler that will be removed after first call. */
  public once<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void {
    this._handlers[eventName].add(
      wrapOnceHandler(handler, (...args: HandlerArgs<K>) => {
        this.off(eventName, handler);
        handler.apply(undefined, args);
      }),
    );
  }

  /** Removes handler(s) for provided event. */
  public off<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void {
    const handlerSet = this._handlers[eventName];

    handlerSet.forEach((storedHandler) => {
      const original = getOriginalHandler(storedHandler);
      if (storedHandler === handler || original === handler) {
        handlerSet.delete(storedHandler);
      }
    });
  }

  /** Current active layer index derived from scroll position. */
  public get activeIndex(): number {
    return this._activeIndex;
  }

  /** Indicates whether immerser runtime is enabled (markup cloned and listeners attached). */
  public get isMounted(): boolean {
    return this._isMounted;
  }

  /** The root DOM node immerser is attached to. */
  public get rootNode(): HTMLElement | null {
    return this._rootNode;
  }

  /** Progress of each layer from 0 (off-screen) to 1 (fully visible). */
  public get layerProgressArray(): readonly number[] {
    return this._layerProgressArray;
  }
}

// for typedef generation needs
export type {
  ActiveLayerChangeHandler,
  BaseHandler,
  EventHandlers,
  EventName,
  HandlerByEventName,
  LayersUpdateHandler,
  Options,
  RuntimeOptions,
  SolidClassnames,
  SolidClassnamesByLayerId,
};
export { EventNames };

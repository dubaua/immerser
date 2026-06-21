import Observable from '@dubaua/observable';
import { CROPPED_FULL_ABSOLUTE_STYLES, INTERACTIVE_STYLES, NOT_INTERACTIVE_STYLES } from './styles';
import assignInlineStyles from './utils/assign-inline-styles';
import forEachNode from './utils/for-each-node';
import getLastScrollPosition from './utils/get-last-scroll-position';
import getNodeArray from './utils/get-node-array';
import type { IEngineSnapshot } from '../engine/types';
import type {
  DomAdapterOptions,
  IDomLayerState,
  IImmerserDomAdapterCallbacks,
  IImmerserDomAdapterParams,
  IReportParams,
  ISnapshotTransition,
} from './types';
import type ImmerserEngine from '../engine/immerser-engine';

export default class ImmerserDomAdapter {
  private readonly _callbacks: IImmerserDomAdapterCallbacks;
  private readonly _engine: ImmerserEngine;
  private readonly _options: DomAdapterOptions;
  private _selectors = {
    root: '[data-immerser]',
    layer: '[data-immerser-layer]',
    solid: '[data-immerser-solid]',
    pagerLink: '[data-immerser-pager-link]',
    mask: '[data-immerser-mask]',
    maskInner: '[data-immerser-mask-inner]',
    synchroHover: '[data-immerser-synchro-hover]',
  };
  private _layerStateArray: IDomLayerState[] = [];
  private _layerStateIndexById: Record<string, number> = {};
  private _isBound = false;
  private _rootNode: HTMLElement | null = null;
  private _layerNodeArray: HTMLElement[] = [];
  private _solidNodeArray: HTMLElement[] = [];
  private _pagerLinkNodeArray: HTMLElement[] = [];
  private _originalSolidNodeArray: HTMLElement[] = [];
  private _maskNodeArray: HTMLElement[] = [];
  private _synchroHoverNodeArray: HTMLElement[] = [];
  private _isCustomMarkup = false;
  private _customMaskNodeArray: HTMLElement[] = [];
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

  constructor({ callbacks, engine, options }: IImmerserDomAdapterParams) {
    this._callbacks = callbacks;
    this._engine = engine;
    this._options = options;
  }

  public initialize(): void {
    this._setDomNodes();
    this._validateMarkup();
    this._readClassnamesFromMarkup();
    this._validateSolidClassnameArray();
    this._initSectionIds();
    this._initLayerStateArray();
    this._validateClassnames();
    this._toggleBindOnResizeObserver();
    this._setSizes();
    this._addScrollAndResizeListeners();
  }

  private _report(params: IReportParams): void {
    this._callbacks.report(params);
  }

  /** Collects root, layer and solid nodes from DOM. */
  private _setDomNodes(): void {
    this._rootNode = document.querySelector<HTMLElement>(this._selectors.root);
    this._layerNodeArray = getNodeArray({ selector: this._selectors.layer });
    this._solidNodeArray = getNodeArray({ selector: this._selectors.solid, parent: this._rootNode });
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
    if (this._solidNodeArray.length === 0) {
      this._report({
        message: 'solid nodes not found.',
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
    const layerCount = this._layerNodeArray.length;
    const classnamesCount = this._options.solidClassnameArray.length;
    if (classnamesCount !== layerCount) {
      this._report({
        message: 'solidClassnameArray length differs from count of layers',
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

  /** Verifies solid classnames are configured; otherwise warns via showError. */
  private _validateClassnames(): void {
    // TODO validate every classname as a non-empty DOM token because invalid values make classList.add throw.
    const noClassnameConfigPassed = this._layerStateArray.every(
      ({ solidClassnames }) => !solidClassnames || Object.keys(solidClassnames).length === 0,
    );
    if (noClassnameConfigPassed) {
      this._report({
        message: 'immerser will do nothing without solid classname configuration.',
        docsHash: '#prepare-your-markup',
        isWarning: true,
      });
    }
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
    this._solidNodeArray = [];
    this._pagerLinkNodeArray = [];
    this._originalSolidNodeArray = [];
    this._maskNodeArray = [];
    this._synchroHoverNodeArray = [];
    this._isCustomMarkup = false;
    this._customMaskNodeArray = [];
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

  /** Builds masks, clones solids, applies classes and mounts generated markup. */
  private _createMarkup(): void {
    assignInlineStyles(this._rootNode as HTMLElement, NOT_INTERACTIVE_STYLES);
    this._initCustomMarkup();
    this._originalSolidNodeArray = getNodeArray({ selector: this._selectors.solid, parent: this._rootNode });

    this._layerStateArray = this._layerStateArray.map((state, stateIndex) => {
      // create or assign existing markup, bind styles
      const maskNode = this._isCustomMarkup ? this._customMaskNodeArray[stateIndex] : document.createElement('div');
      assignInlineStyles(maskNode, CROPPED_FULL_ABSOLUTE_STYLES);

      let maskInnerNode = this._isCustomMarkup
        ? maskNode.querySelector<HTMLElement>(this._selectors.maskInner)
        : document.createElement('div');
      if (!maskInnerNode) {
        maskInnerNode = document.createElement('div');
      }
      assignInlineStyles(maskInnerNode, CROPPED_FULL_ABSOLUTE_STYLES);

      // mark created masks with data attributes
      if (!this._isCustomMarkup) {
        maskNode.dataset.immerserMask = '';
        maskInnerNode.dataset.immerserMaskInner = '';
      }

      // clone solids to innerMask
      this._originalSolidNodeArray.forEach((childNode) => {
        const clonedChildNode = childNode.cloneNode(true);
        if (clonedChildNode instanceof HTMLElement) {
          assignInlineStyles(clonedChildNode, INTERACTIVE_STYLES);
          (clonedChildNode as any).__immerserCloned = true;
          maskInnerNode.appendChild(clonedChildNode);
        }
      });

      // assign class modifiers to cloned solids
      const clonedSolidNodeList = getNodeArray<HTMLElement>({
        selector: this._selectors.solid,
        parent: maskInnerNode,
      });
      forEachNode(clonedSolidNodeList, (clonedSolidNode) => {
        const solidId = clonedSolidNode.dataset.immerserSolid;
        if (state.solidClassnames && Object.prototype.hasOwnProperty.call(state.solidClassnames, solidId)) {
          clonedSolidNode.classList.add(state.solidClassnames[solidId]);
        }
      });

      // a11y
      if (stateIndex !== 0) {
        maskNode.setAttribute('aria-hidden', 'true');
      }

      maskNode.appendChild(maskInnerNode);
      this._rootNode.appendChild(maskNode);

      this._maskNodeArray.push(maskNode);

      return { ...state, maskNode, maskInnerNode };
    });

    this._detachOriginalSolidNodes();
  }

  /** Validates and prepares custom masks, binding interactive styles to their children. */
  private _initCustomMarkup(): void {
    this._customMaskNodeArray = getNodeArray({ selector: this._selectors.mask, parent: this._rootNode });
    this._isCustomMarkup = this._customMaskNodeArray.length === this._layerStateArray.length;

    if (this._customMaskNodeArray.length > 0 && !this._isCustomMarkup) {
      this._report({
        message: `You're trying use custom markup, but count of your immerser masks doesn't equal layers count.`,
        isWarning: true,
        docsHash: '#cloning-event-listeners',
      });
    }

    this._customMaskNodeArray.forEach((customMaskNode) => {
      const maskInnerNode = customMaskNode.querySelector<HTMLElement>(this._selectors.maskInner);
      if (!maskInnerNode) {
        return;
      }
      Array.from(maskInnerNode.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          assignInlineStyles(child, INTERACTIVE_STYLES);
        }
      });
    });
  }

  /** Removes original solid nodes from root after clones are in place. */
  private _detachOriginalSolidNodes(): void {
    if (!this._rootNode) {
      return;
    }
    this._originalSolidNodeArray.forEach((childNode) => {
      if (this._rootNode.contains(childNode) && childNode.parentNode) {
        childNode.parentNode.removeChild(childNode);
      }
    });
  }

  /** Parses pager links and maps them to layer indexes using href hash. */
  private _initPagerLinks(): void {
    this._pagerLinkNodeArray = getNodeArray({ selector: this._selectors.pagerLink, parent: this._rootNode });
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
    this._synchroHoverNodeArray = getNodeArray({ selector: this._selectors.synchroHover, parent: this._rootNode });

    this._onSynchroHoverMouseOver = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
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

  /** Drops autogenerated ids from layers on teardown. */
  private _clearCustomSectionIds(): void {
    this._layerStateArray.forEach((state) => {
      if ((state.layerNode as any).__immerserCustomId) {
        state.layerNode.removeAttribute('id');
      }
    });
  }

  /** Restores original solid nodes back into the root node. */
  private _restoreOriginalSolidNodes(): void {
    if (!this._rootNode) {
      return;
    }
    this._originalSolidNodeArray.forEach((childNode) => {
      this._rootNode.appendChild(childNode);
    });
  }

  /** Removes cloned markup or cleans up custom masks when unbinding. */
  private _cleanupClonedMarkup(): void {
    this._maskNodeArray.forEach((immerserMaskNode) => {
      if (this._isCustomMarkup) {
        immerserMaskNode.removeAttribute('style');
        immerserMaskNode.removeAttribute('aria-hidden');
        const immerserMaskInnerNode = immerserMaskNode.querySelector<HTMLElement>(this._selectors.maskInner);
        if (!immerserMaskInnerNode) {
          return;
        }
        immerserMaskInnerNode.removeAttribute('style');
        const clonedSolidNodeArray = getNodeArray({ selector: this._selectors.solid, parent: immerserMaskInnerNode });
        clonedSolidNodeArray.forEach((clonedSolidNode) => {
          if ((clonedSolidNode as any).__immerserCloned) {
            immerserMaskInnerNode.removeChild(clonedSolidNode);
          }
        });
      } else {
        if (this._rootNode) {
          this._rootNode.removeChild(immerserMaskNode);
        }
      }
    });
  }

  private _removeScrollAndResizeListeners(): void {
    if (this._options.isScrollHandled) {
      window.removeEventListener('scroll', this._onScroll!, false);
    }
    window.removeEventListener('resize', this._onResize!, false);
    window.removeEventListener('orientationchange', this._onResize!, false);
    this._resizeObserver?.disconnect();
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
      if (this._scrollFrameId) {
        window.cancelAnimationFrame(this._scrollFrameId);
        this._scrollFrameId = null;
      }
      this._scrollFrameId = window.requestAnimationFrame(() => {
        const y = getLastScrollPosition().y;
        const { previousActiveIndex, snapshot } = this._calculateSnapshotTransition(y);
        this._callbacks.onLayersUpdate([...snapshot.layerProgressArray]);
        this._draw(snapshot, previousActiveIndex);
        if (this._options.scrollAdjustThreshold > 0) {
          if (this._scrollAdjustTimerId) {
            clearTimeout(this._scrollAdjustTimerId);
            this._scrollAdjustTimerId = null;
          }
          this._scrollAdjustTimerId = setTimeout(this._adjustScroll.bind(this), this._options.scrollAdjustDelay);
        }
      });
    }
  }

  /** RAF-throttled resize handler that recalculates sizes and redraws. */
  private _handleResize(): void {
    if (this._resizeFrameId) {
      window.cancelAnimationFrame(this._resizeFrameId);
      this._resizeFrameId = null;
    }
    this._resizeFrameId = window.requestAnimationFrame(() => {
      this.render();
    });
  }

  /**
   * Prepares markup, attaches listeners and triggers first draw; also emits bind event.
   * Intended to be idempotent for toggling immerser on when viewport width allows.
   */
  public bind(): void {
    this._createMarkup();
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
    this._detachCallbacks();
    this._removeSyncroHoverListeners();
    this._clearCustomSectionIds();
    this._restoreOriginalSolidNodes();
    this._cleanupClonedMarkup();
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

  public get activeIndex(): number {
    return this._engine.snapshot.activeIndex;
  }

  public get isBound(): boolean {
    return this._isBound;
  }

  public get rootNode(): HTMLElement {
    return this._rootNode;
  }

  public get layerProgressArray(): readonly number[] {
    return this._engine.snapshot.layerProgressArray;
  }
}

import mergeOptions from '@dubaua/merge-options';
import Observable from '@dubaua/observable';
import {
  CROPPED_FULL_ABSOLUTE_STYLES,
  INTERACTIVE_STYLES,
  MESSAGE_PREFIX,
  NOT_INTERACTIVE_STYLES,
  OPTION_CONFIG,
} from './options';
import { bindStyles, forEachNode, getLastScrollPosition, getNodeArray, isEmpty, showError } from './utils';
import { LayerState, Options, SolidClassnames } from './types';

/** @public Main Immerser controller orchestrating markup cloning and scroll-driven transitions. */
export default class Immerser {
  private _options: Options = {} as Options;
  private _selectors = {
    root: '[data-immerser]',
    layer: '[data-immerser-layer]',
    solid: '[data-immerser-solid]',
    pagerLink: '[data-immerser-pager-link]',
    mask: '[data-immerser-mask]',
    maskInner: '[data-immerser-mask-inner]',
    synchroHover: '[data-immerser-synchro-hover]',
  };
  private _layerStateArray: LayerState[] = [];
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
  private _windowHeight = 0;
  private _immerserTop = 0;
  private _immerserHeight = 0;
  private _resizeFrameId: number | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _scrollFrameId: number | null = null;
  private _scrollAdjustTimerId: ReturnType<typeof setTimeout> | null = null;
  private _reactiveActiveLayer = new Observable<number>(0);
  private _reactiveWindowWidth = new Observable<number>();
  private _reactiveSynchroHoverId = new Observable<string | null>(null);
  private _unsubscribeRedrawingPager: (() => void) | null = null;
  private _unsubscribeUpdatingHash: (() => void) | null = null;
  private _unsubscribeActiveLayerChange: (() => void) | null = null;
  private _unsubscribeSynchroHover: (() => void) | null = null;
  private _unsubscribeToggleBindOnResize: (() => void) | null = null;
  private _onResize: (() => void) | null = null;
  private _onScroll: (() => void) | null = null;
  private _onSynchroHoverMouseOver: ((e: MouseEvent) => void) | null = null;
  private _onSynchroHoverMouseOut: (() => void) | null = null;

  /**
   * Creates immerser instance and immediately runs setup with optional user options.
   * @param userOptions - overrides for defaults defined in OPTION_CONFIG if pass validation
   */
  constructor(userOptions?: Partial<Options>) {
    this._init(userOptions);
  }

  /** Bootstraps nodes, options, state, listeners and fires onInit callback if provided. */
  private _init(userOptions?: Partial<Options>): void {
    this._setDomNodes();
    this._validateMarkup();
    this._mergeOptions(userOptions);
    this._readClassnamesFromMarkup();
    this._validateSolidClassnameArray();
    this._initSectionIds();
    this._initLayerStateArray();
    this._validateClassnames();
    this._toggleBindOnResizeObserver();
    this._setSizes();
    this._addScrollAndResizeListeners();
    if (typeof this._options.onInit === 'function') {
      this._options.onInit(this);
    }
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
      showError({
        message: 'immerser root node not found.',
        docs: '#prepare-your-markup',
      });
    }
    if (this._layerNodeArray.length < 0) {
      showError({
        message: 'immerser will not work without layer nodes.',
        docs: '#prepare-your-markup',
      });
    }
    if (this._solidNodeArray.length < 0) {
      showError({
        message: 'immerser will not work without solid nodes.',
        docs: '#prepare-your-markup',
      });
    }
  }

  /** Merges user options with defaults and attaches helper metadata to messages. */
  private _mergeOptions(userOptions?: Partial<Options>): void {
    this._options = mergeOptions({
      optionConfig: OPTION_CONFIG,
      userOptions,
      prefix: MESSAGE_PREFIX,
      suffix: '\nCheck out documentation https://github.com/dubaua/immerser#options',
    }) as Options;
  }

  /** Reads per-layer classname configs from data attributes if provided. */
  private _readClassnamesFromMarkup(): void {
    this._layerNodeArray.forEach((layerNode, layerIndex) => {
      if (layerNode.dataset.immerserLayerConfig) {
        try {
          this._options.solidClassnameArray[layerIndex] = JSON.parse(layerNode.dataset.immerserLayerConfig);
        } catch (e) {
          console.error(MESSAGE_PREFIX, 'Failed to parse JSON classname configuration.', e);
        }
      }
    });
  }

  /** Ensures classname configuration length matches layers count. */
  private _validateSolidClassnameArray(): void {
    const layerCount = this._layerNodeArray.length;
    const classnamesCount = this._options.solidClassnameArray.length;
    if (classnamesCount !== layerCount) {
      showError({
        message: 'solidClassnameArray length differs from count of layers',
        docs: '#options',
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
        beginEnter: 0,
        beginLeave: 0,
        endEnter: 0,
        endLeave: 0,
        id,
        layerBottom: 0,
        layerTop: 0,
        maskInnerNode: null,
        maskNode: null,
        layerNode: layerNode,
        solidClassnames,
      } as LayerState;
    });
  }

  /** Verifies solid classnames are configured; otherwise warns via showError. */
  private _validateClassnames(): void {
    const noClassnameConfigPassed = this._layerStateArray.every((state) => isEmpty(state.solidClassnames));
    if (noClassnameConfigPassed) {
      showError({
        message: 'immerser will do nothing without solid classname configuration.',
        docs: '#prepare-your-markup',
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
    this._windowHeight = window.innerHeight;
    this._immerserTop = (this._rootNode as HTMLElement).offsetTop;
    this._immerserHeight = (this._rootNode as HTMLElement).offsetHeight;

    this._layerStateArray = this._layerStateArray.map((state) => {
      const layerTop = state.layerNode.offsetTop;
      const layerBottom = layerTop + state.layerNode.offsetHeight;

      const endEnter = layerTop - this._immerserTop;
      const beginEnter = endEnter - this._immerserHeight;
      const endLeave = layerBottom - this._immerserTop;
      const beginLeave = endLeave - this._immerserHeight;

      return {
        ...state,
        layerTop,
        layerBottom,
        beginEnter,
        endEnter,
        beginLeave,
        endLeave,
      } as LayerState;
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
    this._windowHeight = 0;
    this._immerserTop = 0;
    this._immerserHeight = 0;
    this._resizeFrameId = null;
    this._resizeObserver = null;
    this._scrollFrameId = null;
    this._scrollAdjustTimerId = null;
    this._reactiveActiveLayer.reset();
    this._reactiveWindowWidth.reset();
    this._reactiveSynchroHoverId.reset();
    this._unsubscribeRedrawingPager = null;
    this._unsubscribeUpdatingHash = null;
    this._unsubscribeActiveLayerChange = null;
    this._unsubscribeSynchroHover = null;
    this._unsubscribeToggleBindOnResize = null;
    this._onResize = null;
    this._onScroll = null;
    this._onSynchroHoverMouseOver = null;
    this._onSynchroHoverMouseOut = null;
  }

  /** Builds masks, clones solids, applies classes and mounts generated markup. */
  private _createMarkup(): void {
    bindStyles(this._rootNode as HTMLElement, NOT_INTERACTIVE_STYLES);
    this._initCustomMarkup();
    this._originalSolidNodeArray = getNodeArray({ selector: this._selectors.solid, parent: this._rootNode });

    this._layerStateArray = this._layerStateArray.map((state, stateIndex) => {
      // create or assign existing markup, bind styles
      const maskNode = this._isCustomMarkup ? this._customMaskNodeArray[stateIndex] : document.createElement('div');
      bindStyles(maskNode, CROPPED_FULL_ABSOLUTE_STYLES);

      let maskInnerNode = this._isCustomMarkup
        ? maskNode.querySelector<HTMLElement>(this._selectors.maskInner)
        : document.createElement('div');
      if (!maskInnerNode) {
        maskInnerNode = document.createElement('div');
      }
      bindStyles(maskInnerNode, CROPPED_FULL_ABSOLUTE_STYLES);

      // mark created masks with data attributes
      if (!this._isCustomMarkup) {
        maskNode.dataset.immerserMask = '';
        maskInnerNode.dataset.immerserMaskInner = '';
      }

      // clone solids to innerMask
      this._originalSolidNodeArray.forEach((childNode) => {
        const clonedChildNode = childNode.cloneNode(true);
        if (clonedChildNode instanceof HTMLElement) {
          bindStyles(clonedChildNode, INTERACTIVE_STYLES);
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
      showError({
        message: `You're trying use custom markup, but count of your immerser masks doesn't equal layers count.`,
        warning: true,
        docs: '#cloning-event-listeners',
      });
    }

    this._customMaskNodeArray.forEach((customMaskNode) => {
      const maskInnerNode = customMaskNode.querySelector<HTMLElement>(this._selectors.maskInner);
      if (!maskInnerNode) {
        return;
      }
      Array.from(maskInnerNode.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          bindStyles(child, INTERACTIVE_STYLES);
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
      this._rootNode.removeChild(childNode);
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

  /** Subscribes to reactive values to redraw pager, hash, callbacks and hover. */
  private _attachCallbacks(): void {
    if (this._pagerLinkNodeArray.length > 0) {
      this._unsubscribeRedrawingPager = this._reactiveActiveLayer.subscribe(this._drawPagerLinks.bind(this));
    }

    if (this._options.hasToUpdateHash) {
      this._unsubscribeUpdatingHash = this._reactiveActiveLayer.subscribe(this._drawHash.bind(this));
    }

    if (typeof this._options.onActiveLayerChange === 'function') {
      this._unsubscribeActiveLayerChange = this._reactiveActiveLayer.subscribe((nextIndex) => {
        this._options.onActiveLayerChange!(nextIndex, this);
      });
    }

    if (this._synchroHoverNodeArray.length > 0) {
      this._unsubscribeSynchroHover = this._reactiveSynchroHoverId.subscribe(this._drawSynchroHover.bind(this));
    }
  }

  /** Unsubscribes from all reactive callbacks. */
  private _detachCallbacks(): void {
    if (typeof this._unsubscribeRedrawingPager === 'function') {
      this._unsubscribeRedrawingPager();
    }

    if (typeof this._unsubscribeUpdatingHash === 'function') {
      this._unsubscribeUpdatingHash();
    }

    if (typeof this._unsubscribeActiveLayerChange === 'function') {
      this._unsubscribeActiveLayerChange();
    }

    if (typeof this._unsubscribeSynchroHover === 'function') {
      this._unsubscribeSynchroHover();
    }
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

  /** Applies transforms based on scroll position and updates active layer state. */
  private _draw(scrollY?: number): void {
    const y = scrollY !== undefined ? scrollY : getLastScrollPosition().y;
    this._layerStateArray.forEach(
      ({ beginEnter, endEnter, beginLeave, endLeave, maskNode, maskInnerNode, layerTop, layerBottom }, layerIndex) => {
        let progress: number;

        if (beginEnter > y) {
          progress = this._immerserHeight;
        } else if (beginEnter <= y && y < endEnter) {
          progress = endEnter - y;
        } else if (endEnter <= y && y < beginLeave) {
          progress = 0;
        } else if (beginLeave <= y && y < endLeave) {
          progress = beginLeave - y;
        } else {
          progress = -this._immerserHeight;
        }

        maskNode.style.transform = `translateY(${progress}px)`;
        maskInnerNode.style.transform = `translateY(${-progress}px)`;

        const pagerScrollActivePoint = y + this._windowHeight * (1 - this._options.pagerThreshold);
        if (layerTop <= pagerScrollActivePoint && pagerScrollActivePoint < layerBottom) {
          this._reactiveActiveLayer.value = layerIndex;
        }
      },
    );
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
    const { layerTop, layerBottom } = this._layerStateArray[this._reactiveActiveLayer.value as number];
    const { x, y } = getLastScrollPosition();
    const topThreshold = Math.abs(y - layerTop);
    const bottomThreshold = Math.abs(y + this._windowHeight - layerBottom);

    if (topThreshold !== 0 && bottomThreshold !== 0) {
      if (topThreshold <= bottomThreshold && topThreshold <= this._options.scrollAdjustThreshold) {
        window.scrollTo(x, layerTop);
      } else if (bottomThreshold <= topThreshold && bottomThreshold <= this._options.scrollAdjustThreshold) {
        window.scrollTo(x, layerBottom - this._windowHeight);
      }
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
        this._draw();
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
   * Prepares markup, attaches listeners and triggers first draw; also fires onBind callback.
   * Intended to be idempotent for toggling immerser on when viewport width allows.
   */
  public bind(): void {
    this._createMarkup();
    this._initPagerLinks();
    this._initHoverSynchro();
    this._attachCallbacks();
    this._isBound = true;
    this._draw();
    if (typeof this._options.onBind === 'function') {
      this._options.onBind(this);
    }
  }

  /**
   * Tears down generated markup and listeners, restores DOM, resets active layer and fires onUnbind.
   * Safe to call multiple times; no-op when already unbound.
   */
  public unbind(): void {
    this._detachCallbacks();
    this._removeSyncroHoverListeners();
    this._clearCustomSectionIds();
    this._restoreOriginalSolidNodes();
    this._cleanupClonedMarkup();
    this._isBound = false;
    if (typeof this._options.onUnbind === 'function') {
      this._options.onUnbind(this);
    }
    this._reactiveActiveLayer.value = undefined;
  }

  /**
   * Fully destroys immerser: unbinds, removes window listeners, runs onDestroy and clears all references.
   * Use when component is permanently removed.
   */
  public destroy(): void {
    this.unbind();
    this._unsubscribeToggleBindOnResize?.();
    this._removeScrollAndResizeListeners();
    if (typeof this._options.onDestroy === 'function') {
      this._options.onDestroy(this);
    }
    this._resetInternalState();
  }

  /**
   * Manually recomputes sizes and redraws masks; call after DOM mutations that change layout.
   * Exposed for dynamic content updates without reinitializing immerser.
   */
  public render(): void {
    this._setSizes();
    this._draw();
  }

  /** Current active layer index derived from scroll position. */
  public get activeIndex(): number {
    return this._reactiveActiveLayer.value;
  }

  /** Indicates whether immerser is currently bound (markup cloned and listeners attached). */
  public get isBound(): boolean {
    return this._isBound;
  }

  /** The root DOM node immerser is attached to. */
  public get rootNode(): HTMLElement {
    return this._rootNode;
  }
}

// for typedef generation needs
export type { Options, SolidClassnames };

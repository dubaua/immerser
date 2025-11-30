import mergeOptions from '@dubaua/merge-options';
import Observable from '@dubaua/observable';
import {
  CROPPED_FULL_ABSOLUTE_STYLES,
  INTERACTIVE_STYLES,
  MESSAGE_PREFIX,
  NOT_INTERACTIVE_STYLES,
  OPTION_CONFIG,
} from '@/options';
import { bindStyles, forEachNode, getLastScrollPosition, getNodeArray, isEmpty, showError } from '@/utils';
import { LayerState, Options } from '@/types';

export default class Immerser {
  options: Options = {} as Options;
  selectors = {
    root: '[data-immerser]',
    layer: '[data-immerser-layer]',
    solid: '[data-immerser-solid]',
    pagerLink: '[data-immerser-pager-link]',
    mask: '[data-immerser-mask]',
    maskInner: '[data-immerser-mask-inner]',
    synchroHover: '[data-immerser-synchro-hover]',
  };
  layerStateArray: LayerState[] = [];
  layerStateIndexById: Record<string, number> = {};
  isBound = false;
  rootNode: HTMLElement | null = null;
  layerNodeArray: HTMLElement[] = [];
  solidNodeArray: HTMLElement[] = [];
  pagerLinkNodeArray: HTMLElement[] = [];
  originalSolidNodeArray: HTMLElement[] = [];
  maskNodeArray: HTMLElement[] = [];
  synchroHoverNodeArray: HTMLElement[] = [];
  isCustomMarkup = false;
  customMaskNodeArray: HTMLElement[] = [];
  documentHeight = 0;
  windowHeight = 0;
  immerserTop = 0;
  immerserHeight = 0;
  resizeFrameId: number | null = null;
  scrollFrameId: number | null = null;
  scrollAdjustTimerId: ReturnType<typeof setTimeout> | null = null;
  reactiveActiveLayer: Observable<number | undefined> = new Observable<number | undefined>();
  reactiveWindowWidth: Observable<number> = new Observable<number>();
  reactiveSynchroHoverId: Observable<string | undefined> = new Observable<string | undefined>();
  unsubscribeRedrawingPager: (() => void) | null = null;
  unsubscribeUpdatingHash: (() => void) | null = null;
  unsubscribeActiveLayerChange: (() => void) | null = null;
  unsubscribeSynchroHover: (() => void) | null = null;
  unsubscribeToggleBindOnResize: (() => void) | null = null;
  onResize: (() => void) | null = null;
  onScroll: (() => void) | null = null;
  onSynchroHoverMouseOver: ((e: MouseEvent) => void) | null = null;
  onSynchroHoverMouseOut: (() => void) | null = null;

  constructor(userOptions?: Partial<Options>) {
    this._init(userOptions);
  }

  private _init(userOptions?: Partial<Options>): void {
    this._setDomNodes();
    this._validateMarkup();
    this._mergeOptions(userOptions);
    this._readClassnamesFromMarkup();
    this._validateSolidClassnameArray();
    this._initSectionIds();
    this._initStateMap();
    this._validateClassnames();
    this._toggleBindOnResizeObserver();
    this._setSizes();
    this._addScrollAndResizeListeners();
    if (typeof this.options.onInit === 'function') {
      this.options.onInit(this);
    }
  }

  private _setDomNodes(): void {
    this.rootNode = document.querySelector<HTMLElement>(this.selectors.root);
    this.layerNodeArray = getNodeArray({ selector: this.selectors.layer });
    this.solidNodeArray = getNodeArray({ selector: this.selectors.solid, parent: this.rootNode });
  }

  private _validateMarkup(): void {
    if (!this.rootNode) {
      showError({
        message: 'immerser root node not found.',
        docs: '#prepare-your-markup',
      });
    }
    if (this.layerNodeArray.length < 0) {
      showError({
        message: 'immerser will not work without layer nodes.',
        docs: '#prepare-your-markup',
      });
    }
    if (this.solidNodeArray.length < 0) {
      showError({
        message: 'immerser will not work without solid nodes.',
        docs: '#prepare-your-markup',
      });
    }
  }

  private _mergeOptions(userOptions?: Partial<Options>): void {
    this.options = mergeOptions({
      optionConfig: OPTION_CONFIG,
      userOptions,
      prefix: MESSAGE_PREFIX,
      suffix: '\nCheck out documentation https://github.com/dubaua/immerser#options',
    }) as Options;
  }

  private _readClassnamesFromMarkup(): void {
    this.layerNodeArray.forEach((layerNode, layerIndex) => {
      if (layerNode.dataset.immerserLayerConfig) {
        try {
          this.options.solidClassnameArray[layerIndex] = JSON.parse(layerNode.dataset.immerserLayerConfig);
        } catch (e) {
          console.error(MESSAGE_PREFIX, 'Failed to parse JSON classname configuration.', e);
        }
      }
    });
  }

  private _validateSolidClassnameArray(): void {
    const layerCount = this.layerNodeArray.length;
    const classnamesCount = this.options.solidClassnameArray.length;
    if (classnamesCount !== layerCount) {
      showError({
        message: 'solidClassnameArray length differs from count of layers',
        docs: '#options',
      });
    }
  }

  private _initSectionIds(): void {
    this.layerNodeArray.forEach((layerNode, layerIndex) => {
      let id = layerNode.id;
      if (!id) {
        id = `immerser-section-${layerIndex}`;
        layerNode.id = id;
        (layerNode as any).__immerserCustomId = true;
      }
      this.layerStateIndexById[id] = layerIndex;
    });
  }

  private _initStateMap(): void {
    this.layerStateArray = this.layerNodeArray.map((layerNode, layerIndex) => {
      const solidClassnames = this.options.solidClassnameArray[layerIndex];
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

  private _validateClassnames(): void {
    const noClassnameConfigPassed = this.layerStateArray.every((state) => isEmpty(state.solidClassnames));
    if (noClassnameConfigPassed) {
      showError({
        message: 'immerser will do nothing without solid classname configuration.',
        docs: '#prepare-your-markup',
      });
    }
  }

  private _toggleBindOnResizeObserver(): void {
    this.unsubscribeToggleBindOnResize = this.reactiveWindowWidth.subscribe((nextWindowWidth) => {
      if (nextWindowWidth >= this.options.fromViewportWidth) {
        if (!this.isBound) {
          this.bind();
        }
      } else if (this.isBound) {
        this.unbind();
      }
    });
  }

  private _setSizes(): void {
    this.documentHeight = document.documentElement.offsetHeight;
    this.windowHeight = window.innerHeight;
    this.immerserTop = (this.rootNode as HTMLElement).offsetTop;
    this.immerserHeight = (this.rootNode as HTMLElement).offsetHeight;

    this.layerStateArray = this.layerStateArray.map((state) => {
      const layerTop = state.layerNode.offsetTop;
      const layerBottom = layerTop + state.layerNode.offsetHeight;

      const endEnter = layerTop - this.immerserTop;
      const beginEnter = endEnter - this.immerserHeight;
      const endLeave = layerBottom - this.immerserTop;
      const beginLeave = endLeave - this.immerserHeight;

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

    this.reactiveWindowWidth.value = window.innerWidth;
  }

  private _addScrollAndResizeListeners(): void {
    if (this.options.isScrollHandled) {
      this.onScroll = this._handleScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, false);
    }
    this.onResize = this._handleResize.bind(this);
    window.addEventListener('resize', this.onResize, false);
  }

  public bind(): void {
    this._createMarkup();
    this._initPagerLinks();
    this._initHoverSynchro();
    this._attachCallbacks();
    this.isBound = true;
    this._draw();
    if (typeof this.options.onBind === 'function') {
      this.options.onBind(this);
    }
  }

  public unbind(): void {
    this._detachCallbacks();
    this._removeSyncroHoverListeners();
    this._clearCustomSectionIds();
    this._restoreOriginalSolidNodes();
    this._cleanupClonedMarkup();
    this.isBound = false;
    if (typeof this.options.onUnbind === 'function') {
      this.options.onUnbind(this);
    }
    this.reactiveActiveLayer.value = undefined;
  }

  private _resetInternalState(): void {
    this.layerStateArray = [];
    this.layerStateIndexById = {};
    this.isBound = false;
    this.rootNode = null;
    this.layerNodeArray = [];
    this.solidNodeArray = [];
    this.pagerLinkNodeArray = [];
    this.originalSolidNodeArray = [];
    this.maskNodeArray = [];
    this.synchroHoverNodeArray = [];
    this.isCustomMarkup = false;
    this.customMaskNodeArray = [];
    this.documentHeight = 0;
    this.windowHeight = 0;
    this.immerserTop = 0;
    this.immerserHeight = 0;
    this.resizeFrameId = null;
    this.scrollFrameId = null;
    this.scrollAdjustTimerId = null;
    this.reactiveActiveLayer = new Observable<number | undefined>();
    this.reactiveWindowWidth = new Observable<number>();
    this.reactiveSynchroHoverId = new Observable<string | undefined>();
    this.unsubscribeRedrawingPager = null;
    this.unsubscribeUpdatingHash = null;
    this.unsubscribeActiveLayerChange = null;
    this.unsubscribeSynchroHover = null;
    this.unsubscribeToggleBindOnResize = null;
    this.onResize = null;
    this.onScroll = null;
    this.onSynchroHoverMouseOver = null;
    this.onSynchroHoverMouseOut = null;
  }

  public destroy(): void {
    this.unbind();
    this.unsubscribeToggleBindOnResize?.();
    this._removeScrollAndResizeListeners();
    if (typeof this.options.onDestroy === 'function') {
      this.options.onDestroy(this);
    }
    this._resetInternalState();
  }

  private _createMarkup(): void {
    bindStyles(this.rootNode as HTMLElement, NOT_INTERACTIVE_STYLES);
    this._initCustomMarkup();
    this.originalSolidNodeArray = getNodeArray({ selector: this.selectors.solid, parent: this.rootNode });

    this.layerStateArray = this.layerStateArray.map((state, stateIndex) => {
      // create or assign existing markup, bind styles
      const maskNode = this.isCustomMarkup ? this.customMaskNodeArray[stateIndex] : document.createElement('div');
      bindStyles(maskNode, CROPPED_FULL_ABSOLUTE_STYLES);

      let maskInnerNode = this.isCustomMarkup
        ? maskNode.querySelector<HTMLElement>(this.selectors.maskInner)
        : document.createElement('div');
      if (!maskInnerNode) {
        maskInnerNode = document.createElement('div');
      }
      bindStyles(maskInnerNode, CROPPED_FULL_ABSOLUTE_STYLES);

      // mark created masks with data attributes
      if (!this.isCustomMarkup) {
        maskNode.dataset.immerserMask = '';
        maskInnerNode.dataset.immerserMaskInner = '';
      }

      // clone solids to innerMask
      this.originalSolidNodeArray.forEach((childNode) => {
        const clonedChildNode = childNode.cloneNode(true);
        if (clonedChildNode instanceof HTMLElement) {
          bindStyles(clonedChildNode, INTERACTIVE_STYLES);
          (clonedChildNode as any).__immerserCloned = true;
          maskInnerNode.appendChild(clonedChildNode);
        }
      });

      // assign class modifiers to cloned solids
      const clonedSolidNodeList = getNodeArray<HTMLElement>({
        selector: this.selectors.solid,
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
      this.rootNode.appendChild(maskNode);

      this.maskNodeArray.push(maskNode);

      return { ...state, maskNode, maskInnerNode };
    });

    this._removeOriginalSolidNodes();
  }

  private _initCustomMarkup(): void {
    this.customMaskNodeArray = getNodeArray({ selector: this.selectors.mask, parent: this.rootNode });
    this.isCustomMarkup = this.customMaskNodeArray.length === this.layerStateArray.length;

    if (this.customMaskNodeArray.length > 0 && !this.isCustomMarkup) {
      showError({
        message: 'You\'re trying use custom markup, but count of your immerser masks doesn\'t equal layers count.',
        warning: true,
        docs: '#cloning-event-listeners',
      });
    }

    this.customMaskNodeArray.forEach((customMaskNode) => {
      const maskInnerNode = customMaskNode.querySelector<HTMLElement>(this.selectors.maskInner);
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

  private _removeOriginalSolidNodes(): void {
    if (!this.rootNode) {
      return;
    }
    this.originalSolidNodeArray.forEach((childNode) => {
      this.rootNode.removeChild(childNode);
    });
  }

  private _initPagerLinks(): void {
    this.pagerLinkNodeArray = getNodeArray({ selector: this.selectors.pagerLink, parent: this.rootNode });
    this.pagerLinkNodeArray.forEach((pagerLinkNode) => {
      const { href } = pagerLinkNode as HTMLAnchorElement;
      if (href) {
        const layerId = href.split('#')[1];
        if (layerId) {
          const layerIndex = this.layerStateIndexById[layerId];
          pagerLinkNode.dataset.immerserLayerIndex = layerIndex.toString();
        }
      }
    });
  }

  private _initHoverSynchro(): void {
    this.synchroHoverNodeArray = getNodeArray({ selector: this.selectors.synchroHover, parent: this.rootNode });

    this.onSynchroHoverMouseOver = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      const synchroHoverId = target.dataset.immerserSynchroHover;
      this.reactiveSynchroHoverId.value = synchroHoverId;
    };

    this.onSynchroHoverMouseOut = (): void => {
      this.reactiveSynchroHoverId.value = undefined;
    };

    this.synchroHoverNodeArray.forEach((synchroHoverNode) => {
      synchroHoverNode.addEventListener('mouseover', this.onSynchroHoverMouseOver!);
      synchroHoverNode.addEventListener('mouseout', this.onSynchroHoverMouseOut!);
    });
  }

  private _attachCallbacks(): void {
    if (this.pagerLinkNodeArray.length > 0) {
      this.unsubscribeRedrawingPager = this.reactiveActiveLayer.subscribe(this._drawPagerLinks.bind(this));
    }

    if (this.options.hasToUpdateHash) {
      this.unsubscribeUpdatingHash = this.reactiveActiveLayer.subscribe(this._drawHash.bind(this));
    }

    if (typeof this.options.onActiveLayerChange === 'function') {
      this.unsubscribeActiveLayerChange = this.reactiveActiveLayer.subscribe((nextIndex) => {
        this.options.onActiveLayerChange!(nextIndex, this);
      });
    }

    if (this.synchroHoverNodeArray.length > 0) {
      this.unsubscribeSynchroHover = this.reactiveSynchroHoverId.subscribe(this._drawSynchroHover.bind(this));
    }
  }

  private _detachCallbacks(): void {
    if (typeof this.unsubscribeRedrawingPager === 'function') {
      this.unsubscribeRedrawingPager();
    }

    if (typeof this.unsubscribeUpdatingHash === 'function') {
      this.unsubscribeUpdatingHash();
    }

    if (typeof this.unsubscribeActiveLayerChange === 'function') {
      this.unsubscribeActiveLayerChange();
    }

    if (typeof this.unsubscribeSynchroHover === 'function') {
      this.unsubscribeSynchroHover();
    }
  }

  private _removeSyncroHoverListeners(): void {
    this.synchroHoverNodeArray.forEach((synchroHoverNode) => {
      synchroHoverNode.removeEventListener('mouseover', this.onSynchroHoverMouseOver!);
      synchroHoverNode.removeEventListener('mouseout', this.onSynchroHoverMouseOut!);
    });
  }

  private _clearCustomSectionIds(): void {
    this.layerStateArray.forEach((state) => {
      if ((state.layerNode as any).__immerserCustomId) {
        state.layerNode.removeAttribute('id');
      }
    });
  }

  private _restoreOriginalSolidNodes(): void {
    if (!this.rootNode) {
      return;
    }
    this.originalSolidNodeArray.forEach((childNode) => {
      this.rootNode.appendChild(childNode);
    });
  }

  private _cleanupClonedMarkup(): void {
    this.maskNodeArray.forEach((immerserMaskNode) => {
      if (this.isCustomMarkup) {
        immerserMaskNode.removeAttribute('style');
        immerserMaskNode.removeAttribute('aria-hidden');
        const immerserMaskInnerNode = immerserMaskNode.querySelector<HTMLElement>(this.selectors.maskInner);
        if (!immerserMaskInnerNode) {
          return;
        }
        immerserMaskInnerNode.removeAttribute('style');
        const clonedSolidNodeArray = getNodeArray({ selector: this.selectors.solid, parent: immerserMaskInnerNode });
        clonedSolidNodeArray.forEach((clonedSolidNode) => {
          if ((clonedSolidNode as any).__immerserCloned) {
            immerserMaskInnerNode.removeChild(clonedSolidNode);
          }
        });
      } else {
        if (this.rootNode) {
          this.rootNode.removeChild(immerserMaskNode);
        }
      }
    });
  }

  private _removeScrollAndResizeListeners(): void {
    if (this.options.isScrollHandled) {
      window.removeEventListener('scroll', this.onScroll!, false);
    }
    window.removeEventListener('resize', this.onResize!, false);
  }

  private _draw(scrollY?: number): void {
    const y = scrollY !== undefined ? scrollY : getLastScrollPosition().y;
    this.layerStateArray.forEach(
      ({ beginEnter, endEnter, beginLeave, endLeave, maskNode, maskInnerNode, layerTop, layerBottom }, layerIndex) => {
        let progress: number;

        if (beginEnter > y) {
          progress = this.immerserHeight;
        } else if (beginEnter <= y && y < endEnter) {
          progress = endEnter - y;
        } else if (endEnter <= y && y < beginLeave) {
          progress = 0;
        } else if (beginLeave <= y && y < endLeave) {
          progress = beginLeave - y;
        } else {
          progress = -this.immerserHeight;
        }

        maskNode.style.transform = `translateY(${progress}px)`;
        maskInnerNode.style.transform = `translateY(${-progress}px)`;

        const pagerScrollActivePoint = y + this.windowHeight * (1 - this.options.pagerThreshold);
        if (layerTop <= pagerScrollActivePoint && pagerScrollActivePoint < layerBottom) {
          this.reactiveActiveLayer.value = layerIndex;
        }
      },
    );
  }

  private _drawPagerLinks(layerIndex?: number): void {
    this.pagerLinkNodeArray.forEach((pagerLinkNode) => {
      if (parseInt(pagerLinkNode.dataset.immerserLayerIndex, 10) === layerIndex) {
        pagerLinkNode.classList.add(this.options.pagerLinkActiveClassname);
      } else {
        pagerLinkNode.classList.remove(this.options.pagerLinkActiveClassname);
      }
    });
  }

  private _drawHash(layerIndex: number): void {
    const { id, layerNode } = this.layerStateArray[layerIndex];
    layerNode.removeAttribute('id');
    window.location.hash = id;
    layerNode.setAttribute('id', id);
  }

  private _drawSynchroHover(synchroHoverId?: string): void {
    this.synchroHoverNodeArray.forEach((synchroHoverNode) => {
      if (synchroHoverNode.dataset.immerserSynchroHover === synchroHoverId) {
        synchroHoverNode.classList.add('_hover');
      } else {
        synchroHoverNode.classList.remove('_hover');
      }
    });
  }

  private _adjustScroll(): void {
    const { layerTop, layerBottom } = this.layerStateArray[this.reactiveActiveLayer.value as number];
    const { x, y } = getLastScrollPosition();
    const topThreshold = Math.abs(y - layerTop);
    const bottomThreshold = Math.abs(y + this.windowHeight - layerBottom);

    if (topThreshold !== 0 && bottomThreshold !== 0) {
      if (topThreshold <= bottomThreshold && topThreshold <= this.options.scrollAdjustThreshold) {
        window.scrollTo(x, layerTop);
      } else if (bottomThreshold <= topThreshold && bottomThreshold <= this.options.scrollAdjustThreshold) {
        window.scrollTo(x, layerBottom - this.windowHeight);
      }
    }
  }

  public onDOMChange(): void {
    this._setSizes();
    this._draw();
  }

  private _handleScroll(): void {
    if (this.isBound) {
      if (this.scrollFrameId) {
        window.cancelAnimationFrame(this.scrollFrameId);
        this.scrollFrameId = null;
      }
      this.scrollFrameId = window.requestAnimationFrame(() => {
        this._draw();
        if (this.options.scrollAdjustThreshold > 0) {
          if (this.scrollAdjustTimerId) {
            clearTimeout(this.scrollAdjustTimerId);
            this.scrollAdjustTimerId = null;
          }
          this.scrollAdjustTimerId = setTimeout(this._adjustScroll.bind(this), this.options.scrollAdjustDelay);
        }
      });
    }
  }

  private _handleResize(): void {
    if (this.resizeFrameId) {
      window.cancelAnimationFrame(this.resizeFrameId);
      this.resizeFrameId = null;
    }
    this.resizeFrameId = window.requestAnimationFrame(() => {
      this._setSizes();
      this._draw();
    });
  }
}

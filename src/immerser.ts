import mergeOptions from '@dubaua/merge-options';
import Observable from '@dubaua/observable';
import { MESSAGE_PREFFIX, OPTION_CONFIG } from '@/defaults';
import { bindStyles, forEachNode, getLastScrollPosition, getNodeArray, isEmpty, showError } from '@/utils';

const CROPPED_FULL_ABSOLUTE_STYLES = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  overflow: 'hidden',
};

const NOT_INTERACTIVE_STYLES = {
  pointerEvents: 'none',
  touchAction: 'none',
};

const INTERACTIVE_STYLES = {
  pointerEvents: 'all',
  touchAction: 'auto',
};

interface SolidClassnames {
  [key: string]: string;
}

interface State {
  beginEnter: number;
  beginLeave: number;
  endEnter: number;
  endLeave: number;
  id: string;
  layerBottom: number;
  layerTop: number;
  maskInnerNode: HTMLElement | null;
  maskNode: HTMLElement | null;
  layerNode: HTMLElement;
  solidClassnames: SolidClassnames | null;
}

interface Options {
  solidClassnameArray: SolidClassnames[];
  fromViewportWidth: number;
  pagerThreshold: number;
  hasToUpdateHash: boolean;
  scrollAdjustThreshold: number;
  scrollAdjustDelay: number;
  pagerLinkActiveClassname: string;
  isScrollHandled: boolean;
  onInit: ((immerser: Immerser) => void) | null;
  onBind: ((immerser: Immerser) => void) | null;
  onUnbind: ((immerser: Immerser) => void) | null;
  onDestroy: ((immerser: Immerser) => void) | null;
  onActiveLayerChange: ((layerIndex: number, immerser: Immerser) => void) | null;
}

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
  stateArray: State[] = [];
  stateIndexById: Record<string, number> = {};
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
  stopRedrawingPager: (() => void) | null = null;
  stopUpdatingHash: (() => void) | null = null;
  stopFiringActiveLayerChangeCallback: (() => void) | null = null;
  stopTrackingSynchroHover: (() => void) | null = null;
  stopToggleBindOnRezise: (() => void) | null = null;
  onResize: (() => void) | null = null;
  onScroll: (() => void) | null = null;
  onSynchroHoverMouseOver: ((e: MouseEvent) => void) | null = null;
  onSynchroHoverMouseOut: (() => void) | null = null;

  constructor(userOptions?: Partial<Options>) {
    this.init(userOptions);
  }

  init(userOptions?: Partial<Options>): void {
    this.setNodes();
    this.validateMarkup();
    this.mergeOptions(userOptions);
    this.getClassnamesFromMarkup();
    this.validateSolidClassnameArray();
    this.initSectionIds();
    this.initStatemap();
    this.validateClassnames();
    this.toggleBindOnRezise();
    this.setSizes();
    this.addScrollAndResizeListeners();
    if (typeof this.options.onInit === 'function') {
      this.options.onInit(this);
    }
  }

  setNodes(): void {
    this.rootNode = document.querySelector(this.selectors.root);
    this.layerNodeArray = getNodeArray({ selector: this.selectors.layer });
    this.solidNodeArray = getNodeArray({ selector: this.selectors.solid, parent: this.rootNode });
  }

  validateMarkup(): void {
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

  mergeOptions(userOptions?: Partial<Options>): void {
    this.options = mergeOptions({
      optionConfig: OPTION_CONFIG,
      userOptions,
      preffix: MESSAGE_PREFFIX,
      suffix: '\nCheck out documentation https://github.com/dubaua/immerser#options',
    }) as Options;
  }

  getClassnamesFromMarkup(): void {
    this.layerNodeArray.forEach((layerNode, layerIndex) => {
      if (layerNode.dataset.immerserLayerConfig) {
        try {
          this.options.solidClassnameArray[layerIndex] = JSON.parse(layerNode.dataset.immerserLayerConfig);
        } catch (e) {
          console.error(MESSAGE_PREFFIX, 'Failed to parse JSON classname configuration.', e);
        }
      }
    });
  }

  validateSolidClassnameArray(): void {
    const layerCount = this.layerNodeArray.length;
    const classnamesCount = this.options.solidClassnameArray.length;
    if (classnamesCount !== layerCount) {
      showError({
        message: 'solidClassnameArray length differs from count of layers',
        docs: '#options',
      });
    }
  }

  initSectionIds(): void {
    this.layerNodeArray.forEach((layerNode, layerIndex) => {
      let id = layerNode.id;
      if (!id) {
        id = `immerser-section-${layerIndex}`;
        layerNode.id = id;
        (layerNode as any).__immerserCustomId = true;
      }
      this.stateIndexById[id] = layerIndex;
    });
  }

  initStatemap(): void {
    this.stateArray = this.layerNodeArray.map((layerNode, layerIndex) => {
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
      } as State;
    });
  }

  validateClassnames(): void {
    const noClassnameConfigPassed = this.stateArray.every((state) => isEmpty(state.solidClassnames));
    if (noClassnameConfigPassed) {
      showError({
        message: 'immerser will do nothing without solid classname configuration.',
        docs: '#prepare-your-markup',
      });
    }
  }

  toggleBindOnRezise(): void {
    this.stopToggleBindOnRezise = this.reactiveWindowWidth.subscribe((nextWindowWidth) => {
      if (nextWindowWidth >= this.options.fromViewportWidth) {
        if (!this.isBound) {
          this.bind();
        }
      } else if (this.isBound) {
        this.unbind();
      }
    });
  }

  setSizes(): void {
    this.documentHeight = document.documentElement.offsetHeight;
    this.windowHeight = window.innerHeight;
    this.immerserTop = (this.rootNode as HTMLElement).offsetTop;
    this.immerserHeight = (this.rootNode as HTMLElement).offsetHeight;

    this.stateArray = this.stateArray.map((state) => {
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
      } as State;
    });

    this.reactiveWindowWidth.value = window.innerWidth;
  }

  addScrollAndResizeListeners(): void {
    if (this.options.isScrollHandled) {
      this.onScroll = this.handleScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, false);
    }
    this.onResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.onResize, false);
  }

  bind(): void {
    this.createMarkup();
    this.initPagerLinks();
    this.initHoverSynchro();
    this.attachCallbacks();
    this.isBound = true;
    this.draw();
    if (typeof this.options.onBind === 'function') {
      this.options.onBind(this);
    }
  }

  unbind(): void {
    this.detachCallbacks();
    this.removeSyncroHoverListeners();
    this.clearCustomSectionIds();
    this.restoreOriginalSolidNodes();
    this.cleanupClonnedMarkup();
    this.isBound = false;
    if (typeof this.options.onUnbind === 'function') {
      this.options.onUnbind(this);
    }
    this.reactiveActiveLayer.value = undefined;
  }

  private resetInternalState(): void {
    this.stateArray = [];
    this.stateIndexById = {};
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
    this.stopRedrawingPager = null;
    this.stopUpdatingHash = null;
    this.stopFiringActiveLayerChangeCallback = null;
    this.stopTrackingSynchroHover = null;
    this.stopToggleBindOnRezise = null;
    this.onResize = null;
    this.onScroll = null;
    this.onSynchroHoverMouseOver = null;
    this.onSynchroHoverMouseOut = null;
  }

  destroy(): void {
    this.unbind();
    this.stopToggleBindOnRezise?.();
    this.removeScrollAndResizeListeners();
    if (typeof this.options.onDestroy === 'function') {
      this.options.onDestroy(this);
    }
    this.resetInternalState();
  }

  createMarkup(): void {
    bindStyles(this.rootNode as HTMLElement, NOT_INTERACTIVE_STYLES);
    this.initCustomMarkup();
    this.originalSolidNodeArray = getNodeArray({ selector: this.selectors.solid, parent: this.rootNode });

    this.stateArray = this.stateArray.map((state, stateIndex) => {
      // create or assign existing markup, bind styles
      const maskNode = this.isCustomMarkup ? this.customMaskNodeArray[stateIndex] : document.createElement('div');
      bindStyles(maskNode, CROPPED_FULL_ABSOLUTE_STYLES);

      const maskInnerNode = this.isCustomMarkup
        ? maskNode.querySelector(this.selectors.maskInner)
        : document.createElement('div');
      bindStyles(maskInnerNode, CROPPED_FULL_ABSOLUTE_STYLES);

      // mark created masks with data attributes
      if (!this.isCustomMarkup) {
        maskNode.dataset.immerserMask = '';
        maskInnerNode.dataset.immerserMaskInner = '';
      }

      // clone solids to innerMask
      this.originalSolidNodeArray.forEach((childNode) => {
        const clonnedChildNode = childNode.cloneNode(true) as HTMLElement;
        bindStyles(clonnedChildNode, INTERACTIVE_STYLES);
        (clonnedChildNode as any).__immerserClonned = true;
        maskInnerNode.appendChild(clonnedChildNode);
      });

      // assign class modifiers to cloned solids
      const clonedSolidNodeList = maskInnerNode.querySelectorAll(this.selectors.solid);
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

    this.detachOriginalSolidNodes();
  }

  initCustomMarkup(): void {
    this.customMaskNodeArray = getNodeArray({ selector: this.selectors.mask, parent: this.rootNode });
    this.isCustomMarkup = this.customMaskNodeArray.length === this.stateArray.length;

    if (this.customMaskNodeArray.length > 0 && !this.isCustomMarkup) {
      showError({
        message: 'You\'re trying use custom markup, but count of your immerser masks doesn\'t equal layers count.',
        warning: true,
        docs: '#cloning-event-listeners',
      });
    }

    this.customMaskNodeArray.forEach((customMaskNode) => {
      const customChildrenHTMLCollection = (customMaskNode.querySelector(this.selectors.maskInner) as HTMLElement).children;
      for (let i = 0; i < customChildrenHTMLCollection.length; i++) {
        bindStyles(customChildrenHTMLCollection[i] as HTMLElement, INTERACTIVE_STYLES);
      }
    });
  }

  detachOriginalSolidNodes(): void {
    this.originalSolidNodeArray.forEach((childNode) => {
      (this.rootNode as HTMLElement).removeChild(childNode);
    });
  }

  initPagerLinks(): void {
    this.pagerLinkNodeArray = getNodeArray({ selector: this.selectors.pagerLink, parent: this.rootNode });
    this.pagerLinkNodeArray.forEach((pagerLinkNode) => {
      const { href } = pagerLinkNode as HTMLAnchorElement;
      if (href) {
        const layerId = href.split('#')[1];
        if (layerId) {
          const layerIndex = this.stateIndexById[layerId];
          pagerLinkNode.dataset.immerserLayerIndex = layerIndex.toString();
        }
      }
    });
  }

  initHoverSynchro(): void {
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

  attachCallbacks(): void {
    if (this.pagerLinkNodeArray.length > 0) {
      this.stopRedrawingPager = this.reactiveActiveLayer.subscribe(this.drawPagerLinks.bind(this));
    }

    if (this.options.hasToUpdateHash) {
      this.stopUpdatingHash = this.reactiveActiveLayer.subscribe(this.drawHash.bind(this));
    }

    if (typeof this.options.onActiveLayerChange === 'function') {
      this.stopFiringActiveLayerChangeCallback = this.reactiveActiveLayer.subscribe((nextIndex) => {
        this.options.onActiveLayerChange!(nextIndex, this);
      });
    }

    if (this.synchroHoverNodeArray.length > 0) {
      this.stopTrackingSynchroHover = this.reactiveSynchroHoverId.subscribe(this.drawSynchroHover.bind(this));
    }
  }

  detachCallbacks(): void {
    if (typeof this.stopRedrawingPager === 'function') {
      this.stopRedrawingPager();
    }

    if (typeof this.stopUpdatingHash === 'function') {
      this.stopUpdatingHash();
    }

    if (typeof this.stopFiringActiveLayerChangeCallback === 'function') {
      this.stopFiringActiveLayerChangeCallback();
    }

    if (typeof this.stopTrackingSynchroHover === 'function') {
      this.stopTrackingSynchroHover();
    }
  }

  removeSyncroHoverListeners(): void {
    this.synchroHoverNodeArray.forEach((synchroHoverNode) => {
      synchroHoverNode.removeEventListener('mouseover', this.onSynchroHoverMouseOver!);
      synchroHoverNode.removeEventListener('mouseout', this.onSynchroHoverMouseOut!);
    });
  }

  clearCustomSectionIds(): void {
    this.stateArray.forEach((state) => {
      if ((state.layerNode as any).__immerserCustomId) {
        state.layerNode.removeAttribute('id');
      }
    });
  }

  restoreOriginalSolidNodes(): void {
    this.originalSolidNodeArray.forEach((childNode) => {
      (this.rootNode as HTMLElement).appendChild(childNode);
    });
  }

  cleanupClonnedMarkup(): void {
    this.maskNodeArray.forEach((immerserMaskNode) => {
      if (this.isCustomMarkup) {
        immerserMaskNode.removeAttribute('style');
        immerserMaskNode.removeAttribute('aria-hidden');
        const immerserMaskInnerNode = immerserMaskNode.querySelector(this.selectors.maskInner) as HTMLElement;
        immerserMaskInnerNode.removeAttribute('style');
        const clonnedSolidNodeArray = getNodeArray({ selector: this.selectors.solid, parent: immerserMaskInnerNode });
        clonnedSolidNodeArray.forEach((clonnedSolideNode) => {
          if ((clonnedSolideNode as any).__immerserClonned) {
            immerserMaskInnerNode.removeChild(clonnedSolideNode);
          }
        });
      } else {
        (this.rootNode as HTMLElement).removeChild(immerserMaskNode);
      }
    });
  }

  removeScrollAndResizeListeners(): void {
    if (this.options.isScrollHandled) {
      window.removeEventListener('scroll', this.onScroll!, false);
    }
    window.removeEventListener('resize', this.onResize!, false);
  }

  draw(scrollY?: number): void {
    const y = scrollY !== undefined ? scrollY : getLastScrollPosition().y;
    this.stateArray.forEach(
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

  drawPagerLinks(layerIndex?: number): void {
    this.pagerLinkNodeArray.forEach((pagerLinkNode) => {
      if (parseInt(pagerLinkNode.dataset.immerserLayerIndex, 10) === layerIndex) {
        pagerLinkNode.classList.add(this.options.pagerLinkActiveClassname);
      } else {
        pagerLinkNode.classList.remove(this.options.pagerLinkActiveClassname);
      }
    });
  }

  drawHash(layerIndex: number): void {
    const { id, layerNode } = this.stateArray[layerIndex];
    layerNode.removeAttribute('id');
    window.location.hash = id;
    layerNode.setAttribute('id', id);
  }

  drawSynchroHover(synchroHoverId?: string): void {
    this.synchroHoverNodeArray.forEach((synchroHoverNode) => {
      if (synchroHoverNode.dataset.immerserSynchroHover === synchroHoverId) {
        synchroHoverNode.classList.add('_hover');
      } else {
        synchroHoverNode.classList.remove('_hover');
      }
    });
  }

  adjustScroll(): void {
    const { layerTop, layerBottom } = this.stateArray[this.reactiveActiveLayer.value as number];
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

  onDOMChange(): void {
    this.setSizes();
    this.draw();
  }

  handleScroll(): void {
    if (this.isBound) {
      if (this.scrollFrameId) {
        window.cancelAnimationFrame(this.scrollFrameId);
        this.scrollFrameId = null;
      }
      this.scrollFrameId = window.requestAnimationFrame(() => {
        this.draw();
        if (this.options.scrollAdjustThreshold > 0) {
          if (this.scrollAdjustTimerId) {
            clearTimeout(this.scrollAdjustTimerId);
            this.scrollAdjustTimerId = null;
          }
          this.scrollAdjustTimerId = setTimeout(this.adjustScroll.bind(this), this.options.scrollAdjustDelay);
        }
      }, this.options.scrollAdjustDelay);
    }
  }

  handleResize(): void {
    if (this.resizeFrameId) {
      window.cancelAnimationFrame(this.resizeFrameId);
      this.resizeFrameId = null;
    }
    this.resizeFrameId = window.requestAnimationFrame(() => {
      this.setSizes();
      this.draw();
    });
  }
}

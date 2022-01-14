import mergeOptions from '@dubaua/merge-options';
import Observable from '@dubaua/observable';
import { MESSAGE_PREFFIX, OPTION_CONFIG } from '@/defaults.js';
import { bindStyles, forEachNode, getLastScrollPosition, getNodeArray, isEmpty, showError } from '@/utils.js';

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

export default class Immerser {
  constructor(userOptions) {
    this.initState();
    this.init(userOptions);
  }

  initState() {
    this.options = null;
    this.selectors = {
      root: '[data-immerser]',
      layer: '[data-immerser-layer]',
      solid: '[data-immerser-solid]',
      pagerLink: '[data-immerser-pager-link]',
      mask: '[data-immerser-mask]',
      maskInner: '[data-immerser-mask-inner]',
      synchroHover: '[data-immerser-synchro-hover]',
    };
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
    this.reactiveActiveLayer = new Observable();
    this.reactiveWindowWidth = new Observable();
    this.reactiveSynchroHoverId = new Observable();
    this.stopRedrawingPager = null;
    this.stopUpdatingHash = null;
    this.stopFiringActiveLayerChangeCallback = null;
    this.stopTrackingWindowWidth = null;
    this.stopTrackingSynchroHover = null;
    this.onResize = null;
    this.onScroll = null;
    this.onSynchroHoverMouseOver = null;
    this.onSynchroHoverMouseOut = null;
  }

  init(userOptions) {
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

  setNodes() {
    this.rootNode = document.querySelector(this.selectors.root);
    this.layerNodeArray = getNodeArray({ selector: this.selectors.layer });
    this.solidNodeArray = getNodeArray({ selector: this.selectors.solid, parent: this.rootNode });
  }

  validateMarkup() {
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

  mergeOptions(userOptions) {
    this.options = mergeOptions({
      optionConfig: OPTION_CONFIG,
      userOptions,
      preffix: MESSAGE_PREFFIX,
      suffix: '\nCheck out documentation https://github.com/dubaua/immerser#options',
    });
  }

  getClassnamesFromMarkup() {
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

  validateSolidClassnameArray() {
    const layerCount = this.layerNodeArray.length;
    const classnamesCount = this.options.solidClassnameArray.length;
    if (classnamesCount !== layerCount) {
      showError({
        message: 'solidClassnameArray length differs from count of layers',
        docs: '#options',
      });
    }
  }

  initSectionIds() {
    this.layerNodeArray.forEach((layerNode, layerIndex) => {
      let id = layerNode.id;
      if (!id) {
        id = `immerser-section-${layerIndex}`;
        layerNode.id = id;
        layerNode.__immerserCustomId = true;
      }
      this.stateIndexById[id] = layerIndex;
    });
  }

  initStatemap() {
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
      };
    });
  }

  validateClassnames() {
    const noClassnameConfigPassed = this.stateArray.every((state) => isEmpty(state.solidClassnames));
    if (noClassnameConfigPassed) {
      showError({
        message: 'immerser will do nothing without solid classname configuration.',
        docs: '#prepare-your-markup',
      });
    }
  }

  toggleBindOnRezise() {
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

  setSizes() {
    this.documentHeight = document.documentElement.offsetHeight;
    this.windowHeight = window.innerHeight;
    this.immerserTop = this.rootNode.offsetTop;
    this.immerserHeight = this.rootNode.offsetHeight;

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
      };
    });

    this.reactiveWindowWidth.value = window.innerWidth;
  }

  addScrollAndResizeListeners() {
    if (this.options.isScrollHandled) {
      this.onScroll = this.handleScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, false);
    }
    this.onResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.onResize, false);
  }

  bind() {
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

  unbind() {
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

  destroy() {
    this.unbind();
    this.stopToggleBindOnRezise();
    this.removeScrollAndResizeListeners();
    if (typeof this.options.onDestroy === 'function') {
      this.options.onDestroy(this);
    }
    this.initState();
  }

  createMarkup() {
    bindStyles(this.rootNode, NOT_INTERACTIVE_STYLES);
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
        const clonnedChildNode = childNode.cloneNode(true);
        bindStyles(clonnedChildNode, INTERACTIVE_STYLES);
        clonnedChildNode.__immerserClonned = true;
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

  initCustomMarkup() {
    this.customMaskNodeArray = getNodeArray({ selector: this.selectors.mask, parent: this.rootNode });
    this.isCustomMarkup = this.customMaskNodeArray.length === this.stateArray.length;

    if (this.customMaskNodeArray.length > 0 && !this.isCustomMarkup) {
      // later allow explicitly pass mask index?
      showError({
        message: 'You\'re trying use custom markup, but count of your immerser masks doesn\'t equal layers count.',
        warning: true,
        docs: '#cloning-event-listeners',
      });
    }

    // since custom child wrapped in ignoring pointer and touch events immerser mask, we should explicitly set them on
    this.customMaskNodeArray.forEach((customMaskNode) => {
      const customChildrenHTMLCollection = customMaskNode.querySelector(this.selectors.maskInner).children;
      for (let i = 0; i < customChildrenHTMLCollection.length; i++) {
        bindStyles(customChildrenHTMLCollection[i], INTERACTIVE_STYLES);
      }
    });
  }

  detachOriginalSolidNodes() {
    this.originalSolidNodeArray.forEach((childNode) => {
      this.rootNode.removeChild(childNode);
    });
  }

  initPagerLinks() {
    // its here, because we need to clone pager link first, then init them
    this.pagerLinkNodeArray = getNodeArray({ selector: this.selectors.pagerLink, parent: this.rootNode });
    this.pagerLinkNodeArray.forEach((pagerLinkNode) => {
      const { href } = pagerLinkNode;
      if (href) {
        const layerId = href.split('#')[1];
        if (layerId) {
          const layerIndex = this.stateIndexById[layerId];
          pagerLinkNode.dataset.immerserLayerIndex = layerIndex.toString();
        }
      }
    });
  }

  initHoverSynchro() {
    // its here, because we need to clone nodes first, then init them
    this.synchroHoverNodeArray = getNodeArray({ selector: this.selectors.synchroHover, parent: this.rootNode });

    this.onSynchroHoverMouseOver = (e) => {
      const synchroHoverId = e.target.dataset.immerserSynchroHover;
      this.reactiveSynchroHoverId.value = synchroHoverId;
    };

    this.onSynchroHoverMouseOut = () => {
      this.reactiveSynchroHoverId.value = undefined;
    };

    this.synchroHoverNodeArray.forEach((synchroHoverNode) => {
      synchroHoverNode.addEventListener('mouseover', this.onSynchroHoverMouseOver);
      synchroHoverNode.addEventListener('mouseout', this.onSynchroHoverMouseOut);
    });
  }

  attachCallbacks() {
    if (this.pagerLinkNodeArray.length > 0) {
      this.stopRedrawingPager = this.reactiveActiveLayer.subscribe(this.drawPagerLinks.bind(this));
    }

    if (this.options.hasToUpdateHash) {
      this.stopUpdatingHash = this.reactiveActiveLayer.subscribe(this.drawHash.bind(this));
    }

    if (typeof this.options.onActiveLayerChange === 'function') {
      this.stopFiringActiveLayerChangeCallback = this.reactiveActiveLayer.subscribe((nextIndex) => {
        this.options.onActiveLayerChange(nextIndex, this);
      });
    }

    if (this.synchroHoverNodeArray.length > 0) {
      this.stopTrackingSynchroHover = this.reactiveSynchroHoverId.subscribe(this.drawSynchroHover.bind(this));
    }
  }

  detachCallbacks() {
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

  removeSyncroHoverListeners() {
    this.synchroHoverNodeArray.forEach((synchroHoverNode) => {
      synchroHoverNode.removeEventListener('mouseover', this.onSynchroHoverMouseOver);
      synchroHoverNode.removeEventListener('mouseout', this.onSynchroHoverMouseOut);
    });
  }

  clearCustomSectionIds() {
    this.stateArray.forEach((state) => {
      if (state.layerNode.__immerserCustomId) {
        state.layerNode.removeAttribute('id');
      }
    });
  }

  restoreOriginalSolidNodes() {
    this.originalSolidNodeArray.forEach((childNode) => {
      this.rootNode.appendChild(childNode);
    });
  }

  cleanupClonnedMarkup() {
    this.maskNodeArray.forEach((immerserMaskNode) => {
      if (this.isCustomMarkup) {
        immerserMaskNode.removeAttribute('style');
        immerserMaskNode.removeAttribute('aria-hidden');
        const immerserMaskInnerNode = immerserMaskNode.querySelector(this.selectors.maskInner);
        immerserMaskInnerNode.removeAttribute('style');
        const clonnedSolidNodeArray = getNodeArray({ selector: this.selectors.solid, parent: immerserMaskInnerNode });
        clonnedSolidNodeArray.forEach((clonnedSolideNode) => {
          if (clonnedSolideNode.__immerserClonned) {
            immerserMaskInnerNode.removeChild(clonnedSolideNode);
          }
        });
      } else {
        this.rootNode.removeChild(immerserMaskNode);
      }
    });
  }

  removeScrollAndResizeListeners() {
    if (this.options.isScrollHandled) {
      window.removeEventListener('scroll', this.onScroll, false);
    }
    window.removeEventListener('resize', this.onResize, false);
  }

  draw(scrollY) {
    const y = scrollY !== undefined ? scrollY : getLastScrollPosition().y;
    this.stateArray.forEach(
      ({ beginEnter, endEnter, beginLeave, endLeave, maskNode, maskInnerNode, layerTop, layerBottom }, layerIndex) => {
        let progress;

        if (beginEnter > y) {
          progress = this.immerserHeight;
        } else if (beginEnter <= y && y < endEnter) {
          progress = endEnter - y;
        } else if (endEnter <= y && y < beginLeave) {
          progress = 0;
        } else if (beginLeave <= y && y < endLeave) {
          progress = beginLeave - y;
        } else if (y >= endLeave) {
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

  drawPagerLinks(layerIndex) {
    this.pagerLinkNodeArray.forEach((pagerLinkNode) => {
      if (parseInt(pagerLinkNode.dataset.immerserLayerIndex, 10) === layerIndex) {
        pagerLinkNode.classList.add(this.options.pagerLinkActiveClassname);
      } else {
        pagerLinkNode.classList.remove(this.options.pagerLinkActiveClassname);
      }
    });
  }

  drawHash(layerIndex) {
    const { id, layerNode } = this.stateArray[layerIndex];
    // this prevent move to anchor
    layerNode.removeAttribute('id');
    window.location.hash = id;
    layerNode.setAttribute('id', id);
  }

  drawSynchroHover(synchroHoverId) {
    this.synchroHoverNodeArray.forEach((synchroHoverNode) => {
      if (synchroHoverNode.dataset.immerserSynchroHover === synchroHoverId) {
        synchroHoverNode.classList.add('_hover');
      } else {
        synchroHoverNode.classList.remove('_hover');
      }
    });
  }

  adjustScroll() {
    const { layerTop, layerBottom } = this.stateArray[this.reactiveActiveLayer.value];
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

  onDOMChange() {
    this.setSizes();
    this.draw();
  }

  handleScroll() {
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

  handleResize() {
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

import { DEFAULTS, DEFAULT_OPTIONS } from './defaults.js';
import createObservable from 'create-observable';
import mergeOptions from '@dubaua/merge-options/dist/merge-options.min.js';
import * as utils from './utils.js';

export default class Immerser {
  constructor(userOptions) {
    this.initState();
    this.init(userOptions);
  }

  initState() {
    this.options = { ...DEFAULTS };
    this.statemap = [];
    this.isBound = false;
    this.isCustomMarkup = false;
    this.immerserNode = null;
    this.pagerNode = null;
    this.originalChildrenNodeList = null;
    this.immerserMaskNodeArray = [];
    this.synchroHoverNodeArray = [];
    this.documentHeight = 0;
    this.windowHeight = 0;
    this.immerserTop = 0;
    this.immerserHeight = 0;
    this.resizeTimerId = null;
    this.scrollTimerId = null;
    this.reactiveSynchroHoverId = createObservable();
    this.reactiveActiveLayer = createObservable();
    this.reactiveWindowWidth = createObservable();
    this.onResize = null;
    this.onScroll = null;
  }

  init(userOptions) {
    this.options = {
      ...this.options,
      ...mergeOptions({
        defaults: DEFAULT_OPTIONS,
        userOptions,
        warnPreffix: 'immerser:',
        warnSuffix: 'Check out documentation https://github.com/dubaua/immerser#options',
      }),
    };
    this.immerserNode = document.querySelector(this.options.selectorImmerser);
    if (!this.immerserNode) {
      console.warn(
        'immerser: immerser element not found. Check out documentation https://github.com/dubaua/immerser#how-to-use',
      );
      return;
    }

    this.initStatemap();
    this.setSizes();

    this.onScroll = this.handleScroll.bind(this);
    this.onResize = this.handleResize.bind(this);

    window.addEventListener('scroll', this.onScroll, false);
    window.addEventListener('resize', this.onResize, false);

    if (typeof this.options.onInit === 'function') {
      this.options.onInit(this);
    }
  }

  initStatemap() {
    const layerNodeList = document.querySelectorAll(this.options.selectorLayer);
    utils.forEachNode(layerNodeList, (layerNode, layerIndex) => {
      let solidClassnames = this.options.solidClassnameArray[layerIndex];
      if (layerNode.dataset.immerserLayerConfig) {
        try {
          solidClassnames = JSON.parse(layerNode.dataset.immerserLayerConfig);
        } catch (e) {
          console.error('Failed to parse JSON class configuration.', e);
        }
      }

      let id = layerNode.id;
      if (!id) {
        id = `immerser-section-${layerIndex}`;
        layerNode.id = id;
        layerNode.__immerserCustomId = true;
      }

      this.statemap.push({
        node: layerNode,
        id,
        solidClassnames,
        top: 0,
        bottom: 0,
      });
    });
  }

  setSizes() {
    // set window sizes
    this.documentHeight = document.documentElement.offsetHeight;
    this.windowHeight = window.innerHeight;

    // set immerserSizes
    this.immerserTop = this.immerserNode.offsetTop;
    this.immerserHeight = this.immerserNode.offsetHeight;

    // set layer sizes
    this.statemap = this.statemap.map(state => {
      const top = state.node.offsetTop;
      const bottom = top + state.node.offsetHeight;
      return {
        ...state,
        top,
        bottom,
      };
    });

    // set statemap
    this.statemap = this.statemap.map((state, index) => {
      const isFirst = index === 0;
      const isLast = index === this.statemap.length - 1;

      // actually not 0 and this.documentHeight but start of first and end of last.
      const enter = isFirst ? 0 : this.statemap[index - 1].bottom - this.immerserTop;
      const startEnter = isFirst ? 0 : enter - this.immerserHeight;
      const leave = isLast ? this.documentHeight : this.statemap[index].bottom - this.immerserTop;
      const startLeave = isLast ? this.documentHeight : leave - this.immerserHeight;

      return {
        ...state,
        startEnter,
        enter,
        startLeave,
        leave,
      };
    });

    this.reactiveWindowWidth.onChange = nextWindowWidth => {
      if (nextWindowWidth >= this.options.fromViewportWidth) {
        if (!this.isBound) {
          this.bind();
        }
      } else if (this.isBound) {
        this.unbind();
      }
    };
    this.reactiveWindowWidth.value = window.innerWidth;
  }

  initCallbacks() {
    this.reactiveActiveLayer.onChange = nextIndex => {
      if (!this.isBound) return;

      // draw active pager link
      if (this.pagerNode) {
        this.drawPagerLinks(nextIndex);
      }

      // update hash if the option passed
      if (this.options.hasToUpdateHash) {
        this.updateHash(nextIndex);
      }

      // fire callback function if the option passed
      if (typeof this.options.onActiveLayerChange === 'function') {
        this.options.onActiveLayerChange(nextIndex, this);
      }
    };
  }

  createPagerLinks() {
    const { classnamePager, classnamePagerLink } = this.options;
    this.pagerNode.classList.add(classnamePager);

    this.statemap.forEach((state, index) => {
      const pagerLinkNode = document.createElement('a');
      pagerLinkNode.classList.add(classnamePagerLink);
      pagerLinkNode.href = `#${state.id}`;

      // store stateIndex in data attribute because it cloned properly
      pagerLinkNode.dataset.immerserStateIndex = index;

      // bind attribute to synchronize pager link hover
      pagerLinkNode.dataset.immerserSynchroHover = `pager-link-${index}`;

      this.pagerNode.appendChild(pagerLinkNode);

      state.pagerLinkNodeArray = [];
    });
  }

  initPagerLinks() {
    const pagerLinkNodelist = this.immerserNode.querySelectorAll(this.options.selectorPagerLink);
    utils.forEachNode(pagerLinkNodelist, pagerLinkNode => {
      const stateIndex = pagerLinkNode.dataset.immerserStateIndex;
      this.statemap[stateIndex].pagerLinkNodeArray.push(pagerLinkNode);
    });
  }

  initHoverSynchro(synchroHoverNodeList) {
    this.reactiveSynchroHoverId.onChange = nextId => {
      this.drawSynchroHover(nextId);
    };

    utils.forEachNode(synchroHoverNodeList, synchroHoverNode => {
      const handleMouseOver = e => {
        const synchroHoverId = e.target.dataset.immerserSynchroHover;
        this.reactiveSynchroHoverId.value = synchroHoverId;
      };
      synchroHoverNode.addEventListener('mouseover', handleMouseOver);
      synchroHoverNode.__immerserHandleMouseOver = handleMouseOver;

      const handleMouseOut = () => {
        this.reactiveSynchroHoverId.value = undefined;
      };
      synchroHoverNode.addEventListener('mouseout', handleMouseOut);
      synchroHoverNode.__immerserHandleMouseOut = handleMouseOut;

      this.synchroHoverNodeArray.push(synchroHoverNode);
    });
  }

  createMasks() {
    const maskStyles = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: 'hidden',
    };

    this.originalChildrenNodeList = this.immerserNode.querySelectorAll(this.options.selectorSolid);
    utils.bindStyles(this.immerserNode, { pointerEvents: 'none', touchAction: 'none' });

    const customMaskNodeList = this.immerserNode.querySelectorAll(this.options.selectorMask);
    this.isCustomMarkup = customMaskNodeList.length === this.statemap.length;
    if (customMaskNodeList.length > 0 && customMaskNodeList.length !== this.statemap.length) {
      // further possible to explicitly pass mask index
      console.warn(
        "immerser: You're trying use custom markup, but count of your immerser masks doesn't equal layers count. Check out documentation https://github.com/dubaua/immerser#custom-markup",
      );
    }

    // since custom child wrapped in ignoring pointer and touch events immerser mask, we should explicitly set them on
    utils.forEachNode(customMaskNodeList, customMaskNode => {
      const customChildrenHTMLCollection = customMaskNode.querySelector(this.options.selectorMaskInner).children;
      for (let i = 0; i < customChildrenHTMLCollection.length; i++) {
        utils.bindStyles(customChildrenHTMLCollection[i], { pointerEvents: 'all', touchAction: 'auto' });
      }
    });

    this.statemap = this.statemap.map((state, stateIndex) => {
      // create or assign existing markup, bind styles
      const maskNode = this.isCustomMarkup ? customMaskNodeList[stateIndex] : document.createElement('div');
      utils.bindStyles(maskNode, maskStyles);
      const maskInnerNode = this.isCustomMarkup
        ? maskNode.querySelector(this.options.selectorMaskInner)
        : document.createElement('div');
      utils.bindStyles(maskInnerNode, maskStyles);

      // clone solids to innerMask
      utils.forEachNode(this.originalChildrenNodeList, childNode => {
        const clonnedChildNode = childNode.cloneNode(true);
        utils.bindStyles(clonnedChildNode, { pointerEvents: 'all', touchAction: 'auto' });
        clonnedChildNode.immerserClonned = true;
        maskInnerNode.appendChild(clonnedChildNode);
      });

      // assing class modifiers to clonned solids
      const clonedSolidNodeList = maskInnerNode.querySelectorAll(this.options.selectorSolid);
      utils.forEachNode(clonedSolidNodeList, clonedSolidNode => {
        const solidId = clonedSolidNode.dataset.immerserSolid;
        if (state.solidClassnames && state.solidClassnames.hasOwnProperty(solidId)) {
          clonedSolidNode.classList.add(state.solidClassnames[solidId]);
        }
      });

      // a11y
      if (stateIndex !== 0) {
        maskNode.setAttribute('aria-hidden', 'true');
      }

      maskNode.appendChild(maskInnerNode);
      this.immerserNode.appendChild(maskNode);

      this.immerserMaskNodeArray.push(maskNode);

      return { ...state, maskNode, maskInnerNode };
    });

    // detach original solid nodes
    utils.forEachNode(this.originalChildrenNodeList, childNode => {
      this.immerserNode.removeChild(childNode);
    });
  }

  bind() {
    this.pagerNode = document.querySelector(this.options.selectorPager);
    if (this.pagerNode) {
      this.createPagerLinks();
    }

    this.initCallbacks();

    this.createMasks();

    if (this.pagerNode) {
      this.initPagerLinks();
    }

    const synchroHoverNodeList = document.querySelectorAll(this.options.selectorSynchroHover);
    if (synchroHoverNodeList.length) {
      this.initHoverSynchro(synchroHoverNodeList);
    }

    if (typeof this.options.onBind === 'function') {
      this.options.onBind(this);
    }

    this.isBound = true;

    this.draw();
    if (this.pagerNode) {
      this.drawPagerLinks(this.reactiveActiveLayer.value);
    }
  }

  unbind() {
    // detach hover syncro
    this.synchroHoverNodeArray.forEach(synchroHoverNode => {
      synchroHoverNode.removeEventListener('mouseover', synchroHoverNode.__immerserHandleMouseOver);
      synchroHoverNode.removeEventListener('mouseout', synchroHoverNode.__immerserHandleMouseOut);
    });

    this.statemap.forEach(state => {
      // clear pagerLinkNodeArray
      state.pagerLinkNodeArray = [];
      // clear custom id on layers
      if (state.node.__immerserCustomId) {
        state.node.removeAttribute('id');
      }
    });

    // restore original children
    utils.forEachNode(this.originalChildrenNodeList, childNode => {
      this.immerserNode.appendChild(childNode);
    });

    // remove all but custom elements, remove attributes
    this.immerserMaskNodeArray.forEach(immerserMaskNode => {
      // if mask was created
      if (this.isCustomMarkup) {
        // clear mask attributes
        immerserMaskNode.removeAttribute('style');
        immerserMaskNode.removeAttribute('aria-hidden');
        // clear innerMask
        const immerserMaskInnerNode = immerserMaskNode.querySelector(this.options.selectorMaskInner);
        immerserMaskInnerNode.removeAttribute('style');
        // clear clonned solids
        const clonnedSolidNodeList = immerserMaskInnerNode.querySelectorAll(this.options.selectorSolid);
        utils.forEachNode(clonnedSolidNodeList, clonnedSolideNode => {
          if (clonnedSolideNode.immerserClonned) {
            immerserMaskInnerNode.removeChild(clonnedSolideNode);
          }
        });
      } else {
        this.immerserNode.removeChild(immerserMaskNode);
      }
    });

    this.pagerNode.innerHTML = '';

    if (typeof this.options.onUnbind === 'function') {
      this.options.onUnbind(this);
    }

    this.isBound = false;

    this.reactiveActiveLayer.value = undefined;
  }

  destroy() {
    this.unbind();

    window.removeEventListener('scroll', this.onScroll, false);
    window.removeEventListener('resize', this.onResize, false);

    if (typeof this.options.onDestroy === 'function') {
      this.options.onDestroy(this);
    }

    this.initState();
  }

  draw() {
    const { y } = utils.getLastScrollPosition();
    this.statemap.forEach(({ startEnter, enter, startLeave, leave, maskNode, maskInnerNode, top, bottom }, index) => {
      let progress;

      if (startEnter > y) {
        progress = this.immerserHeight;
      } else if (startEnter <= y && y < enter) {
        progress = enter - y;
      } else if (enter <= y && y < startLeave) {
        progress = 0;
      } else if (startLeave <= y && y < leave) {
        progress = startLeave - y;
      } else if (y >= leave) {
        progress = -this.immerserHeight;
      }

      maskNode.style.transform = `translateY(${progress}px)`;
      maskInnerNode.style.transform = `translateY(${-progress}px)`;

      const pagerScrollActivePoint = y + this.windowHeight * (1 - this.options.pagerThreshold);
      if (top <= pagerScrollActivePoint && pagerScrollActivePoint < bottom) {
        this.reactiveActiveLayer.value = index;
      }
    });
  }

  drawPagerLinks() {
    this.statemap.forEach(({ pagerLinkNodeArray }) => {
      pagerLinkNodeArray.forEach(pagerLinkNode => {
        if (parseInt(pagerLinkNode.dataset.immerserStateIndex, 10) === this.reactiveActiveLayer.value) {
          pagerLinkNode.classList.add(this.options.classnamePagerLinkActive);
        } else {
          pagerLinkNode.classList.remove(this.options.classnamePagerLinkActive);
        }
      });
    });
  }

  drawSynchroHover(synchroHoverId) {
    this.synchroHoverNodeArray.forEach(synchroHoverNode => {
      if (synchroHoverNode.dataset.immerserSynchroHover === synchroHoverId) {
        synchroHoverNode.classList.add('_hover');
      } else {
        synchroHoverNode.classList.remove('_hover');
      }
    });
  }

  updateHash(stateIndex) {
    const currentState = this.statemap[stateIndex];
    const nextHash = currentState.id;
    // this prevent move to anchor
    currentState.node.removeAttribute('id');
    window.location.hash = nextHash;
    currentState.node.setAttribute('id', nextHash);
  }

  adjustScroll() {
    const { top, bottom } = this.statemap[this.reactiveActiveLayer.value];
    const { x, y } = utils.getLastScrollPosition();
    const topThreshold = Math.abs(y - top);
    const bottomThreshold = Math.abs(y + this.windowHeight - bottom);

    if (topThreshold !== 0 && bottomThreshold !== 0) {
      if (topThreshold <= bottomThreshold && topThreshold <= this.options.scrollAdjustThreshold) {
        window.scrollTo(x, top);
      } else if (bottomThreshold <= topThreshold && bottomThreshold <= this.options.scrollAdjustThreshold) {
        window.scrollTo(x, bottom - this.windowHeight);
      }
    }
  }

  handleScroll() {
    if (this.isBound) {
      this.draw();
      if (this.options.hasToUpdateHash && this.options.scrollAdjustThreshold > 0) {
        if (this.scrollTimerId) clearTimeout(this.scrollTimerId);
        this.scrollTimerId = setTimeout(() => {
          this.adjustScroll();
        }, this.options.scrollAdjustDelay);
      }
    }
  }

  handleResize() {
    if (this.resizeTimerId) window.cancelAnimationFrame(this.resizeTimerId);
    this.resizeTimerId = window.requestAnimationFrame(() => {
      this.setSizes();
      this.draw();
    });
  }
}

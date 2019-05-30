export default class Immerser {
  constructor(options) {
    this.defaults = {
      // not redefineable defaults
      selectorImmerser: '[data-immerser]',
      selectorLayer: '[data-immerser-layer]',
      selectorSolid: '[data-immerser-solid]',
      selectorPager: '[data-immerser-pager]',
      selectorMask: '[data-immerser-mask]',
      selectorMaskInner: '[data-immerser-mask-inner]',
      selectorSynchroHover: '[data-immerser-synchro-hover]',
      classnameImmerser: 'immerser',
      classnameImmerserMask: 'immerser__mask',
      classnameImmerserSolid: 'immerser__solid',

      // redefineable defaults
      solidClassnameArray: {
        defaultValue: [],
        description: 'non empty array of objects',
        validator: x => Array.isArray(x) && x.length !== 0,
      },
      fromViewportWidth: {
        defaultValue: 1024,
        description: 'a natural number',
        validator: x => typeof x === 'number' && 0 <= x && x % 1 === 0,
      },
      pagerTreshold: {
        defaultValue: 0.5,
        description: 'a number between 0 and 1',
        validator: x => typeof x === 'number' && 0 <= x && x <= 1,
      },
      stylesInCSS: {
        defaultValue: false,
        description: 'boolean',
        validator: x => typeof x === 'boolean',
      },
      synchroHoverPagerLinks: {
        defaultValue: false,
        description: 'boolean',
        validator: x => typeof x === 'boolean',
      },
      classnamePager: {
        defaultValue: 'pager',
        description: 'valid non empty classname string',
        validator: this.classnameValidator,
      },
      classnamePagerLink: {
        defaultValue: 'pager__link',
        description: 'valid non empty classname string',
        validator: this.classnameValidator,
      },
      classnamePagerLinkActive: {
        defaultValue: 'pager__link--active',
        description: 'valid non empty classname string',
        validator: this.classnameValidator,
      },
      onInit: {
        defaultValue: null,
        description: 'function',
        validator: x => typeof x === 'function',
      },
      onActiveLayerChange: {
        defaultValue: null,
        description: 'function',
        validator: x => typeof x === 'function',
      },
    };

    this.initState();
    this.init(options);
  }

  initState() {
    this.options = {};
    this.statemap = [];
    this.immerserNode = null;
    this.pagerNode = null;
    this.immerserMaskNodeArray = [];
    this.originalChildrenNodeList = [];
    this.documentHeight = 0;
    this.windowHeight = 0;
    this.resizeTimerId = null;
    this.activeLayer = null;
    this.activeSynchroHoverId = null;
    this.synchroHoverNodeArray = [];
  }

  init(options) {
    this.mergeOptions(options);
    if (window.innerWidth < this.options.fromViewportWidth) {
      return;
    }

    this.immerserNode = document.querySelector(this.options.selectorImmerser);
    if (!this.immerserNode) {
      console.warn('Immerser element not found. Check documentation https://github.com/dubaua/immerser#how-to-use');
      return;
    }

    this.initStatemap();
    this.setWindowSizes();
    this.setLayerSizes();
    this.setStatemap();
    this.initPager();
    this.createPagerLinks();
    this.initDOMStructure();
    this.initPagerLinks();
    this.initHoverSynchro();
    this.draw();

    window.addEventListener('scroll', this.draw.bind(this), false);
    window.addEventListener('resize', this.onResize.bind(this), false);

    if (typeof this.options.onInit === 'function') {
      this.options.onInit(this);
    }
  }

  mergeOptions(options = {}) {
    for (const key in this.defaults) {
      if (typeof this.defaults[key].validator !== 'function') {
        this.options[key] = this.defaults[key];
      } else {
        const { defaultValue, description, validator } = this.defaults[key];
        this.options[key] = defaultValue;
        if (options.hasOwnProperty(key)) {
          const value = options[key];
          if (validator(value)) {
            this.options[key] = value;
          } else {
            console.warn(
              `Expected ${key} is ${description}, got <${typeof value}> ${value}. Fallback to default value ${defaultValue}. Check documentation https://github.com/dubaua/immerser#options`
            );
          }
        }
      }
    }
  }

  initStatemap() {
    const layerNodeList = document.querySelectorAll(this.options.selectorLayer);
    this.forEachNode(layerNodeList, (layerNode, layerIndex) => {
      let solidClassnames = this.options.solidClassnameArray[layerIndex];
      if (layerNode.dataset.immerserLayerConfig) {
        try {
          solidClassnames = JSON.parse(layerNode.dataset.immerserLayerConfig);
        } catch (e) {
          console.error('Failed to parse JSON class configuration.', e);
        }
      }
      this.statemap.push({
        node: layerNode,
        solidClassnames,
        top: 0,
        bottom: 0,
      });
    });
  }

  setWindowSizes() {
    this.documentHeight = document.documentElement.offsetHeight;
    this.windowHeight = window.innerHeight;
  }

  setLayerSizes() {
    this.statemap = this.statemap.map(state => {
      const top = state.node.offsetTop;
      const bottom = top + state.node.offsetHeight;
      return {
        ...state,
        top,
        bottom,
      };
    });
  }

  setStatemap() {
    const immerserHeight = this.immerserNode.offsetHeight;
    const immerserTop = this.immerserNode.offsetTop;

    this.statemap = this.statemap.map((state, index) => {
      const isFirst = index === 0;
      const isLast = index === this.statemap.length - 1;

      // actually not 0 and this.documentHeight but start of first and end of last.
      const enter = isFirst ? 0 : this.statemap[index - 1].bottom - immerserTop;
      const startEnter = isFirst ? 0 : enter - immerserHeight;
      const leave = isLast ? this.documentHeight : this.statemap[index].bottom - immerserTop;
      const startLeave = isLast ? this.documentHeight : leave - immerserHeight;

      return {
        ...state,
        startEnter,
        enter,
        startLeave,
        leave,
        height: immerserHeight,
      };
    });
  }

  initPager() {
    this.pagerNode = document.querySelector(this.options.selectorPager);
    if (!this.pagerNode) return;

    this.activeLayer = createObservable(undefined, nextIndex => {
      this.drawPagerLinks(nextIndex);
      if (typeof this.options.onActiveLayerChange === 'function') {
        this.options.onActiveLayerChange(nextIndex, this);
      }
    });
  }

  createPagerLinks() {
    if (!this.pagerNode) return;

    const { classnamePager, classnamePagerLink } = this.options;
    this.pagerNode.classList.add(classnamePager);

    this.statemap.forEach((state, index) => {
      let layerId = state.node.id;

      // if no layerId create it, to point anchor to
      if (layerId === '') {
        layerId = `immerser-section-${index}`;
        state.node.id = layerId;
      }

      const pagerLinkNode = document.createElement('a');
      pagerLinkNode.classList.add(classnamePagerLink);
      pagerLinkNode.href = `#${layerId}`;
      // not the best way to store index for
      pagerLinkNode.dataset.stateIndex = index;

      // if passed synchronize pager link hover bind attribute
      if (this.options.synchroHoverPagerLinks) {
        pagerLinkNode.dataset.immerserSynchroHover = `pager-link-${index}`;
      }

      this.pagerNode.appendChild(pagerLinkNode);

      state.pagerLinkNodeArray = [];
    });
  }

  initDOMStructure() {
    const maskStyles = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: 'hidden',
    };

    const { classnameImmerser, classnameImmerserMask, classnameImmerserSolid } = this.options;
    this.originalChildrenNodeList = this.immerserNode.querySelectorAll(this.options.selectorSolid);
    this.bindClassOrStyle(this.immerserNode, classnameImmerser, { pointerEvents: 'none' });

    const customMaskNodeList = this.immerserNode.querySelectorAll(this.options.selectorMask);
    const isCustomMarkup = customMaskNodeList.length === this.statemap.length;
    if (customMaskNodeList.length > 0 && customMaskNodeList.length !== this.statemap.length) {
      // further possible to explicitly pass mask index
      console.warn("You're trying use custom markup, but count of your immerser masks doesn't equal layers count.");
    }

    this.statemap = this.statemap.map((state, stateIndex) => {
      // create or assign existing markup, bind styles or classes
      const maskNode = isCustomMarkup ? customMaskNodeList[stateIndex] : document.createElement('div');
      this.bindClassOrStyle(maskNode, classnameImmerserMask, maskStyles);
      const maskInnerNode = isCustomMarkup
        ? maskNode.querySelector(this.options.selectorMaskInner)
        : document.createElement('div');
      this.bindClassOrStyle(maskInnerNode, classnameImmerserMask, maskStyles);

      // clone solids to innerMask
      this.forEachNode(this.originalChildrenNodeList, childNode => {
        const clonnedChildNode = childNode.cloneNode(true);
        this.bindClassOrStyle(clonnedChildNode, classnameImmerserSolid, { pointerEvents: 'all' });
        maskInnerNode.appendChild(clonnedChildNode);
      });

      // assing class modifiers to clonned solids
      const clonedSolidNodeList = maskInnerNode.querySelectorAll(this.options.selectorSolid);
      this.forEachNode(clonedSolidNodeList, clonedSolidNode => {
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

    // remove original solid nodes
    this.forEachNode(this.originalChildrenNodeList, childNode => {
      this.immerserNode.removeChild(childNode);
    });
  }

  initPagerLinks() {
    if (!this.pagerNode) return;
    const pagerLinkHTMLCollection = this.immerserNode.getElementsByClassName(this.options.classnamePagerLink);
    for (let index = 0; index < pagerLinkHTMLCollection.length; index++) {
      const pagerLinkNode = pagerLinkHTMLCollection[index];
      const stateIndex = pagerLinkNode.dataset.stateIndex;
      this.statemap[stateIndex].pagerLinkNodeArray.push(pagerLinkNode);
    }
  }

  initHoverSynchro() {
    const synchroHoverNodeList = document.querySelectorAll(this.options.selectorSynchroHover);
    if (!synchroHoverNodeList.length) return;

    this.activeSynchroHoverId = createObservable(undefined, nextId => {
      this.drawSynchroHover(nextId);
    });

    this.forEachNode(synchroHoverNodeList, synchroHoverNode => {
      const synchroHoverId = synchroHoverNode.dataset.immerserSynchroHover;

      synchroHoverNode.addEventListener('mouseover', () => {
        this.activeSynchroHoverId.value = synchroHoverId;
      });

      synchroHoverNode.addEventListener('mouseout', () => {
        this.activeSynchroHoverId.value = undefined;
      });

      this.synchroHoverNodeArray.push(synchroHoverNode);
    });
  }

  draw() {
    const y = this.getLastScrollPositionY();
    this.statemap.forEach(
      ({ startEnter, enter, startLeave, leave, height, maskNode, maskInnerNode, top, bottom }, index) => {
        let progress;

        if (startEnter > y) progress = height;

        if (startEnter <= y && y < enter) progress = enter - y;

        if (enter <= y && y < startLeave) progress = 0;

        if (startLeave <= y && y < leave) progress = startLeave - y;

        if (y >= leave) progress = -height;

        maskNode.style.transform = `translateY(${progress}px)`;
        maskInnerNode.style.transform = `translateY(${-progress}px)`;

        if (this.pagerNode) {
          const pagerScrollActivePoint = y + this.windowHeight * (1 - this.options.pagerTreshold);
          if (top <= pagerScrollActivePoint && pagerScrollActivePoint < bottom) {
            this.activeLayer.value = index;
          }
        }
      }
    );
  }

  drawPagerLinks() {
    this.statemap.forEach(({ pagerLinkNodeArray }) => {
      pagerLinkNodeArray.forEach(pagerLinkNode => {
        if (parseInt(pagerLinkNode.dataset.stateIndex, 10) === this.activeLayer.value) {
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

  onResize() {
    if (this.resizeTimerId) window.cancelAnimationFrame(this.resizeTimerId);
    this.resizeTimerId = window.requestAnimationFrame(() => {
      this.setWindowSizes();
      this.setLayerSizes();
      this.setStatemap();
      this.draw();
    });
  }

  destroy() {
    this.forEachNode(this.originalChildrenNodeList, childNode => {
      this.immerserNode.appendChild(childNode);
    });

    this.immerserMaskNodeArray.forEach(immerserMaskNode => {
      this.immerserNode.removeChild(immerserMaskNode);
    });

    this.pagerNode.innerHTML = '';

    this.initState();

    window.removeEventListener('scroll', this.draw, false);
    window.removeEventListener('resize', this.onResize, false);
  }

  // utils
  getLastScrollPositionY() {
    // limit scroll position between 0 and document height in case of iOS overflow scroll
    return Math.min(Math.max(document.documentElement.scrollTop, 0), this.documentHeight);
  }

  applyStyles({ style }, styles) {
    for (const rule in styles) {
      style[rule] = styles[rule];
    }
  }

  bindClassOrStyle(node, classname, styles) {
    if (this.options.stylesInCSS) {
      node.classList.add(classname);
    } else {
      this.applyStyles(node, styles);
    }
  }

  forEachNode(nodeList, callback) {
    for (let index = 0; index < nodeList.length; index++) {
      const node = nodeList[index];
      callback(node, index, nodeList);
    }
  }

  classnameValidator(string) {
    return typeof string === 'string' && string !== '' && /^[a-z_-][a-z\d_-]*$/i.test(string);
  }
}

function createObservable(initial, didSet) {
  return {
    internal: initial,
    get value() {
      return this.internal;
    },
    set value(next) {
      if (next !== this.internal) {
        this.internal = next;
        didSet(this.internal);
      }
    },
  };
}

export default class Immerser {
  constructor(options) {
    this.defaults = {
      // not redefineable defaults
      selectorImmerser: '[data-immerser]',
      selectorLayer: '[data-immerser-layer]',
      selectorSolid: '[data-immerser-solid]',
      selectorPager: '[data-immerser-pager]',
      classnameImmerser: 'immerser',
      classnameImmerserWrapper: 'immerser__wrapper',
      classnameImmerserMask: 'immerser__mask',
      classnameImmerserSolid: 'immerser__solid',

      // redefineable defaults
      solidClassnameArray: {
        defaultValue: [],
        description: 'non empty array of objects',
        validator: x => Array.isArray(x) && x.length !== 0,
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
  }

  init(options) {
    this.mergeOptions(options);

    this.immerserNode = document.querySelector(this.options.selectorImmerser);
    if (!this.immerserNode) {
      console.warn('Immerser element not found. Check documentation https://github.com/dubaua/immerser');
      return;
    }

    this.initStatemap();
    this.setWindowSizes();
    this.setLayerSizes();
    this.setStatemap();
    this.initPager();
    this.createPagerLinks();
    this.createDOMStructure();
    this.initPagerLinks();
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
              `Expected ${key} is ${description}, got <${typeof value}> ${value}. Fallback to default value ${defaultValue}.`
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
      this.pagerNode.appendChild(pagerLinkNode);

      state.pagerLinkNodeArray = [];
    });
  }

  createDOMStructure() {
    const maskAndWrapperStyles = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: 'hidden',
    };

    const { classnameImmerser, classnameImmerserWrapper, classnameImmerserMask, classnameImmerserSolid } = this.options;
    this.originalChildrenNodeList = this.immerserNode.querySelectorAll(this.options.selectorSolid);
    this.bindClassOrStyle(this.immerserNode, classnameImmerser, { pointerEvents: 'none' });

    this.statemap = this.statemap.map((state, stateIndex) => {
      const wrapper = document.createElement('div');
      this.bindClassOrStyle(wrapper, classnameImmerserWrapper, maskAndWrapperStyles);

      this.forEachNode(this.originalChildrenNodeList, childNode => {
        const clonnedChildNode = childNode.cloneNode(true);
        this.bindClassOrStyle(clonnedChildNode, classnameImmerserSolid, { pointerEvents: 'all' });
        wrapper.appendChild(clonnedChildNode);
      });

      // TODO achieve hovering with linking clonned elements

      const clonedSolidNodeList = wrapper.querySelectorAll(this.options.selectorSolid);
      this.forEachNode(clonedSolidNodeList, ({ dataset, classList }) => {
        const solidId = dataset.immerserSolid;
        if (state.solidClassnames && state.solidClassnames.hasOwnProperty(solidId)) {
          classList.add(state.solidClassnames[solidId]);
        }
      });

      const mask = document.createElement('div');
      this.bindClassOrStyle(mask, classnameImmerserMask, maskAndWrapperStyles);

      if (stateIndex !== 0) {
        mask.setAttribute('aria-hidden', 'true');
      }
      mask.appendChild(wrapper);
      this.immerserNode.appendChild(mask);

      state.maskNode = mask;
      state.wrapperNode = wrapper;
      this.immerserMaskNodeArray.push(mask);

      return state;
    });

    this.forEachNode(this.originalChildrenNodeList, childNode => {
      childNode.style.display = 'none';
      childNode.setAttribute('aria-hidden', 'true');
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

  draw() {
    const y = this.getLastScrollPositionY();
    this.statemap.forEach(
      ({ startEnter, enter, startLeave, leave, height, maskNode, wrapperNode, top, bottom }, index) => {
        let progress;

        if (startEnter > y) progress = height;

        if (startEnter <= y && y < enter) progress = enter - y;

        if (enter <= y && y < startLeave) progress = 0;

        if (startLeave <= y && y < leave) progress = startLeave - y;

        if (y >= leave) progress = -height;

        maskNode.style.transform = `translateY(${progress}px)`;
        wrapperNode.style.transform = `translateY(${-progress}px)`;

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
      pagerLinkNodeArray.forEach(({ classList, dataset }) => {
        if (parseInt(dataset.stateIndex, 10) === this.activeLayer.value) {
          classList.add(this.options.classnamePagerLinkActive);
        } else {
          classList.remove(this.options.classnamePagerLinkActive);
        }
      });
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
      childNode.style.display = null;
      childNode.removeAttribute('aria-hidden');
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

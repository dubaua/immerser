export default class Immerser {
  constructor(options) {
    this.defaults = {
      immerserSelector: {
        defaultValue: '[data-immerser]',
        description: 'non empty .js- preffixed classname or data-attribute selector',
        validator: this.selectorValidator,
      },
      layerSelector: {
        defaultValue: '[data-immerser-classnames]',
        description: 'non empty .js- preffixed classname or data-attribute selector',
        validator: this.selectorValidator,
      },
      solidSelector: {
        defaultValue: '[data-immerser-solid-id]',
        description: 'non empty .js- preffixed classname or data-attribute selector',
        validator: this.selectorValidator,
      },
      pagerSelector: {
        defaultValue: '[data-immerser-pager]',
        description: 'non empty .js- preffixed classname or data-attribute selector',
        validator: this.selectorValidator,
      },
      solidClassnames: {
        defaultValue: null,
        description: 'non empty array of objects',
        validator: x => Array.isArray(x) && x.length !== 0,
      },
      pagerTreshold: {
        defaultValue: 0.5,
        description: 'a number between 0 and 1',
        validator: x => typeof x === 'number' && 0 <= x && x <= 1,
      },
      immerserClassname: {
        defaultValue: 'immerser',
        description: 'valid non empty classname string',
        validator: this.classnameValidator,
      },
      immerserWrapperClassname: {
        defaultValue: 'immerser__wrapper',
        description: 'valid non empty classname string',
        validator: this.classnameValidator,
      },
      immerserMaskClassname: {
        defaultValue: 'immerser__mask',
        description: 'valid non empty classname string',
        validator: this.classnameValidator,
      },
      pagerClassname: {
        defaultValue: 'pager',
        description: 'valid non empty classname string',
        validator: this.classnameValidator,
      },
      pagerLinkClassname: {
        defaultValue: 'pager__link',
        description: 'valid non empty classname string',
        validator: this.classnameValidator,
      },
      pagerLinkActiveClassname: {
        defaultValue: 'pager__link--active',
        description: 'valid non empty classname string',
        validator: this.classnameValidator,
      },
    };

    // state
    this.options = {};
    this.states = [];
    this.immerserNode = null;
    this.pagerNode = null;
    this.documentHeight = 0;
    this.windowHeight = 0;
    this.resizeTimerId = null;

    // TODO user defined solid layout

    for (const key in this.defaults) {
      const { defaultValue, description, validator } = this.defaults[key];
      this.options[key] = defaultValue;
      if (options.hasOwnProperty(key)) {
        const value = options[key];
        if (validator(value)) {
          this.options[key] = value;
        } else {
          console.warn(
            `Expected ${key} is ${description}, got ${typeof value} ${value}. Fallback to default value ${defaultValue}.`
          );
        }
      }
    }

    this.init();
    this.setWindowSizes();
    this.setLayerSizes();
    this.setStates();
    this.createPagerLinks(options);
    this.createDOMStructure();
    this.initPagerLinks();
    this.draw();

    window.addEventListener('scroll', this.draw.bind(this), false);
    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  init() {
    this.immerserNode = document.querySelector(this.options.immerserSelector);
    if (!this.immerserNode) {
      console.warn('Immerser element not found. Check documentation https://github.com/dubaua/immerser');
    }

    const layerNodeList = document.querySelectorAll(this.options.layerSelector);
    this.forEachNode(layerNodeList, layerNode => {
      if (layerNode.dataset.immerserClassnames) {
        try {
          const layerClassnames = JSON.parse(layerNode.dataset.immerserClassnames);
          this.options.solidClassnames.push(layerClassnames);
        } catch (e) {
          console.error('Failed to parse JSON class configuration.', e);
        }
      }

      this.states.push({
        node: layerNode,
        top: 0,
        bottom: 0,
      });
    });

    if (!this.options.solidClassnames) {
      console.warn('No class configuration found');
    }
  }

  setWindowSizes() {
    this.documentHeight = document.documentElement.offsetHeight;
    this.windowHeight = window.innerHeight;
  }

  setLayerSizes() {
    this.states = this.states.map(state => {
      const top = state.node.offsetTop;
      const bottom = top + state.node.offsetHeight;
      return {
        ...state,
        top,
        bottom,
      };
    });
  }

  setStates() {
    this.states = this.states.map((state, index) => {
      const isFirst = index === 0;
      const isLast = index === this.states.length - 1;

      const immerserHeight = this.immerserNode.offsetHeight;
      const immerserTop = this.immerserNode.offsetTop;

      // actually not 0 and this.documentHeight but start of first and end of last.
      const startEnter = isFirst ? 0 : immerserTop + this.states[index - 1].top; // == previous start
      const enter = isFirst ? 0 : startEnter + immerserHeight;
      const startLeave = isLast ? this.documentHeight : immerserTop + this.states[index].top;
      const leave = isLast ? this.documentHeight : startLeave + immerserHeight;

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

  createPagerLinks() {
    this.pagerNode = document.querySelector(this.options.pagerSelector);
    if (!this.pagerNode) return;

    const { pagerClassname, pagerLinkClassname } = this.options;
    this.pagerNode.classList.add(pagerClassname);

    this.states.forEach((state, index) => {
      let layerId = state.node.id;

      // if no layerId create it, to point anchor to
      if (layerId === '') {
        layerId = `immerser-section-${index}`;
        state.node.id = layerId;
      }

      const pagerLinkNode = document.createElement('a');
      pagerLinkNode.classList.add(pagerLinkClassname);
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

    const { immerserClassname, immerserWrapperClassname, immerserMaskClassname } = this.options;
    const originalChildrenNodeList = this.immerserNode.querySelectorAll(this.options.solidSelector);
    this.immerserNode.classList.add(immerserClassname);

    this.states = this.states.map((state, stateIndex) => {
      const wrapper = document.createElement('div');
      this.applyStyles(wrapper, maskAndWrapperStyles);
      wrapper.classList.add(immerserWrapperClassname);

      this.forEachNode(originalChildrenNodeList, childNode => {
        const clonnedChildNode = childNode.cloneNode(true);
        wrapper.appendChild(clonnedChildNode);
        // TODO remove original children. mess with DOM
      });

      // TODO achieve hovering with linking clonned elements

      const clonedSolidNodeList = wrapper.querySelectorAll(this.options.solidSelector);
      this.forEachNode(clonedSolidNodeList, ({ dataset, classList }) => {
        const solidId = dataset.immerserSolidId;
        if (this.options.solidClassnames && this.options.solidClassnames[stateIndex].hasOwnProperty(solidId)) {
          classList.add(this.options.solidClassnames[stateIndex][solidId]);
        }
      });

      const mask = document.createElement('div');
      this.applyStyles(mask, maskAndWrapperStyles);
      mask.classList.add(immerserMaskClassname);

      if (stateIndex !== 0) {
        mask.setAttribute('aria-hidden', 'true');
      }
      mask.appendChild(wrapper);
      this.immerserNode.appendChild(mask);

      state.maskNode = mask;
      state.wrapperNode = wrapper;
      return state;
    });
  }

  initPagerLinks() {
    if (!this.pagerNode) return;
    const pagerLinkHTMLCollection = this.immerserNode.getElementsByClassName(this.options.pagerLinkClassname);
    for (let index = 0; index < pagerLinkHTMLCollection.length; index++) {
      const pagerLinkNode = pagerLinkHTMLCollection[index];
      const stateIndex = pagerLinkNode.dataset.stateIndex;
      this.states[stateIndex].pagerLinkNodeArray.push(pagerLinkNode);
    }
  }

  draw() {
    const y = this.getLastScrollPositionY();
    this.states.forEach(
      ({ startEnter, enter, startLeave, leave, height, maskNode, wrapperNode, top, bottom, pagerLinkNodeArray }) => {
        let progress;
        if (startEnter > y) {
          progress = height;
        } else if (startEnter <= y && y < enter) {
          progress = enter - y;
        } else if (enter <= y && y < startLeave) {
          progress = 0;
        } else if (startLeave <= y && y < leave) {
          progress = startLeave - y;
        } else {
          progress = -height;
        }
        maskNode.style.transform = `translateY(${progress}px)`;
        wrapperNode.style.transform = `translateY(${-progress}px)`;

        if (this.pagerNode) {
          const pagerScrollActivePoint = y + this.windowHeight * (1 - this.options.pagerTreshold);
          if (top <= pagerScrollActivePoint && pagerScrollActivePoint < bottom) {
            pagerLinkNodeArray.forEach(({ classList }) => {
              classList.add(this.options.pagerLinkActiveClassname);
            });
          } else {
            pagerLinkNodeArray.forEach(({ classList }) => {
              classList.remove(this.options.pagerLinkActiveClassname);
            });
          }
        }
      }
    );
  }

  onResize() {
    // TODO maybe refactor on requestAnimationFrame
    // simlpe debouncer
    clearTimeout(this.resizeTimerId);
    this.resizeTimerId = setTimeout(() => {
      this.setWindowSizes();
      this.setLayerSizes();
      this.setStates();
      this.draw();
    }, 16);
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

  forEachNode(nodeList, callback) {
    for (let index = 0; index < nodeList.length; index++) {
      const node = nodeList[index];
      callback(node, index, nodeList);
    }
  }

  classnameValidator(string) {
    return typeof string === 'string' && string !== '' && /^[a-z_-][a-z\d_-]*$/i.test(string);
  }

  selectorValidator(string) {
    return typeof string === 'string' && string !== '' && /\.js\-[a-z-_]+|\[[a-z]+(\-[a-z]+)*\]/.test(string);
  }
}

export default class Immerser {
  constructor(options) {
    this.defaults = {
      immerserSelector: '[data-immerser]',
      layerSelector: '[data-immerser-classnames]',
      solidSelector: '[data-immerser-solid-id]',
      pagerSelector: '[data-immerser-pager]',
      solidClassnames: null,
      pagerTreshold: 0.5,
      classnames: {
        immerser: 'immerser',
        immerserWrapper: 'immerser__wrapper',
        immerserMask: 'immerser__mask',
        pager: 'pager',
        pagerLink: 'pager__link',
        pagerLinkActive: 'pager__link--active',
      },
    };

    // TODO user defined solid layout

    // TODO validate options
    this.options = { ...this.defaults, ...options };

    // state
    this.immerserNode = null;
    this.immerserClassnames = [];
    this.states = [];
    this.documentHeight = 0;
    this.windowHeight = 0;
    this.resizeTimerId = null;

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

    if (this.options.solidClassnames) {
      this.immerserClassnames = this.options.solidClassnames;
    }
    const layerNodeList = document.querySelectorAll(this.options.layerSelector);
    this.forEachNode(layerNodeList, layerNode => {
      if (!this.options.solidClassnames) {
        this.immerserClassnames.push(JSON.parse(layerNode.dataset.immerserClassnames));
      }
      this.states.push({
        node: layerNode,
        top: 0,
        bottom: 0,
      });
    });
    // warn if no classnames given
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
    const pagerNode = document.querySelector(this.options.pagerSelector);
    if (!pagerNode) return;

    const { pager, pagerLink } = this.options.classnames;
    pagerNode.classList.add(pager);

    this.states.forEach((state, index) => {
      let layerId = state.node.id;

      // if no layerId create it, to point anchor to
      if (layerId === '') {
        layerId = `immerser-section-${index}`;
        state.node.id = layerId;
      }

      const pagerLinkNode = document.createElement('a');
      pagerLinkNode.classList.add(pagerLink);
      pagerLinkNode.href = `#${layerId}`;
      // not the best way to store index for
      pagerLinkNode.dataset.stateIndex = index;
      pagerNode.appendChild(pagerLinkNode);

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

    const { immerser, immerserWrapper, immerserMask } = this.options.classnames;
    const originalChildrenNodeList = this.immerserNode.querySelectorAll(this.options.solidSelector);
    this.immerserNode.classList.add(immerser);

    this.states = this.states.map((state, stateIndex) => {
      const wrapper = document.createElement('div');
      this.applyStyles(wrapper, maskAndWrapperStyles);
      wrapper.classList.add(immerserWrapper);

      this.forEachNode(originalChildrenNodeList, childNode => {
        const clonnedChildNode = childNode.cloneNode(true);
        wrapper.appendChild(clonnedChildNode);
        // TODO remove original children. mess with DOM
      });

      const clonedSolidNodeList = wrapper.querySelectorAll(this.options.solidSelector);
      this.forEachNode(clonedSolidNodeList, ({ dataset, classList }) => {
        const solidId = dataset.immerserSolidId;
        if (this.immerserClassnames[stateIndex].hasOwnProperty(solidId)) {
          classList.add(this.immerserClassnames[stateIndex][solidId]);
        }
      });

      const mask = document.createElement('div');
      this.applyStyles(mask, maskAndWrapperStyles);
      mask.classList.add(immerserMask);

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
    const pagerLinkHTMLCollection = this.immerserNode.getElementsByClassName(this.options.classnames.pagerLink);
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

        // check if pager
        const pagerScrollActivePoint = y + this.windowHeight * this.options.pagerTreshold;
        if (top <= pagerScrollActivePoint && pagerScrollActivePoint < bottom) {
          pagerLinkNodeArray.forEach(({ classList }) => {
            classList.add(this.options.classnames.pagerLinkActive);
          });
        } else {
          pagerLinkNodeArray.forEach(({ classList }) => {
            classList.remove(this.options.classnames.pagerLinkActive);
          });
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
}

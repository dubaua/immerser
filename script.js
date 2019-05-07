class Immerser {
  constructor() {
    this.layerNodeArray = Array.from(document.querySelectorAll('[data-immerser-config]'));
    this.solidNodeArray = Array.from(document.querySelectorAll('[data-immerser-id]'));
    this.documentHeight = 0;
    this.windowHeight = 0;
    this.lastScrollPositionY = this.getLastScrollPositionY();
    this.solids = {};
    this.layers = {};
    this.resizeTimerId = null;

    this.setWindowSizes();
    this.initLayers();
    this.initSolids();
    this.setStates();
    this.createDOMStructure();
    this.setSolidSizes();
    this.drawSolids();

    // bind context to access methods inside listeners
    this.drawSolids = this.drawSolids.bind(this);
    this.onResize = this.onResize.bind(this);

    window.addEventListener('scroll', this.drawSolids, false);
    window.addEventListener('resize', this.onResize, false);
  }

  initLayers() {
    this.layers = this.layerNodeArray.map(layer => {
      const solidClassConfig = JSON.parse(layer.dataset.immerserConfig);
      delete layer.dataset.immerserConfig;
      return {
        node: layer,
        solidClassConfig,
      };
    });
  }

  initSolids() {
    this.solids = this.solidNodeArray.map((solid, index) => {
      const solidId = solid.dataset.immerserId;
      delete solid.dataset.immerserId;

      return {
        id: solidId,
        node: solid,
        originalChildren: null,
        states: this.layers.map((layer, index) => ({ layerIndex: index })),
      };
    });
  }

  setStates() {
    this.layers.forEach((layer, layerIndex) => {
      const layerStart = layer.node.offsetTop;
      const layerEnd = layerStart + layer.node.offsetHeight;

      this.solids.forEach((solid, solidIndex) => {
        // actually here we should check top and bottom layers, not top and bottom of document
        const isFirst = layerIndex === 0;
        const isLast = layerIndex === this.layers.length - 1;

        const prevState = isFirst ? null : this.solids[solidIndex].states[layerIndex - 1];

        const height = solid.node.offsetHeight;
        const leave = isLast ? this.documentHeight : this.windowHeight - solid.node.offsetTop + layerStart;
        const startLeave = isLast ? this.documentHeight : leave - height;
        const enter = isFirst ? 0 : prevState.leave;
        const startEnter = isFirst ? 0 : enter - height;

        const nextState = {
          className: this.layers[layerIndex].solidClassConfig[solid.id],
          layerIndex,
          startEnter,
          enter,
          startLeave,
          leave,
          height,
        };

        this.solids[solidIndex].states.forEach(state => {
          if (state.layerIndex === nextState.layerIndex) {
            state = Object.assign(state, nextState);
          }
        });
      });
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

    this.solids.forEach(solid => {
      solid.originalChildren = Array.from(solid.node.children);
      solid.states.forEach((state, stateIndex) => {
        const wrapper = document.createElement('div');
        this.applyStyles(wrapper, maskAndWrapperStyles);
        state.wrapperNode = wrapper;

        solid.originalChildren.forEach(child => wrapper.appendChild(child.cloneNode(true)));

        const mask = document.createElement('div');
        this.applyStyles(mask, maskAndWrapperStyles);
        state.maskNode = mask;

        if (stateIndex !== 0) {
          mask.setAttribute('aria-hidden', 'true');
        }

        if (state.className) {
          mask.classList.add(state.className);
        }
        mask.appendChild(wrapper);
        solid.node.appendChild(mask);
      });
    });
  }

  setSolidSizes() {
    this.solids.forEach(solid => {
      // reset to original child sizes, show original child
      solid.originalChildren.forEach(child => (child.style.display = ''));
      this.applyStyles(solid.node, {
        width: null,
        height: null,
      });

      // get sizes
      const { width, height } = solid.node.getBoundingClientRect();

      // apply sizes
      this.applyStyles(solid.node, {
        overflow: 'hidden',
        width: width + 'px',
        height: height + 'px',
      });

      // hide
      solid.originalChildren.forEach(child => (child.style.display = 'none'));
    });
  }

  setWindowSizes() {
    this.documentHeight = document.documentElement.offsetHeight;
    this.windowHeight = window.innerHeight;
  }

  onResize() {
    // simlpe debouncer
    // TODO refactor on requestAnimationFrame
    clearTimeout(this.resizeTimerId);
    this.resizeTimerId = setTimeout(() => {
      this.setWindowSizes();
      this.setSolidSizes();
      this.setStates();
      this.drawSolids();
    }, 16);
  }

  drawSolids() {
    const y = this.getLastScrollPositionY();
    for (const solidId in this.solids) {
      const solidConfig = this.solids[solidId];
      solidConfig.states.forEach(({ startEnter, enter, startLeave, leave, height, maskNode, wrapperNode }) => {
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
      });
    }
  }

  // utils
  getLastScrollPositionY() {
    // limit scroll position between 0 and document height in case of iOS overflow scroll
    return Math.min(Math.max(document.documentElement.scrollTop, 0), this.documentHeight);
  }

  applyStyles(node, styles) {
    for (const rule in styles) {
      node.style[rule] = styles[rule];
    }
  }
}

const myImmerser = new Immerser();

class Immerser {
  constructor() {
    this.layers = Array.from(document.querySelectorAll('[data-immerser-config]'));
    this.solids = Array.from(document.querySelectorAll('[data-immerser-id]'));
    this.documentHeight = 0;
    this.windowHeight = 0;
    this.lastScrollPositionY = this.getLastScrollPositionY();
    this.config = {};
    this.classConfig = {};
    this.resizeTimerId = null;

    this.updateWindowSizes();
    this.getSolidConfig();
    this.setSizesAndStates(true);
    this.applyStyles();
    this.createDOMStructure();
    this.drawSolids();

    // bind context to access methods inside listeners
    this.drawSolids = this.drawSolids.bind(this);
    this.onResize = this.onResize.bind(this);

    window.addEventListener('scroll', this.drawSolids, false);
    window.addEventListener('resize', this.onResize, false);
  }

  getSolidConfig() {
    this.config = this.solids.reduce((accumulator, solid) => {
      const solidId = solid.dataset.immerserId;
      delete solid.dataset.immerserId;

      accumulator[solidId] = {
        id: solidId,
        node: solid,
        states: [],
      };

      return accumulator;
    }, {});
  }

  applyStyles(node, styles) {
    for (const rule in styles) {
      node.style[rule] = styles[rule];
    }
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

    for (const solidId in this.config) {
      const solidConfig = this.config[solidId];
      const solidNode = solidConfig.node;
      this.applyStyles(solidNode, {
        overflow: 'hidden',
        // +1 px because offsetWidth/offsetHeight doesn't return fractional part
        width: solidNode.offsetWidth + 1 + 'px',
        height: solidNode.offsetHeight + 1 + 'px',
      });

      const fixedChildren = Array.from(solidNode.children);

      solidConfig.states.forEach((state, index) => {
        const mask = document.createElement('div');
        this.applyStyles(mask, maskAndWrapperStyles);

        const wrapper = document.createElement('div');
        this.applyStyles(wrapper, maskAndWrapperStyles);

        fixedChildren.forEach(child => wrapper.appendChild(child.cloneNode(true)));

        if (index !== 0) {
          mask.setAttribute('aria-hidden', 'true');
        }

        if (state.className) {
          mask.classList.add(state.className);
        }

        state.maskNode = mask;
        state.wrapperNode = wrapper;

        mask.appendChild(wrapper);
        solidNode.appendChild(mask);
      });

      fixedChildren.forEach(child => child.style.display = 'none');
    }
  }

  setSizesAndStates(isInitial) {
    this.layers.forEach((layer, index) => {
      if (isInitial) {
        this.classConfig[layer.id] = JSON.parse(layer.dataset.immerserConfig);
        delete layer.dataset.immerserConfig;
      }

      const layerStart = layer.offsetTop;
      const layerEnd = layerStart + layer.offsetHeight;

      for (const solidId in this.config) {
        const solidNode = this.config[solidId].node;
        const isFirst = index === 0;
        const isLast = index === this.layers.length - 1;

        const prevConfig = isFirst ? null : this.config[solidId].states[index - 1];

        const height = solidNode.offsetHeight;
        const leave = isLast ? this.documentHeight : this.windowHeight - solidNode.offsetTop + layerStart;
        const startLeave = isLast ? this.documentHeight : leave - height;
        const enter = isFirst ? 0 : prevConfig.leave;
        const startEnter = isFirst ? 0 : enter - height;

        const state = {
          id: layer.id,
          className: this.classConfig[layer.id][solidId],
          startEnter,
          enter,
          startLeave,
          leave,
          height,
        };

        if (isInitial) {
          this.config[solidId].states.push(state);
        } else {
          this.config[solidId].states.forEach(prevState => {
            if (prevState.id === state.id) {
              prevState = Object.assign(prevState, state);
            }
          });
        }
      }
    });
  }

  getLastScrollPositionY() {
    // limit scroll position between 0 and document height in case of iOS overflow scroll
    return Math.min(Math.max(document.documentElement.scrollTop, 0), this.documentHeight);
  }

  updateWindowSizes() {
    this.documentHeight = document.documentElement.offsetHeight;
    this.windowHeight = window.innerHeight;
  }

  onResize() {
    // simlpe debouncer
    clearTimeout(this.resizeTimerId);
    this.resizeTimerId = setTimeout(() => {
      this.updateWindowSizes();
      this.updateSolidSizes();
      this.setSizesAndStates();
      this.drawSolids();
    }, 250);
  }

  drawSolids() {
    const y = this.getLastScrollPositionY();
    for (const solidId in this.config) {
      const solidConfig = this.config[solidId];
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
}

const myImmerser = new Immerser();

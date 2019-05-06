class Immerser {
  constructor(settings) {
    this.CLASSNAMES = {
      CROPPER: 'immerser-cropper',
      MASK: 'immerser-mask',
      WRAPPER: 'immerser-wrapper',
    };

    this.layers = Array.from(document.getElementsByClassName(settings.layerClassName));
    this.solids = Array.from(document.getElementsByClassName(settings.solidClassName));
    this.documentHeight = 0;
    this.windowHeight = 0;
    this.lastScrollPositionY = this.getLastScrollPositionY();
    this.config = {};

    this.drawFixedElements = this.drawFixedElements.bind(this);

    this.updateWindowSizes();

    // get fixed elements - solids, and create config for them
    this.config = this.solids.reduce((config, solid) => {
      const solidId = solid.dataset.immerserId;
      delete solid.dataset.immerserId;

      config[solidId] = {
        id: solidId,
        node: solid,
        states: [],
      };

      return config;
    }, {});

    this.layers.forEach((layer, index) => {
      // get classNames for solids from layer data attribute
      const classConfig = JSON.parse(layer.dataset.immerserConfig);
      delete layer.dataset.immerserConfig;

      const layerStart = layer.offsetTop;
      const layerEnd = layerStart + layer.offsetHeight;

      for (const solidId in classConfig) {
        if (this.config.hasOwnProperty(solidId)) {
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
            className: classConfig[solidId],
            startEnter,
            enter,
            startLeave,
            leave,
            height,
            maskNode: null,
            wrapperNode: null,
          };

          this.config[solidId].states.push(state);
        }
      }
    });

    // apply helper classes styles
    const helperStyles = `
        .${this.CLASSNAMES.CROPPER} {
          overflow: hidden;
        }
        .${this.CLASSNAMES.WRAPPER}, .${this.CLASSNAMES.MASK} {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: hidden;
        }
      `;
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(helperStyles.replace(/\s/g, '')));
    document.head.appendChild(styleElement);

    // create wrapper and mask for each solid
    for (const solidId in this.config) {
      const solidConfig = this.config[solidId];
      const solidNode = solidConfig.node;
      solidNode.classList.add(this.CLASSNAMES.CROPPER);
      solidNode.style.width = solidNode.offsetWidth + 1 + 'px';
      solidNode.style.height = solidNode.offsetHeight + 1 + 'px';

      const fixedChildren = Array.from(solidNode.children);
      solidNode.innerHTML = '';

      solidConfig.states.forEach((state, index) => {
        const mask = document.createElement('div');
        mask.classList.add(this.CLASSNAMES.MASK);

        const wrapper = document.createElement('div');
        wrapper.classList.add(this.CLASSNAMES.WRAPPER);

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
    }

    this.drawFixedElements();

    window.addEventListener('scroll', this.drawFixedElements, false);
    window.addEventListener('resize', this.updateWindowSizes, false);
  }

  getLastScrollPositionY() {
    // limit scroll position between 0 and document height in case of iOS overflow scroll
    return Math.min(Math.max(document.documentElement.scrollTop, 0), this.documentHeight);
  }

  updateWindowSizes() {
    // chcek if window height changed
    const newWindowHeight = window.innerHeight;
    if (this.windowHeight === newWindowHeight) {
      return;
    }

    // update windows
    this.documentHeight = document.documentElement.offsetHeight;
    this.windowHeight = newWindowHeight;

    // update crpper sized
    // TODO
  }

  drawFixedElements() {
    const y = this.getLastScrollPositionY();
    for (const solidId in this.config) {
      const solidConfig = this.config[solidId];
      solidConfig.states.forEach((state, index) => {
        let progress;
        if (state.startEnter > y) {
          progress = state.height;
        } else if (state.startEnter <= y && y < state.enter) {
          progress = state.enter - y;
        } else if (state.enter <= y && y < state.startLeave) {
          progress = 0;
        } else if (state.startLeave <= y && y < state.leave) {
          progress = state.startLeave - y;
        } else {
          progress = -state.height;
        }
        state.maskNode.style.transform = `translateY(${progress}px)`;
        state.wrapperNode.style.transform = `translateY(${-progress}px)`;
      });
    }
  }
}

const myImmerser = new Immerser({
  layerClassName: 'js-layer',
  solidClassName: 'js-solid',
});

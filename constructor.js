var immerser = function(options) {
  this.defaults = {
    immerserSelector: '[data-immerser]',
    layerSelector: '[data-immerser-classnames]',
    solidSelector: '[data-immerser-solid-id]',
    pagerSelector: '[data-immerser-pager]',
    solidClassnames: null,
    createPager: false,
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

  this.options = Object.assign({}, this.defaults, options);

  this.immerserNode = null;
  this.immerserClassnames = [];
  this.states = [];
  this.documentHeight = 0;
  this.windowHeight = 0;
  this.resizeTimerId = null;

  function init() {
    // init immerser
    this.immerserNode = document.querySelector(this.options.immerserSelector);

    if (!this.immerserNode) {
      console.warn('Immerser element not found. Check documentation https://github.com/dubaua/immerser');
    }

    // init layers
    // check if solidClassnames given in options
    if (this.options.solidClassnames) {
      this.immerserClassnames = this.options.solidClassnames;
    }
    var layerNodeArray = document.querySelectorAll(this.options.layerSelector);
    layerNodeArray.forEach(function(layerNode) {
      if (!this.options.solidClassnames) {
        this.immerserClassnames.push(JSON.parse(layerNode.dataset.immerserClassnames));
      }
      this.this.states.push({
        node: layerNode,
        top: 0,
        bottom: 0,
      });
    });
  }

  function setWindowSizes() {
    this.documentHeight = document.documentElement.offsetHeight;
    this.windowHeight = window.innerHeight;
  }

  function setLayerSizes() {
    this.this.states = this.this.states.map(function(state) {
      var top = state.node.offsetTop;
      var bottom = top + state.node.offsetHeight;
      return {
        ...state,
        top,
        bottom,
      };
    });
  }

  function setStates() {
    this.this.states = this.this.states.map(function(state, index) {
      var isFirst = index === 0;
      var isLast = index === this.this.states.length - 1;

      var immerserHeight = this.immerserNode.offsetHeight;
      var immerserTop = this.immerserNode.offsetTop;

      // actually not 0 and documentHeight but start of first and end of last.
      var startEnter = isFirst ? 0 : immerserTop + this.this.states[index - 1].top; // == previous start
      var enter = isFirst ? 0 : startEnter + immerserHeight;
      var startLeave = isLast ? this.documentHeight : immerserTop + this.this.states[index].top;
      var leave = isLast ? this.documentHeight : startLeave + immerserHeight;

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

  function createPagerLinks() {
    if (!this.options.createPager) return;
    var pagerNode = document.querySelector(this.options.pagerSelector);
    pagerNode.classList.add(this.options.classnames.pager);

    this.this.states.forEach(function(state, index) {
      var layerId = state.node.id;
      if (layerId === '') {
        layerId = 'immerser-section-' + index;
        state.node.id = layerId;
      }
      var pagerLinkNode = document.createElement('a');
      pagerLinkNode.classList.add(this.options.classnames.pagerLink);
      pagerLinkNode.href = '#' + layerId;
      pagerLinkNode.dataset.stateIndex = index;
      pagerNode.appendChild(pagerLinkNode);
      state.pagerLinkNodeArray = [];
    });
  }

  function createDOMStructure() {
    var maskAndWrapperStyles = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: 'hidden',
    };

    var originalChildrenNodeList = Array.from(immerserNode.children);
    this.immerserNode.classList.add(this.options.classnames.immerser);

    this.states = this.states.map(function(state, stateIndex) {
      var wrapper = document.createElement('div');
      applyStyles(wrapper, maskAndWrapperStyles);
      wrapper.classList.add(this.options.classnames.immerserWrapper);

      originalChildrenNodeList.forEach(function(childNode) {
        var clonnedChildNode = childNode.cloneNode(true);
        wrapper.appendChild(clonnedChildNode);
        childNode.remove();
      });

      var clonedSolidNodeList = wrapper.querySelectorAll(options.solidSelector);
      clonedSolidNodeList.forEach(function(clonnedSolidNode) {
        var solidId = clonnedSolidNode.dataset.immerserSolidId;
        if (this.immerserClassnames[stateIndex].hasOwnProperty(solidId)) {
          clonnedSolidNode.classList.add(this.immerserClassnames[stateIndex][solidId]);
        }
      });

      var mask = document.createElement('div');
      applyStyles(mask, maskAndWrapperStyles);
      mask.classList.add(this.options.classnames.immerserMask);

      if (stateIndex !== 0) {
        mask.setAttribute('aria-hidden', 'true');
      }

      mask.appendChild(wrapper);
      this.immerserNode.appendChild(mask);

      state.wrapperNode = wrapper;
      state.maskNode = mask;

      return state;
    });
  }
};

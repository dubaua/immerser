let layers = [];
let solids = [];
let documentHeight = 0;
let windowHeight = 0;
let resizeTimerId = null;

function initLayers({ layerSelector, solidClassnames }) {
  const layerNodeArray = Array.from(document.querySelectorAll(layerSelector));

  layers = layerNodeArray.map((layerNode, index) => {
    const classNames = solidClassnames ? solidClassnames[index] : JSON.parse(layerNode.dataset.immerserClassnames);
    delete layerNode.dataset.immerserConfig;

    return {
      node: layerNode,
      classNames,
    };
  });
}

function initSolids({ solidSelector, solidIds }) {
  const solidNodeArray = Array.from(document.querySelectorAll(solidSelector));

  solids = solidNodeArray.map((solidNode, index) => {
    const solidId = solidIds ? solidIds[index] : solidNode.dataset.immerserId;
    delete solidNode.dataset.immerserId;

    return {
      id: solidId,
      node: solidNode,
      originalChildren: null,
      states: layers.map((layer, index) => ({ layerIndex: index })),
    };
  });
}

function setStates() {
  layers.forEach((layer, layerIndex) => {
    const layerStart = layer.node.offsetTop;
    const layerEnd = layerStart + layer.node.offsetHeight;

    solids.forEach((solid, solidIndex) => {
      // actually here we should check top and bottom layers, not top and bottom of document
      const isFirst = layerIndex === 0;
      const isLast = layerIndex === layers.length - 1;

      const prevState = isFirst ? null : solids[solidIndex].states[layerIndex - 1];

      const height = solid.node.offsetHeight;
      const leave = isLast ? documentHeight : windowHeight - solid.node.offsetTop + layerStart;
      const startLeave = isLast ? documentHeight : leave - height;
      const enter = isFirst ? 0 : prevState.leave;
      const startEnter = isFirst ? 0 : enter - height;

      const nextState = {
        className: layers[layerIndex].classNames[solid.id],
        layerIndex,
        startEnter,
        enter,
        startLeave,
        leave,
        height,
      };

      solids[solidIndex].states.forEach(state => {
        if (state.layerIndex === nextState.layerIndex) {
          state = Object.assign(state, nextState);
        }
      });
    });
  });
}

function createDOMStructure() {
  const maskAndWrapperStyles = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  };

  solids.forEach(solid => {
    solid.originalChildren = Array.from(solid.node.children);
    solid.states.forEach((state, stateIndex) => {
      const wrapper = document.createElement('div');
      applyStyles(wrapper, maskAndWrapperStyles);
      state.wrapperNode = wrapper;

      solid.originalChildren.forEach(child => wrapper.appendChild(child.cloneNode(true)));

      const mask = document.createElement('div');
      applyStyles(mask, maskAndWrapperStyles);
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

function setSolidSizes() {
  solids.forEach(solid => {
    // reset to original child sizes, show original child
    solid.originalChildren.forEach(child => (child.style.display = ''));
    applyStyles(solid.node, {
      width: null,
      height: null,
    });

    // get sizes
    const { width, height } = solid.node.getBoundingClientRect();

    // apply sizes
    applyStyles(solid.node, {
      overflow: 'hidden',
      width: width + 'px',
      height: height + 'px',
    });

    // hide
    solid.originalChildren.forEach(child => (child.style.display = 'none'));
  });
}

function setWindowSizes() {
  documentHeight = document.documentElement.offsetHeight;
  windowHeight = window.innerHeight;
}

function onResize() {
  // simlpe debouncer
  // TODO refactor on requestAnimationFrame
  clearTimeout(resizeTimerId);
  resizeTimerId = setTimeout(() => {
    setWindowSizes();
    setSolidSizes();
    setStates();
    drawSolids();
  }, 16);
}

function drawSolids() {
  const y = getLastScrollPositionY();
  for (const solidId in solids) {
    const solidConfig = solids[solidId];
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
function getLastScrollPositionY() {
  // limit scroll position between 0 and document height in case of iOS overflow scroll
  return Math.min(Math.max(document.documentElement.scrollTop, 0), documentHeight);
}

function applyStyles(node, styles) {
  for (const rule in styles) {
    node.style[rule] = styles[rule];
  }
}

export default function immerser(_options) {
  const defaults = {
    layerSelector: '[data-immerser-classnames]',
    solidSelector: '[data-immerser-id]',
    solidClassnames: null,
    solidIds: null,
  };

  const options = Object.assign({}, defaults, _options);

  setWindowSizes();
  initLayers(options);
  initSolids(options);
  setStates();
  createDOMStructure();
  setSolidSizes();
  drawSolids();

  window.addEventListener('scroll', drawSolids, false);
  window.addEventListener('resize', onResize, false);

  return {
    solids,
    layers,
  };
}

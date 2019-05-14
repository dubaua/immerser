const defaults = {
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

let immerserNode = null;
let originalChildrenNodeList = [];
let immerserClassnames = [];
let layers = [];
let solids = [];
let states = [];
let documentHeight = 0;
let windowHeight = 0;
let resizeTimerId = null;
let options = {};

// TODO validate options

function init({ immerserSelector, layerSelector, solidClassnames, solidSelector }) {
  // init immerser
  immerserNode = document.querySelector(immerserSelector);

  if (!immerserNode) {
    console.warn('Immerser element not found. Check documentation https://github.com/dubaua/immerser');
  }

  // init layers
  // check if solidClassnames given in options
  if (solidClassnames) {
    immerserClassnames = solidClassnames;
  }
  const layerNodeArray = Array.from(document.querySelectorAll(layerSelector));
  layers = layerNodeArray.map((layerNode, index) => {
    if (!solidClassnames) {
      immerserClassnames.push(JSON.parse(layerNode.dataset.immerserClassnames));
    }
    return {
      node: layerNode,
      start: 0,
      end: 0,
    };
  });

  states = layers.map(() => ({}))
  // warn if no classnames given
}

function createPagerLinks({ pagerSelector, createPager, pagerClassnames }) {
  if (!createPager) return;
  const pagerNode = document.querySelector(pagerSelector);
  pagerNode.classList.add(pagerClassnames.root);
  layers.forEach((layer, index) => {
    let layerId = layer.node.id;
    if (layerId === '') {
      layerId = 'immerser-section-' + index;
      layer.node.id = layerId;
    }
    const pagerLinkNode = document.createElement('a');
    pagerLinkNode.classList.add(pagerClassnames.link);
    pagerLinkNode.href = '#' + layerId;
    layer.pagerLinkNodeArray.push(pagerLinkNode);
    pagerNode.appendChild(pagerLinkNode);
  });
}

function setStates() {
  states = states.map((state, index) => {
    const isFirst = index === 0;
    const isLast = index === layers.length - 1;

    const immerserHeight = immerserNode.offsetHeight;
    const immerserTop = immerserNode.offsetTop;

    // actually not 0 and documentHeight but start of first and end of last.
    const startEnter = isFirst ? 0 : immerserTop + layers[index - 1].start; // == previous start
    const enter = isFirst ? 0 : startEnter + immerserHeight;
    const startLeave = isLast ? documentHeight : immerserTop + layers[index].start;
    const leave = isLast ? documentHeight : startLeave + immerserHeight;
    const pagerActive = isFirst ? 0 : Math.floor(layers[index].start - windowHeight * options.pagerTreshold);

    return {
      startEnter,
      enter,
      startLeave,
      leave,
      height: immerserHeight,
      pagerActive,
      wrapperNode: state.wrapperNode || null,
      maskNode: state.maskNode || null,
    };
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

  const { immerser, immerserWrapper, immerserMask } = options.classnames;

  originalChildrenNodeList = Array.from(immerserNode.children);
  immerserNode.classList.add(immerser);

  states = states.map((state, stateIndex) => {
    const wrapper = document.createElement('div');
    applyStyles(wrapper, maskAndWrapperStyles);
    wrapper.classList.add(immerserWrapper);
    state.wrapperNode = wrapper;

    originalChildrenNodeList.forEach(childNode => {
      const clonnedChildNode = childNode.cloneNode(true);
      wrapper.appendChild(clonnedChildNode);
      childNode.remove();
    });

    const clonedSolidNodeList = wrapper.querySelectorAll(options.solidSelector);
    clonedSolidNodeList.forEach(clonnedSolidNode => {
      const solidId = clonnedSolidNode.dataset.immerserSolidId;
      if (immerserClassnames[stateIndex].hasOwnProperty(solidId)) {
        clonnedSolidNode.classList.add(immerserClassnames[stateIndex][solidId]);
      }
    });

    const mask = document.createElement('div');
    applyStyles(mask, maskAndWrapperStyles);
    mask.classList.add(immerserMask);
    state.maskNode = mask;

    if (stateIndex !== 0) {
      mask.setAttribute('aria-hidden', 'true');
    }

    mask.appendChild(wrapper);
    immerserNode.appendChild(mask);

    return state;
  });
}

function setLayerSizes() {
  layers.forEach(layer => {
    layer.start = layer.node.offsetTop;
    layer.end = layer.start + layer.node.offsetHeight;
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
    setLayerSizes();
    setStates();
    drawSolids();
    drawPager(options);
  }, 16);
}

function onScroll() {
  drawSolids();
  drawPager(options);
}

function drawSolids() {
  const y = getLastScrollPositionY();
  states.forEach(({ startEnter, enter, startLeave, leave, height, maskNode, wrapperNode }) => {
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

function drawPager({ pagerClassnames }) {
  // layers.forEach(layer => {
  //   const scrollCenter = getLastScrollPositionY() + windowHeight / 2;
  //   if (layer.start <= scrollCenter && scrollCenter < layer.end) {
  //     layer.pagerLinkNodeArray.forEach(link => {
  //       link.classList.add(pagerClassnames.active);
  //     });
  //   } else {
  //     layer.pagerLinkNodeArray.forEach(link => {
  //       link.classList.remove(pagerClassnames.active);
  //     });
  //   }
  // });
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
  options = Object.assign({}, defaults, _options);

  init(options);
  setWindowSizes();
  setLayerSizes();
  setStates();
  createPagerLinks(options);
  createDOMStructure();
  drawSolids();
  drawPager(options);

  window.addEventListener('scroll', onScroll, false);
  window.addEventListener('resize', onResize, false);

  return { states, immerserClassnames };
}

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
let immerserClassnames = [];
let states = [];
let documentHeight = 0;
let windowHeight = 0;
let resizeTimerId = null;
let options = {};

// TODO validate options

function init({ immerserSelector, layerSelector, solidClassnames }) {
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
  const layerNodeArray = document.querySelectorAll(layerSelector);
  layerNodeArray.forEach(layerNode => {
    // warn if no classnames given
    if (!solidClassnames) {
      immerserClassnames.push(JSON.parse(layerNode.dataset.immerserClassnames));
    }
    states.push({
      node: layerNode,
      top: 0,
      bottom: 0,
    });
  });
}

function setWindowSizes() {
  documentHeight = document.documentElement.offsetHeight;
  windowHeight = window.innerHeight;
}

function setLayerSizes() {
  states = states.map(state => {
    const top = state.node.offsetTop;
    const bottom = top + state.node.offsetHeight;
    return {
      ...state,
      top,
      bottom,
    };
  });
}

function setStates() {
  states = states.map((state, index) => {
    const isFirst = index === 0;
    const isLast = index === states.length - 1;

    const immerserHeight = immerserNode.offsetHeight;
    const immerserTop = immerserNode.offsetTop;

    // actually not 0 and documentHeight but start of first and end of last.
    const startEnter = isFirst ? 0 : immerserTop + states[index - 1].top; // == previous start
    const enter = isFirst ? 0 : startEnter + immerserHeight;
    const startLeave = isLast ? documentHeight : immerserTop + states[index].top;
    const leave = isLast ? documentHeight : startLeave + immerserHeight;

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

function createPagerLinks({ pagerSelector, createPager, classnames }) {
  if (!createPager) return;
  const { pager, pagerLink } = classnames;
  const pagerNode = document.querySelector(pagerSelector);
  pagerNode.classList.add(pager);

  states.forEach((state, index) => {
    let layerId = state.node.id;
    if (layerId === '') {
      layerId = 'immerser-section-' + index;
      state.node.id = layerId;
    }
    const pagerLinkNode = document.createElement('a');
    pagerLinkNode.classList.add(pagerLink);
    pagerLinkNode.href = '#' + layerId;
    pagerLinkNode.dataset.stateIndex = index;
    pagerNode.appendChild(pagerLinkNode);
    state.pagerLinkNodeArray = [];
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

  const originalChildrenNodeList = Array.from(immerserNode.children);
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

function initPagerLinks() {
  const pagerLinkHTMLCollection = immerserNode.getElementsByClassName(options.classnames.pagerLink);
  for (var index = 0; index < pagerLinkHTMLCollection.length; index++) {
    var pagerLinkNode = pagerLinkHTMLCollection[index];
    var stateIndex = pagerLinkNode.dataset.stateIndex;
    states[stateIndex].pagerLinkNodeArray.push(pagerLinkNode);
  }
}

function drawSolids() {
  const y = getLastScrollPositionY();
  states.forEach(
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
      const pagerScrollActivePoint = y + windowHeight * options.pagerTreshold;

      if (top <= pagerScrollActivePoint && pagerScrollActivePoint < bottom) {
        pagerLinkNodeArray.forEach(pagerLinkNode => {
          pagerLinkNode.classList.add(options.classnames.pagerLinkActive);
        });
      } else {
        pagerLinkNodeArray.forEach(pagerLinkNode => {
          pagerLinkNode.classList.remove(options.classnames.pagerLinkActive);
        });
      }
    }
  );
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
  }, 16);
}

function onScroll() {
  drawSolids();
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
  initPagerLinks();
  drawSolids();

  window.addEventListener('scroll', onScroll, false);
  window.addEventListener('resize', onResize, false);

  return { states, immerserClassnames };
}

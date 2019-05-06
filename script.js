// immerser
// submerger

// body, solid, corpus

// layer, stratum

const layers = Array.from(document.getElementsByClassName('js-layer'));
const solids = Array.from(document.getElementsByClassName('js-solid'));

const CLASSNAMES = {
  CROPPER: 'fixed-cropper',
  MASK: 'fixed-mask',
  WRAPPER: 'fixed-wrapper',
};

let immerserConfig = {};
let documentHeight = 0;
let windowHeight = 0;
let lastScrollPositionY = getLastScrollPositionY(documentHeight);

function init() {
  updateWindowSizes();

  // get fixed elements - solids, and create config for them
  immerserConfig = solids.reduce((config, solid) => {
    const solidId = solid.dataset.immerserId;
    delete solid.dataset.immerserId;

    config[solidId] = {
      id: solidId,
      node: solid,
      stateMap: [],
    };

    return config;
  }, {});

  layers.forEach((layer, index) => {
    // get classNames for solids from layer data attribute
    const classConfig = JSON.parse(layer.dataset.immerserConfig);
    delete layer.dataset.immerserConfig;

    layerStart = layer.offsetTop;
    layerEnd = layerStart + layer.offsetHeight;

    for (const solidId in classConfig) {
      if (immerserConfig.hasOwnProperty(solidId)) {
        const solidNode = immerserConfig[solidId].node;
        const isFirst = index === 0;
        const isLast = index === layers.length - 1;

        const prevConfig = isFirst ? null : immerserConfig[solidId].stateMap[index - 1];

        const height = solidNode.offsetHeight;
        const leave = isLast ? documentHeight : windowHeight - solidNode.offsetTop + layerStart;
        const startLeave = isLast ? documentHeight : leave - height;
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

        immerserConfig[solidId].stateMap.push(state);
      }
    }
  });

  // apply helper classes styles
  const helperStyles = `
    .${CLASSNAMES.CROPPER} {
      overflow: hidden;
    }
    .${CLASSNAMES.WRAPPER}, .${CLASSNAMES.MASK} {
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
  for (const solidId in immerserConfig) {
    const fixedElement = immerserConfig[solidId];
    const fixedElementNode = fixedElement.node;
    fixedElementNode.classList.add(CLASSNAMES.CROPPER);
    fixedElementNode.style.width = fixedElementNode.offsetWidth + 1 + 'px';
    fixedElementNode.style.height = fixedElementNode.offsetHeight + 1 + 'px';

    const fixedChildren = Array.from(fixedElementNode.children);
    fixedElementNode.innerHTML = '';

    fixedElement.stateMap.forEach((state, index) => {
      const mask = document.createElement('div');
      mask.classList.add(CLASSNAMES.MASK);

      const wrapper = document.createElement('div');
      wrapper.classList.add(CLASSNAMES.WRAPPER);

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
      fixedElementNode.appendChild(mask);
    });
  }

  drawFixedElements(lastScrollPositionY);
}

function updateWindowSizes() {
  // chcek if window height changed
  const newWindowHeight = window.innerHeight;
  if (windowHeight === newWindowHeight) {
    return;
  }

  // update windows
  documentHeight = document.documentElement.offsetHeight;
  windowHeight = newWindowHeight;

  // update crpper sized
  // TODO
}

window.addEventListener('scroll', onScroll, false);
window.addEventListener('resize', updateWindowSizes, false);

function onScroll(e) {
  lastScrollPositionY = getLastScrollPositionY(documentHeight);
  drawFixedElements(lastScrollPositionY);
}

function drawFixedElements(y) {
  for (const solidId in immerserConfig) {
    fixedElement = immerserConfig[solidId];
    fixedElement.stateMap.forEach((state, index) => {
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

function getLastScrollPositionY(documentHeight) {
  // limit scroll position between 0 and document height in case of iOS overflow scroll
  return Math.min(Math.max(document.documentElement.scrollTop, 0), documentHeight);
}

init();

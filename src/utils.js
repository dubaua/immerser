import { MESSAGE_PREFFIX } from '@/defaults.js';

export function bindStyles(node, styles) {
  for (const rule in styles) {
    node.style[rule] = styles[rule];
  }
}

export function forEachNode(nodeList, callback) {
  for (let index = 0; index < nodeList.length; index++) {
    const node = nodeList[index];
    callback(node, index, nodeList);
  }
}

export function getNodeArray({ selector, parent = document }) {
  if (!parent) {
    return [];
  }
  const nodeList = parent.querySelectorAll(selector);
  return [].slice.call(nodeList);
}

export function showError({ message, warning = false, docs }) {
  const docsHash = docs ? docs : '';
  const resultMessage = `${MESSAGE_PREFFIX} ${message} \nCheck out documentation https://github.com/dubaua/immerser${docsHash}`;
  if (warning) {
    console.warn(resultMessage);
  } else {
    throw new Error(resultMessage);
  }
}

export function isEmpty(obj) {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function limit(number, min, max) {
  return Math.max(Math.min(number, max), min);
}

export function getLastScrollPosition() {
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  // limit scroll position between 0 and document height in case of iOS overflow scroll
  return {
    x: limit(scrollX, 0, document.documentElement.offsetWidth),
    y: limit(scrollY, 0, document.documentElement.offsetHeight),
  };
}

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

export function getLastScrollPositionY() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  // limit scroll position between 0 and document height in case of iOS overflow scroll
  return Math.min(Math.max(scrollY, 0), document.documentElement.offsetHeight);
}

export function createObservable(didSet, initial) {
  return {
    internal: initial,
    callbacks: didSet ? [didSet] : [],
    get onChange() {
      return this.callbacks;
    },
    set onChange(didSet) {
      if (typeof didSet === 'function') {
        this.callbacks.push(didSet);
      }
    },
    get value() {
      return this.internal;
    },
    set value(next) {
      if (next !== this.internal) {
        this.internal = next;
        for (let i = 0; i < this.callbacks.length; i++) {
          this.callbacks[i](this.internal);
        }
      }
    },
  };
}

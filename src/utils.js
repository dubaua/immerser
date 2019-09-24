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

export function mergeAndValidateOptions(options = {}, defaults, context) {
  for (const key in defaults) {
    const { initial, description, validator } = defaults[key];
    context[key] = initial;
    if (options.hasOwnProperty(key)) {
      const value = options[key];
      if (validator(value)) {
        context[key] = value;
      } else {
        console.warn(
          `Expected ${key} is ${description}, got <${typeof value}> ${value}. Fallback to default value ${initial}. Check documentation https://github.com/dubaua/immerser#options`
        );
      }
    }
  }
}

const CLASSNAME_REGEX = /^[a-z_-][a-z\d_-]*$/i;

function classnameValidator(string) {
  return typeof string === 'string' && string !== '' && CLASSNAME_REGEX.test(string);
}

export const DEFAULTS = {
  // not redefineable defaults
  selectorImmerser: '[data-immerser]',
  selectorLayer: '[data-immerser-layer]',
  selectorSolid: '[data-immerser-solid]',
  selectorPager: '[data-immerser-pager]',
  selectorPagerLink: '[data-immerser-state-index]',
  selectorMask: '[data-immerser-mask]',
  selectorMaskInner: '[data-immerser-mask-inner]',
  selectorSynchroHover: '[data-immerser-synchro-hover]',
}

export const DEFAULT_OPTIONS = {
  // redefineable options
  solidClassnameArray: {
    initial: [],
    description: 'non empty array of objects',
    validator: x => Array.isArray(x) && x.length !== 0,
  },
  fromViewportWidth: {
    initial: 1024,
    description: 'a natural number',
    validator: x => typeof x === 'number' && 0 <= x && x % 1 === 0,
  },
  pagerThreshold: {
    initial: 0.5,
    description: 'a number between 0 and 1',
    validator: x => typeof x === 'number' && 0 <= x && x <= 1,
  },
  hasToUpdateHash: {
    initial: false,
    description: 'boolean',
    validator: x => typeof x === 'boolean',
  },
  scrollAdjustThreshold: {
    initial: 0,
    description: 'a number greater than or equal to 0',
    validator: x => typeof x === 'number' && x >= 0,
  },
  scrollAdjustDelay: {
    initial: 600,
    description: 'a number greater than or equal to 300',
    validator: x => typeof x === 'number' && x >= 300,
  },
  classnamePager: {
    initial: 'pager',
    description: 'valid non empty classname string',
    validator: classnameValidator,
  },
  classnamePagerLink: {
    initial: 'pager__link',
    description: 'valid non empty classname string',
    validator: classnameValidator,
  },
  classnamePagerLinkActive: {
    initial: 'pager__link--active',
    description: 'valid non empty classname string',
    validator: classnameValidator,
  },
  onInit: {
    initial: null,
    description: 'function',
    validator: x => typeof x === 'function',
  },
  onBind: {
    initial: null,
    description: 'function',
    validator: x => typeof x === 'function',
  },
  onUnbind: {
    initial: null,
    description: 'function',
    validator: x => typeof x === 'function',
  },
  onDestroy: {
    initial: null,
    description: 'function',
    validator: x => typeof x === 'function',
  },
  onActiveLayerChange: {
    initial: null,
    description: 'function',
    validator: x => typeof x === 'function',
  },
};

const CLASSNAME_REGEX = /^[a-z_-][a-z\d_-]*$/i;

function classnameValidator(string) {
  return typeof string === 'string' && string !== '' && CLASSNAME_REGEX.test(string);
}

export default {
  // not redefineable defaults
  selectorImmerser: '[data-immerser]',
  selectorLayer: '[data-immerser-layer]',
  selectorSolid: '[data-immerser-solid]',
  selectorPager: '[data-immerser-pager]',
  selectorPagerLink: '[data-immerser-state-index]',
  selectorMask: '[data-immerser-mask]',
  selectorMaskInner: '[data-immerser-mask-inner]',
  selectorSynchroHover: '[data-immerser-synchro-hover]',

  // redefineable defaults
  solidClassnameArray: {
    defaultValue: [],
    description: 'non empty array of objects',
    validator: x => Array.isArray(x) && x.length !== 0,
  },
  fromViewportWidth: {
    defaultValue: 1024,
    description: 'a natural number',
    validator: x => typeof x === 'number' && 0 <= x && x % 1 === 0,
  },
  pagerTreshold: {
    defaultValue: 0.5,
    description: 'a number between 0 and 1',
    validator: x => typeof x === 'number' && 0 <= x && x <= 1,
  },
  synchroHoverPagerLinks: {
    defaultValue: false,
    description: 'boolean',
    validator: x => typeof x === 'boolean',
  },
  updateHash: {
    defaultValue: false,
    description: 'boolean',
    validator: x => typeof x === 'boolean',
  },
  classnamePager: {
    defaultValue: 'pager',
    description: 'valid non empty classname string',
    validator: classnameValidator,
  },
  classnamePagerLink: {
    defaultValue: 'pager__link',
    description: 'valid non empty classname string',
    validator: classnameValidator,
  },
  classnamePagerLinkActive: {
    defaultValue: 'pager__link--active',
    description: 'valid non empty classname string',
    validator: classnameValidator,
  },
  onInit: {
    defaultValue: null,
    description: 'function',
    validator: x => typeof x === 'function',
  },
  onBind: {
    defaultValue: null,
    description: 'function',
    validator: x => typeof x === 'function',
  },
  onUnbind: {
    defaultValue: null,
    description: 'function',
    validator: x => typeof x === 'function',
  },
  onDestroy: {
    defaultValue: null,
    description: 'function',
    validator: x => typeof x === 'function',
  },
  onActiveLayerChange: {
    defaultValue: null,
    description: 'function',
    validator: x => typeof x === 'function',
  },
};

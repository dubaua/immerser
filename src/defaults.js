const CLASSNAME_REGEX = /^[a-z_-][a-z\d_-]*$/i;

function classnameValidator(string) {
  return typeof string === 'string' && string !== '' && CLASSNAME_REGEX.test(string);
}

const OPTION_CONFIG = {
  solidClassnameArray: {
    default: [],
    description: 'non empty array of objects',
    validator: x => Array.isArray(x) && x.length !== 0,
  },
  fromViewportWidth: {
    default: 0,
    description: 'a natural number',
    validator: x => typeof x === 'number' && 0 <= x && x % 1 === 0,
  },
  pagerThreshold: {
    default: 0.5,
    description: 'a number between 0 and 1',
    validator: x => typeof x === 'number' && 0 <= x && x <= 1,
  },
  hasToUpdateHash: {
    default: false,
    description: 'a boolean',
    validator: x => typeof x === 'boolean',
  },
  scrollAdjustThreshold: {
    default: 0,
    description: 'a number greater than or equal to 0',
    validator: x => typeof x === 'number' && x >= 0,
  },
  scrollAdjustDelay: {
    default: 600,
    description: 'a number greater than or equal to 300',
    validator: x => typeof x === 'number' && x >= 300,
  },
  pagerLinkActiveClassname: {
    default: 'pager-link-active',
    description: 'valid non empty classname string',
    validator: classnameValidator,
  },
  onInit: {
    default: null,
    description: 'a function',
    validator: x => typeof x === 'function',
  },
  onBind: {
    default: null,
    description: 'a function',
    validator: x => typeof x === 'function',
  },
  onUnbind: {
    default: null,
    description: 'a function',
    validator: x => typeof x === 'function',
  },
  onDestroy: {
    default: null,
    description: 'a function',
    validator: x => typeof x === 'function',
  },
  onActiveLayerChange: {
    default: null,
    description: 'a function',
    validator: x => typeof x === 'function',
  },
};

const MESSAGE_PREFFIX = '[immmerser:]';

module.exports = {
  OPTION_CONFIG,
  MESSAGE_PREFFIX
}
import type { OptionConfig } from '@dubaua/merge-options';
import { Options } from './types';

const CLASSNAME_REGEX = /^[a-z_-][a-z\d_-]*$/i;

function classnameValidator(str: string): boolean {
  return typeof str === 'string' && str !== '' && CLASSNAME_REGEX.test(str);
}

export const OPTION_CONFIG: OptionConfig<Options> = {
  solidClassnameArray: {
    default: [],
    description: 'non empty array of objects',
    validator: (x) => Array.isArray(x) && x.length !== 0,
  },
  fromViewportWidth: {
    default: 0,
    description: 'a natural number',
    validator: (x) => typeof x === 'number' && 0 <= x && x % 1 === 0,
  },
  pagerThreshold: {
    default: 0.5,
    description: 'a number between 0 and 1',
    validator: (x) => typeof x === 'number' && 0 <= x && x <= 1,
  },
  hasToUpdateHash: {
    default: false,
    description: 'a boolean',
    validator: (x) => typeof x === 'boolean',
  },
  scrollAdjustThreshold: {
    default: 0,
    description: 'a number greater than or equal to 0',
    validator: (x) => typeof x === 'number' && x >= 0,
  },
  scrollAdjustDelay: {
    default: 600,
    description: 'a number greater than or equal to 300',
    validator: (x) => typeof x === 'number' && x >= 300,
  },
  pagerLinkActiveClassname: {
    default: 'pager-link-active',
    description: 'valid non empty classname string',
    validator: classnameValidator,
  },
  isScrollHandled: {
    default: true,
    description: 'a boolean',
    validator: (x) => typeof x === 'boolean',
  },
  onInit: {
    default: null,
    description: 'a function',
    validator: (x) => typeof x === 'function',
  },
  onBind: {
    default: null,
    description: 'a function',
    validator: (x) => typeof x === 'function',
  },
  onUnbind: {
    default: null,
    description: 'a function',
    validator: (x) => typeof x === 'function',
  },
  onDestroy: {
    default: null,
    description: 'a function',
    validator: (x) => typeof x === 'function',
  },
  onActiveLayerChange: {
    default: null,
    description: 'a function',
    validator: (x) => typeof x === 'function',
  },
  onLayersUpdate: {
    default: null,
    description: 'a function',
    validator: (x) => typeof x === 'function',
  },
};

export const MESSAGE_PREFIX = '[immerser:]';

export const CROPPED_FULL_ABSOLUTE_STYLES: Record<string, string> = {
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  overflow: 'hidden',
};

export const NOT_INTERACTIVE_STYLES: Record<string, string> = {
  pointerEvents: 'none',
  touchAction: 'none',
};

export const INTERACTIVE_STYLES: Record<string, string> = {
  pointerEvents: 'all',
  touchAction: 'auto',
};

import type { OptionConfig } from '@dubaua/merge-options';
import type { EventName, Options } from './types';

const CLASSNAME_REGEX = /^[a-z_-][a-z\d_-]*$/i;

/** @public All available immerser event names. */
export const EVENT_NAMES = ['init', 'bind', 'unbind', 'destroy', 'activeLayerChange', 'layersUpdate'] as const;

function classnameValidator(str: string): boolean {
  return typeof str === 'string' && str !== '' && CLASSNAME_REGEX.test(str);
}

function onOptionValidator(on?: Options['on']): boolean {
  if (on === undefined) {
    return true;
  }
  if (!on || typeof on !== 'object' || Array.isArray(on)) {
    return false;
  }
  return Object.keys(on).every(
    (eventName) =>
      EVENT_NAMES.includes(eventName as EventName) &&
      (on as Record<string, unknown>)[eventName] !== undefined &&
      typeof (on as Record<string, unknown>)[eventName] === 'function',
  );
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
  on: {
    default: {},
    description: 'an object containing event handlers',
    validator: onOptionValidator,
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

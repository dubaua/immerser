import type { OptionConfig as MergeOptionConfig } from '@dubaua/merge-options';
import { EventNames } from './events';
import type { EventName, Options } from './types';

const ClassnameRegex = /^[a-z_-][a-z\d_-]*$/i;

export const InitialDebug = process.env.NODE_ENV === 'development';

function classnameValidator(str: string): boolean {
  return typeof str === 'string' && str !== '' && ClassnameRegex.test(str);
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
      EventNames.includes(eventName as EventName) &&
      (on as Record<string, unknown>)[eventName] !== undefined &&
      typeof (on as Record<string, unknown>)[eventName] === 'function',
  );
}

export const OptionConfig: MergeOptionConfig<Options> = {
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
  debug: {
    default: InitialDebug,
    description: 'a boolean',
    validator: (x) => typeof x === 'boolean',
  },
  on: {
    default: {},
    description: 'an object containing event handlers',
    validator: onOptionValidator,
  },
};

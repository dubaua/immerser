// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import ImmerserEngine from '../../engine/immerser-engine';
import ImmerserDomController from '../immerser-dom-controller';
import setupMarkup from './setup-markup.factory';
import type { DomControllerOptions, IImmerserDomControllerCallbacks } from '../types';

function createOptions(options: Partial<DomControllerOptions> = {}): DomControllerOptions {
  return {
    fromViewportWidth: 999999,
    hasToUpdateHash: false,
    isScrollHandled: true,
    pagerLinkActiveClassname: 'pager-link-active',
    scrollAdjustDelay: 600,
    scrollAdjustThreshold: 0,
    solidClassnamesByLayerId: {},
    ...options,
  };
}

function createCallbacks(): IImmerserDomControllerCallbacks {
  return {
    onActiveLayerChange: vi.fn(),
    onBind: vi.fn(),
    onDestroy: vi.fn(),
    onLayersUpdate: vi.fn(),
    onUnbind: vi.fn(),
    report: vi.fn(({ message }) => {
      throw new Error(message);
    }),
  };
}

function createController(options: Partial<DomControllerOptions> = {}): ImmerserDomController {
  return new ImmerserDomController({
    callbacks: createCallbacks(),
    engine: new ImmerserEngine({ pagerThreshold: 0.5 }),
    options: createOptions(options),
  });
}

describe('ImmerserDomController', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('accepts solid classname maps by layer id', () => {
    setupMarkup();
    const controller = createController({
      solidClassnamesByLayerId: {
        'first-layer': { logo: 'logo-first' },
        'second-layer': { logo: 'logo-second' },
      },
    });

    expect(() => controller.initialize()).not.toThrow();
  });

  it('rejects a non-object solid classnames map', () => {
    setupMarkup();
    const controller = createController({
      solidClassnamesByLayerId: [{ logo: 'logo-first' }] as any,
    });

    expect(() => controller.initialize()).toThrow('solidClassnamesByLayerId must be an object');
  });

  it('rejects a non-object solid classnames entry', () => {
    setupMarkup();
    const controller = createController({
      solidClassnamesByLayerId: { 'first-layer': 'logo-first' } as any,
    });

    expect(() => controller.initialize()).toThrow(
      'solidClassnamesByLayerId entries must map solid ids to classname strings',
    );
  });

  it('rejects a non-string solid classname', () => {
    setupMarkup();
    const controller = createController({
      solidClassnamesByLayerId: { 'first-layer': { logo: 1 } } as any,
    });

    expect(() => controller.initialize()).toThrow(
      'solidClassnamesByLayerId entries must map solid ids to classname strings',
    );
  });

  it('rejects an unknown layer id in solid classnames map', () => {
    setupMarkup();
    const controller = createController({
      solidClassnamesByLayerId: {
        'unknown-layer': { logo: 'logo-first' },
      },
    });

    expect(() => controller.initialize()).toThrow('solidClassnamesByLayerId contains unknown layer id "unknown-layer"');
  });
});

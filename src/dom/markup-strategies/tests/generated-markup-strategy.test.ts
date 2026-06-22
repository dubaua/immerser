// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import GeneratedMarkupStrategy from '../generated-markup-strategy';
import { ImmerserSelectors } from '../../selectors';
import createLayerStateArray from '../../tests/create-layer-state-array.factory';
import setupMarkup from '../../tests/setup-markup.factory';
import type { IReportParams } from '../../types';

describe('GeneratedMarkupStrategy', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('creates masks and connects them to layer states', () => {
    const { root } = setupMarkup();
    const strategy = new GeneratedMarkupStrategy({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    const layerStateArray = strategy.prepare(
      createLayerStateArray([{ logo: 'logo-first' }, { logo: 'logo-second' }]),
    );

    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(2);
    expect(root.querySelectorAll(ImmerserSelectors.maskInner)).toHaveLength(2);
    expect(layerStateArray.every(({ maskNode, maskInnerNode }) => maskNode && maskInnerNode)).toBe(true);
    expect(layerStateArray[0].maskNode?.getAttribute('aria-hidden')).toBe(null);
    expect(layerStateArray[1].maskNode?.getAttribute('aria-hidden')).toBe('true');
  });

  it('clones solids with layer-specific classnames and detaches originals', () => {
    const { root, solids } = setupMarkup();
    const strategy = new GeneratedMarkupStrategy({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    const initialLayerStateArray = createLayerStateArray([{ logo: 'logo-first' }, { logo: 'logo-second' }]);
    const layerStateArray = strategy.prepare(initialLayerStateArray);

    expect(layerStateArray[0].maskInnerNode?.querySelector('[data-immerser-solid="logo"]')?.classList).toContain(
      'logo-first',
    );
    expect(layerStateArray[1].maskInnerNode?.querySelector('[data-immerser-solid="logo"]')?.classList).toContain(
      'logo-second',
    );
    expect(root.querySelectorAll(ImmerserSelectors.solid)).toHaveLength(
      solids.length * initialLayerStateArray.length,
    );
    expect(solids.every((solid) => solid.parentNode === null)).toBe(true);
  });

  it('removes generated masks and restores original solids during cleanup', () => {
    const { root, solids } = setupMarkup();
    const strategy = new GeneratedMarkupStrategy({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });
    strategy.prepare(createLayerStateArray());

    strategy.cleanup();

    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(0);
    expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
  });

  it('preserves reusable custom mask nodes and their existing children during generated cleanup', () => {
    document.body.innerHTML = `
      <div data-immerser style="color: red;">
        <a data-immerser-solid="logo">Logo</a>
        <div data-immerser-mask><div data-immerser-mask-inner><span data-client-child="0" style="color: blue;"></span></div></div>
        <div data-immerser-mask aria-hidden="false"><div data-immerser-mask-inner><span data-client-child="1"></span></div></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const initialOuterHtml = root.outerHTML;
    const masks = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.mask));
    const clientChildren = Array.from(root.querySelectorAll<HTMLElement>('[data-client-child]'));
    const strategy = new GeneratedMarkupStrategy({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });
    strategy.prepare(createLayerStateArray());
    masks.forEach((mask) => {
      mask.style.transform = 'translateY(10px)';
      const maskInner = mask.querySelector<HTMLElement>(ImmerserSelectors.maskInner) as HTMLElement;
      maskInner.style.transform = 'translateY(-10px)';
    });

    strategy.cleanup();

    expect(Array.from(root.querySelectorAll(ImmerserSelectors.mask))).toEqual(masks);
    expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
    expect(root.querySelectorAll(ImmerserSelectors.solid)).toHaveLength(1);
    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('restores original solids to their exact parent and sibling positions', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <span data-before></span>
        <div data-solid-parent>
          <i data-before-solid></i>
          <a data-immerser-solid="logo">Logo</a>
          <i data-after-solid></i>
        </div>
        <button data-immerser-solid="menu">Menu</button>
        <span data-after></span>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const initialOuterHtml = root.outerHTML;
    const strategy = new GeneratedMarkupStrategy({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });
    strategy.prepare(createLayerStateArray());

    strategy.cleanup();

    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('reports a missing mask-inner in reusable custom markup', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <div data-immerser-mask><div data-immerser-mask-inner></div></div>
        <div data-immerser-mask></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const initialOuterHtml = root.outerHTML;
    const report = vi.fn((_params: IReportParams): void => undefined);
    const strategy = new GeneratedMarkupStrategy({ report, rootNode: root, selectors: ImmerserSelectors });

    expect(() => strategy.prepare(createLayerStateArray())).toThrow(
      'custom markup mask-inner not found for mask at index 1',
    );
    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('does not accumulate generated masks when prepared twice', () => {
    const { root } = setupMarkup();
    const initialOuterHtml = root.outerHTML;
    const strategy = new GeneratedMarkupStrategy({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });
    strategy.prepare(createLayerStateArray());

    strategy.prepare(createLayerStateArray());

    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(2);
    strategy.cleanup();
    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('reports a partial custom mask set', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <a data-immerser-solid="logo">Logo</a>
        <div data-immerser-mask><div data-immerser-mask-inner></div></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const report = vi.fn((_params: IReportParams): void => undefined);
    const strategy = new GeneratedMarkupStrategy({ report, rootNode: root, selectors: ImmerserSelectors });

    strategy.prepare(createLayerStateArray());

    expect(report).toHaveBeenCalledOnce();
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({
        isWarning: true,
        message: expect.stringContaining(`count of your immerser masks doesn't equal layers count`),
      }),
    );
  });
});

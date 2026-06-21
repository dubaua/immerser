// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import mockScrollMetrics, { restoreScrollMetrics } from '../dom/tests/mock-scroll-metrics';
import Immerser from '../immerser';
import { type MarkupMode, MarkupModes } from '../options';
import type { ActiveLayerChangeHandler } from '../types';

const MaskSelector = '[data-immerser-mask]';
const MaskInnerSelector = '[data-immerser-mask-inner]';
const SolidSelector = '[data-immerser-solid]';

type SetupMarkupResult = {
  layers: HTMLElement[];
  root: HTMLElement;
  solids: HTMLElement[];
};

function setElementMetrics(element: HTMLElement, { height, top }: { height: number; top: number }): void {
  Object.defineProperties(element, {
    offsetHeight: { configurable: true, value: height },
    offsetTop: { configurable: true, value: top },
  });
}

function setScrollY(scrollY: number): void {
  mockScrollMetrics({
    documentHeight: 1000,
    documentWidth: 1000,
    scrollX: 0,
    scrollY,
  });
}

function setupMarkup(): SetupMarkupResult {
  document.body.innerHTML = `
    <div data-immerser>
      <a data-immerser-solid="logo">Logo</a>
      <button data-immerser-solid="menu">Menu</button>
    </div>
    <section data-immerser-layer id="first-layer"></section>
    <section data-immerser-layer id="second-layer"></section>
  `;

  const root = document.querySelector<HTMLElement>('[data-immerser]') as HTMLElement;
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-immerser-layer]'));
  const solids = Array.from(root.querySelectorAll<HTMLElement>(SolidSelector));

  setElementMetrics(root, { height: 400, top: 0 });
  setElementMetrics(layers[0], { height: 200, top: 0 });
  setElementMetrics(layers[1], { height: 200, top: 200 });

  return { layers, root, solids };
}

function createImmerser(
  onActiveLayerChange?: ActiveLayerChangeHandler,
  markupMode?: MarkupMode,
): Immerser {
  return new Immerser({
    debug: false,
    ...(markupMode === undefined ? {} : { markupMode }),
    solidClassnameArray: [
      { logo: 'logo-first', menu: 'menu-first' },
      { logo: 'logo-second', menu: 'menu-second' },
    ],
    on: onActiveLayerChange ? { activeLayerChange: onActiveLayerChange } : undefined,
  });
}

describe('Immerser', () => {
  beforeEach(() => {
    setScrollY(0);
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100 });
  });

  afterEach(restoreScrollMetrics);

  it('uses generated markup by default and detaches original solids when bound', () => {
    const { root, solids } = setupMarkup();
    const immerser = createImmerser();
    const masks = Array.from(root.querySelectorAll<HTMLElement>(MaskSelector));

    expect(immerser.isBound).toBe(true);
    expect(masks).toHaveLength(2);
    expect(root.querySelectorAll(MaskInnerSelector)).toHaveLength(2);
    expect(root.querySelectorAll(SolidSelector)).toHaveLength(4);
    expect(masks.every((mask) => mask.querySelectorAll(SolidSelector).length === 2)).toBe(true);
    expect(solids.every((solid) => solid.parentNode === null)).toBe(true);

    immerser.destroy();
  });

  it('creates generated markup when markupMode is generated', () => {
    const { root, solids } = setupMarkup();
    const immerser = createImmerser(undefined, MarkupModes.Generated);

    expect(immerser.isBound).toBe(true);
    expect(root.querySelectorAll(MaskSelector)).toHaveLength(2);
    expect(root.querySelectorAll(MaskInnerSelector)).toHaveLength(2);
    expect(root.querySelectorAll(SolidSelector)).toHaveLength(4);
    expect(solids.every((solid) => solid.parentNode === null)).toBe(true);

    immerser.destroy();
  });

  it('rejects invalid markupMode values through options validation', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root } = setupMarkup();
    const immerser = createImmerser(undefined, 'invalid' as MarkupMode);

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Expected markupMode to be either generated or managed'));
    expect(root.querySelectorAll(MaskSelector)).toHaveLength(2);

    immerser.destroy();
    warn.mockRestore();
  });

  it('fails fast when markupMode is managed', () => {
    setupMarkup();

    expect(() => createImmerser(undefined, MarkupModes.Managed)).toThrow('managed markup mode is not implemented yet');
  });

  it('restores the original DOM when unbound', () => {
    const { root, solids } = setupMarkup();
    const immerser = createImmerser();

    immerser.unbind();

    expect(immerser.isBound).toBe(false);
    expect(root.querySelectorAll(MaskSelector)).toHaveLength(0);
    expect(root.querySelectorAll(SolidSelector)).toHaveLength(2);
    expect(Array.from(root.querySelectorAll(SolidSelector))).toEqual(solids);
  });

  it('keeps generated and restored DOM stable across repeated bind and unbind cycles', () => {
    const { root, solids } = setupMarkup();
    const immerser = createImmerser();

    immerser.unbind();
    immerser.bind();

    expect(root.querySelectorAll(MaskSelector)).toHaveLength(2);
    expect(root.querySelectorAll(SolidSelector)).toHaveLength(4);

    immerser.unbind();

    expect(root.querySelectorAll(MaskSelector)).toHaveLength(0);
    expect(root.querySelectorAll(SolidSelector)).toHaveLength(2);
    expect(Array.from(root.querySelectorAll(SolidSelector))).toEqual(solids);
  });

  it('cleans generated markup and restores public state when destroyed', () => {
    const { root, solids } = setupMarkup();
    const immerser = createImmerser();

    immerser.destroy();

    expect(immerser.isBound).toBe(false);
    expect(immerser.activeIndex).toBe(-1);
    expect(root.querySelectorAll(MaskSelector)).toHaveLength(0);
    expect(root.querySelectorAll(SolidSelector)).toHaveLength(2);
    expect(Array.from(root.querySelectorAll(SolidSelector))).toEqual(solids);
  });

  it('emits active layer changes with the public callback argument order', () => {
    setupMarkup();
    const onActiveLayerChange = vi.fn<ActiveLayerChangeHandler>();
    const immerser = createImmerser(onActiveLayerChange);
    onActiveLayerChange.mockClear();
    setScrollY(200);

    immerser.render();

    expect(onActiveLayerChange).toHaveBeenCalledOnce();
    expect(onActiveLayerChange).toHaveBeenCalledWith(1, immerser);
    expect(immerser.activeIndex).toBe(1);

    immerser.destroy();
  });
});

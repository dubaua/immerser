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

type SetupManagedMarkupResult = SetupMarkupResult & {
  clientChildren: HTMLElement[];
  maskInners: HTMLElement[];
  masks: HTMLElement[];
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

function setupManagedMarkup({
  maskCount = 2,
  missingMaskInnerIndex = -1,
}: { maskCount?: number; missingMaskInnerIndex?: number } = {}): SetupManagedMarkupResult {
  const masksMarkup = Array.from({ length: maskCount }, (_, maskIndex) => {
    const children = `
      <span data-client-child="${maskIndex}">Client child</span>
      <a data-immerser-solid="logo">Logo ${maskIndex}</a>
    `;
    return missingMaskInnerIndex === maskIndex
      ? `<div data-immerser-mask>${children}</div>`
      : `<div data-immerser-mask><div data-immerser-mask-inner>${children}</div></div>`;
  }).join('');

  document.body.innerHTML = `
    <div data-immerser>${masksMarkup}</div>
    <section data-immerser-layer id="first-layer"></section>
    <section data-immerser-layer id="second-layer"></section>
  `;

  const root = document.querySelector<HTMLElement>('[data-immerser]') as HTMLElement;
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-immerser-layer]'));
  const masks = Array.from(root.querySelectorAll<HTMLElement>(MaskSelector));
  const maskInners = Array.from(root.querySelectorAll<HTMLElement>(MaskInnerSelector));
  const solids = Array.from(root.querySelectorAll<HTMLElement>(SolidSelector));
  const clientChildren = Array.from(root.querySelectorAll<HTMLElement>('[data-client-child]'));

  setElementMetrics(root, { height: 400, top: 0 });
  setElementMetrics(layers[0], { height: 200, top: 0 });
  setElementMetrics(layers[1], { height: 200, top: 200 });

  return { clientChildren, layers, maskInners, masks, root, solids };
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

  afterEach(() => {
    restoreScrollMetrics();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

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

  describe('managed markup', () => {
    it('cancels a pending scroll frame when unbound', () => {
      const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
      vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(17);
      setupManagedMarkup();
      const immerser = createImmerser(undefined, MarkupModes.Managed);
      window.dispatchEvent(new Event('scroll'));

      immerser.unbind();

      expect(cancelAnimationFrame).toHaveBeenCalledWith(17);
    });

    it('cancels a pending resize frame when unbound', () => {
      const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
      vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(23);
      setupManagedMarkup();
      const immerser = createImmerser(undefined, MarkupModes.Managed);
      window.dispatchEvent(new Event('resize'));

      immerser.unbind();

      expect(cancelAnimationFrame).toHaveBeenCalledWith(23);
    });

    it('clears a pending scroll-adjust timer when unbound', () => {
      vi.useFakeTimers();
      let frameCallback: FrameRequestCallback | undefined;
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        frameCallback = callback;
        return 31;
      });
      const clearTimeout = vi.spyOn(window, 'clearTimeout');
      setupManagedMarkup();
      const immerser = new Immerser({
        debug: false,
        markupMode: MarkupModes.Managed,
        scrollAdjustThreshold: 1,
        solidClassnameArray: [{ logo: 'logo-first' }, { logo: 'logo-second' }],
      });
      window.dispatchEvent(new Event('scroll'));
      frameCallback?.(0);

      immerser.unbind();

      expect(clearTimeout).toHaveBeenCalledOnce();
    });

    it('connects existing masks and mask-inner nodes when bound', () => {
      const { maskInners, masks, root } = setupManagedMarkup();
      const immerser = createImmerser(undefined, MarkupModes.Managed);

      expect(immerser.isBound).toBe(true);
      expect(Array.from(root.querySelectorAll(MaskSelector))).toEqual(masks);
      expect(Array.from(root.querySelectorAll(MaskInnerSelector))).toEqual(maskInners);

      immerser.destroy();
    });

    it('keeps managed solids and client-owned children untouched when bound', () => {
      const { clientChildren, maskInners, root, solids } = setupManagedMarkup();
      const childArrays = maskInners.map((maskInner) => Array.from(maskInner.children));
      const solidParents = solids.map((solid) => solid.parentNode);
      const immerser = createImmerser(undefined, MarkupModes.Managed);

      expect(Array.from(root.querySelectorAll(SolidSelector))).toEqual(solids);
      expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
      expect(maskInners.map((maskInner) => Array.from(maskInner.children))).toEqual(childArrays);
      expect(solids.map((solid) => solid.parentNode)).toEqual(solidParents);

      immerser.destroy();
    });

    it('applies runtime styles to managed masks and mask-inner nodes', () => {
      const { maskInners, masks } = setupManagedMarkup();
      const immerser = createImmerser(undefined, MarkupModes.Managed);

      expect(masks.every((mask) => mask.style.position === 'absolute')).toBe(true);
      expect(maskInners.every((maskInner) => maskInner.style.position === 'absolute')).toBe(true);
      expect(masks.every((mask) => mask.style.transform.startsWith('translateY('))).toBe(true);
      expect(maskInners.every((maskInner) => maskInner.style.transform.startsWith('translateY('))).toBe(true);

      immerser.destroy();
    });

    it('keeps managed markup and removes adapter-owned styles when unbound', () => {
      const { clientChildren, maskInners, masks, root, solids } = setupManagedMarkup();
      masks[0].style.position = 'relative';
      masks[0].style.transform = 'scale(1)';
      maskInners[0].style.overflow = 'visible';
      maskInners[0].style.transform = 'scale(2)';
      const immerser = createImmerser(undefined, MarkupModes.Managed);

      immerser.unbind();

      expect(Array.from(root.querySelectorAll(MaskSelector))).toEqual(masks);
      expect(Array.from(root.querySelectorAll(MaskInnerSelector))).toEqual(maskInners);
      expect(Array.from(root.querySelectorAll(SolidSelector))).toEqual(solids);
      expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
      expect(masks[0].style.position).toBe('relative');
      expect(masks[0].style.transform).toBe('scale(1)');
      expect(maskInners[0].style.overflow).toBe('visible');
      expect(maskInners[0].style.transform).toBe('scale(2)');
      expect(masks[1].style.transform).toBe('');
      expect(maskInners[1].style.transform).toBe('');
    });

    it('fails clearly when managed mask count differs from layer count', () => {
      setupManagedMarkup({ maskCount: 1 });

      expect(() => createImmerser(undefined, MarkupModes.Managed)).toThrow(
        'managed markup mask count differs from count of layers',
      );
    });

    it('fails clearly when a managed mask-inner is missing', () => {
      setupManagedMarkup({ missingMaskInnerIndex: 1 });

      expect(() => createImmerser(undefined, MarkupModes.Managed)).toThrow(
        'managed markup mask-inner not found for mask at index 1',
      );
    });

    it('keeps managed markup stable across repeated bind and unbind cycles', () => {
      const { clientChildren, maskInners, masks, root, solids } = setupManagedMarkup();
      const immerser = createImmerser(undefined, MarkupModes.Managed);

      immerser.unbind();
      immerser.bind();
      immerser.unbind();

      expect(Array.from(root.querySelectorAll(MaskSelector))).toEqual(masks);
      expect(Array.from(root.querySelectorAll(MaskInnerSelector))).toEqual(maskInners);
      expect(Array.from(root.querySelectorAll(SolidSelector))).toEqual(solids);
      expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
    });

    it('keeps external managed markup intact when destroyed', () => {
      const { clientChildren, maskInners, masks, root, solids } = setupManagedMarkup();
      const immerser = createImmerser(undefined, MarkupModes.Managed);

      immerser.destroy();

      expect(immerser.isBound).toBe(false);
      expect(Array.from(root.querySelectorAll(MaskSelector))).toEqual(masks);
      expect(Array.from(root.querySelectorAll(MaskInnerSelector))).toEqual(maskInners);
      expect(Array.from(root.querySelectorAll(SolidSelector))).toEqual(solids);
      expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
      expect(masks.every((mask) => mask.style.transform === '')).toBe(true);
      expect(maskInners.every((maskInner) => maskInner.style.transform === '')).toBe(true);
    });
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

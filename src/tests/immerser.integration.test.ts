// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ImmerserMarkupController from '../dom/immerser-markup-controller';
import { ImmerserSelectors } from '../dom/selectors';
import mockScrollMetrics, { restoreScrollMetrics } from '../dom/tests/mock-scroll-metrics';
import setupManagedMarkup from '../dom/tests/setup-managed-markup.factory';
import setupMarkup from '../dom/tests/setup-markup.factory';
import Immerser from '../immerser';
import type { ActiveLayerChangeHandler } from '../types';

function setScrollY(scrollY: number): void {
  mockScrollMetrics({
    documentHeight: 1000,
    documentWidth: 1000,
    scrollX: 0,
    scrollY,
  });
}

function createImmerser(onActiveLayerChange?: ActiveLayerChangeHandler): Immerser {
  return new Immerser({
    debug: false,
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
    document.body.innerHTML = '';
    restoreScrollMetrics();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('uses generated markup by default and detaches original solids when bound', () => {
    const { root, solids } = setupMarkup();
    const immerser = createImmerser();
    const masks = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.mask));

    expect(immerser.isBound).toBe(true);
    expect(masks).toHaveLength(2);
    expect(root.querySelectorAll(ImmerserSelectors.maskInner)).toHaveLength(2);
    expect(root.querySelectorAll(ImmerserSelectors.solid)).toHaveLength(4);
    expect(masks.every((mask) => mask.querySelectorAll(ImmerserSelectors.solid).length === 2)).toBe(true);
    expect(solids.every((solid) => solid.parentNode === null)).toBe(true);

    immerser.destroy();
  });

  describe('existing markup', () => {
    it('binds without generated solid classname configuration', () => {
      const { masks } = setupManagedMarkup({ hasSolids: false });

      const immerser = new Immerser({ debug: false });

      expect(immerser.isBound).toBe(true);
      expect(masks.every((mask) => mask.style.transform.startsWith('translateY('))).toBe(true);

      immerser.destroy();
    });

    it('cancels a pending scroll frame when unbound', () => {
      const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
      vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(17);
      setupManagedMarkup();
      const immerser = createImmerser();
      window.dispatchEvent(new Event('scroll'));

      immerser.unbind();

      expect(cancelAnimationFrame).toHaveBeenCalledWith(17);
    });

    it('cancels a pending resize frame when unbound', () => {
      const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
      vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(23);
      setupManagedMarkup();
      const immerser = createImmerser();
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
      const immerser = createImmerser();

      expect(immerser.isBound).toBe(true);
      expect(Array.from(root.querySelectorAll(ImmerserSelectors.mask))).toEqual(masks);
      expect(Array.from(root.querySelectorAll(ImmerserSelectors.maskInner))).toEqual(maskInners);

      immerser.destroy();
    });

    it('keeps managed solids and client-owned children untouched when bound', () => {
      const { clientChildren, maskInners, root, solids } = setupManagedMarkup();
      const childArrays = maskInners.map((maskInner) => Array.from(maskInner.children));
      const solidParents = solids.map((solid) => solid.parentNode);
      const immerser = createImmerser();

      expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
      expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
      expect(maskInners.map((maskInner) => Array.from(maskInner.children))).toEqual(childArrays);
      expect(solids.map((solid) => solid.parentNode)).toEqual(solidParents);

      immerser.destroy();
    });

    it('applies runtime styles to managed masks and mask-inner nodes', () => {
      const { maskInners, masks } = setupManagedMarkup();
      const immerser = createImmerser();

      expect(masks.every((mask) => mask.style.position === 'absolute')).toBe(true);
      expect(maskInners.every((maskInner) => maskInner.style.position === 'absolute')).toBe(true);
      expect(masks.every((mask) => mask.style.transform.startsWith('translateY('))).toBe(true);
      expect(maskInners.every((maskInner) => maskInner.style.transform.startsWith('translateY('))).toBe(true);

      immerser.destroy();
    });

    it('keeps existing markup and clears controller-owned styles when unbound', () => {
      const { clientChildren, maskInners, masks, root, solids } = setupManagedMarkup();
      masks[0].style.position = 'relative';
      masks[0].style.transform = 'scale(1)';
      maskInners[0].style.overflow = 'visible';
      maskInners[0].style.transform = 'scale(2)';
      const immerser = createImmerser();

      immerser.unbind();

      expect(Array.from(root.querySelectorAll(ImmerserSelectors.mask))).toEqual(masks);
      expect(Array.from(root.querySelectorAll(ImmerserSelectors.maskInner))).toEqual(maskInners);
      expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
      expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
      expect(masks.every((mask) => mask.getAttribute('style') === null)).toBe(true);
      expect(maskInners.every((maskInner) => maskInner.getAttribute('style') === null)).toBe(true);
    });

    it('fails clearly when managed mask count differs from layer count', () => {
      setupManagedMarkup({ maskCount: 1 });

      expect(() => createImmerser()).toThrow(
        'existing markup mask count differs from count of layers',
      );
    });

    it('fails clearly when a managed mask-inner is missing', () => {
      setupManagedMarkup({ missingMaskInnerIndex: 1 });

      expect(() => createImmerser()).toThrow(
        'existing markup mask-inner not found for mask at index 1',
      );
    });

    it('keeps managed markup stable across repeated bind and unbind cycles', () => {
      const { clientChildren, maskInners, masks, root, solids } = setupManagedMarkup();
      const immerser = createImmerser();

      immerser.unbind();
      immerser.bind();
      immerser.unbind();

      expect(Array.from(root.querySelectorAll(ImmerserSelectors.mask))).toEqual(masks);
      expect(Array.from(root.querySelectorAll(ImmerserSelectors.maskInner))).toEqual(maskInners);
      expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
      expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
    });

    it('keeps external managed markup intact when destroyed', () => {
      const { clientChildren, maskInners, masks, root, solids } = setupManagedMarkup();
      const immerser = createImmerser();

      immerser.destroy();

      expect(immerser.isBound).toBe(false);
      expect(Array.from(root.querySelectorAll(ImmerserSelectors.mask))).toEqual(masks);
      expect(Array.from(root.querySelectorAll(ImmerserSelectors.maskInner))).toEqual(maskInners);
      expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
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
    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(0);
    expect(root.querySelectorAll(ImmerserSelectors.solid)).toHaveLength(2);
    expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
  });

  it('restores adapter-owned pager and synchro-hover mutations when unbound', () => {
    const { root } = setupMarkup();
    root.insertAdjacentHTML(
      'beforeend',
      `
        <a data-immerser-pager-link href="#first-layer" class="pager-link-active" data-immerser-layer-index="99"></a>
        <a data-immerser-pager-link href="#second-layer" class="pager-link-active"></a>
        <span data-immerser-synchro-hover="logo" class="_hover"></span>
        <span data-immerser-synchro-hover="logo"></span>
      `,
    );
    const immerser = createImmerser();

    immerser.unbind();

    const pagerLinks = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.pagerLink));
    const synchroHoverNodes = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.synchroHover));
    expect(pagerLinks[0].classList).toContain('pager-link-active');
    expect(pagerLinks[0].dataset.immerserLayerIndex).toBe('99');
    expect(pagerLinks[1].classList).toContain('pager-link-active');
    expect(pagerLinks[1].getAttribute('data-immerser-layer-index')).toBe(null);
    expect(synchroHoverNodes[0].classList).toContain('_hover');
    expect(synchroHoverNodes[1].classList).not.toContain('_hover');
  });

  it('synchronizes hover when mouseover originates from a nested element', () => {
    const { root } = setupMarkup();
    const logo = root.querySelector<HTMLElement>('[data-immerser-solid="logo"]') as HTMLElement;
    logo.dataset.immerserSynchroHover = 'logo';
    logo.innerHTML = '<span data-logo-child>Logo</span>';
    const immerser = createImmerser();
    const synchroHoverNodes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-immerser-synchro-hover="logo"]'),
    );
    const nestedLogoNode = synchroHoverNodes[0].querySelector<HTMLElement>('[data-logo-child]') as HTMLElement;

    nestedLogoNode.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    expect(synchroHoverNodes.every((node) => node.classList.contains('_hover'))).toBe(true);

    immerser.destroy();
  });

  it('keeps generated and restored DOM stable across repeated bind and unbind cycles', () => {
    const { root, solids } = setupMarkup();
    const immerser = createImmerser();

    immerser.unbind();
    immerser.bind();

    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(2);
    expect(root.querySelectorAll(ImmerserSelectors.solid)).toHaveLength(4);

    immerser.unbind();

    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(0);
    expect(root.querySelectorAll(ImmerserSelectors.solid)).toHaveLength(2);
    expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
  });

  it('does nothing when bind is called while already bound', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const prepare = vi.spyOn(ImmerserMarkupController.prototype, 'prepare');
    const onBind = vi.fn();
    const { root } = setupMarkup();
    const immerser = new Immerser({
      debug: false,
      on: { bind: onBind },
      solidClassnameArray: [{ logo: 'logo-first' }, { logo: 'logo-second' }],
    });
    const windowListenerCount = addEventListener.mock.calls.length;

    immerser.bind();
    immerser.bind();

    expect(prepare).toHaveBeenCalledOnce();
    expect(addEventListener).toHaveBeenCalledTimes(windowListenerCount);
    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(2);
    expect(root.querySelectorAll(ImmerserSelectors.solid)).toHaveLength(4);
    expect(onBind).toHaveBeenCalledOnce();

    immerser.destroy();
  });

  it('cleans generated markup once when unbind is called repeatedly', () => {
    const cleanup = vi.spyOn(ImmerserMarkupController.prototype, 'cleanup');
    const onUnbind = vi.fn();
    const { root, solids } = setupMarkup();
    const immerser = new Immerser({
      debug: false,
      on: { unbind: onUnbind },
      solidClassnameArray: [{ logo: 'logo-first' }, { logo: 'logo-second' }],
    });

    immerser.unbind();
    immerser.unbind();

    expect(cleanup).toHaveBeenCalledOnce();
    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(0);
    expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
    expect(onUnbind).toHaveBeenCalledOnce();
  });

  it('cleans generated markup and restores public state when destroyed', () => {
    const { root, solids } = setupMarkup();
    const immerser = createImmerser();

    immerser.destroy();

    expect(immerser.isBound).toBe(false);
    expect(immerser.activeIndex).toBe(-1);
    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(0);
    expect(root.querySelectorAll(ImmerserSelectors.solid)).toHaveLength(2);
    expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
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

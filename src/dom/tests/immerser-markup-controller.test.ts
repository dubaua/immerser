// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import ImmerserMarkupController from '../immerser-markup-controller';
import { ImmerserSelectors } from '../selectors';
import createLayerStateArray from './create-layer-state-array.factory';
import setupManagedMarkup from './setup-managed-markup.factory';
import setupMarkup from './setup-markup.factory';

describe('ImmerserMarkupController', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('creates and connects one mask pair for every layer when masks do not exist', () => {
    const { root } = setupMarkup();
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    const layerStateArray = controller.prepare(createLayerStateArray());

    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(2);
    expect(root.querySelectorAll(ImmerserSelectors.maskInner)).toHaveLength(2);
    expect(layerStateArray.every(({ maskInnerNode, maskNode }) => maskInnerNode && maskNode)).toBe(true);
    expect(layerStateArray[0].maskNode?.dataset.immerserLayerId).toBe('first-layer');
    expect(layerStateArray[1].maskNode?.dataset.immerserLayerId).toBe('second-layer');
    expect(layerStateArray[0].maskNode?.getAttribute('aria-hidden')).toBe(null);
    expect(layerStateArray[1].maskNode?.getAttribute('aria-hidden')).toBe('true');
  });

  it('clones source solids with layer classnames and detaches originals', () => {
    const { root, solids } = setupMarkup();
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    const layerStateArray = controller.prepare(
      createLayerStateArray([{ logo: 'logo-first' }, { logo: 'logo-second' }]),
    );

    expect(layerStateArray[0].maskInnerNode?.querySelector('[data-immerser-solid="logo"]')?.classList).toContain(
      'logo-first',
    );
    expect(layerStateArray[1].maskInnerNode?.querySelector('[data-immerser-solid="logo"]')?.classList).toContain(
      'logo-second',
    );
    expect(solids.every((solid) => solid.parentNode === null)).toBe(true);
  });

  it('removes created masks and restores source solids during cleanup', () => {
    const { root, solids } = setupMarkup();
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });
    controller.prepare(createLayerStateArray());

    controller.cleanup();

    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(0);
    expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
  });

  it('connects existing mask pairs without changing their children or aria-hidden', () => {
    const { clientChildren, maskInners, masks, root } = setupManagedMarkup({ hasSolids: false });
    masks[0].setAttribute('aria-hidden', 'true');
    masks[1].setAttribute('aria-hidden', 'false');
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    const layerStateArray = controller.prepare(createLayerStateArray());

    expect(layerStateArray[0].maskNode).toBe(masks[0]);
    expect(layerStateArray[0].maskInnerNode).toBe(maskInners[0]);
    expect(layerStateArray[1].maskNode).toBe(masks[1]);
    expect(layerStateArray[1].maskInnerNode).toBe(maskInners[1]);
    expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
    expect(masks[0].getAttribute('aria-hidden')).toBe('true');
    expect(masks[1].getAttribute('aria-hidden')).toBe('false');
  });

  it('connects existing mask pairs by layer id regardless of DOM order', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <div data-immerser-mask data-immerser-layer-id="second-layer"><div data-immerser-mask-inner><span data-client-child="1"></span></div></div>
        <div data-immerser-mask data-immerser-layer-id="first-layer"><div data-immerser-mask-inner><span data-client-child="0"></span></div></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const masks = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.mask));
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    const layerStateArray = controller.prepare(createLayerStateArray());

    expect(layerStateArray[0].maskNode).toBe(masks[1]);
    expect(layerStateArray[1].maskNode).toBe(masks[0]);
  });

  it('does not clone or detach solids that already belong to existing masks', () => {
    const { root, solids } = setupManagedMarkup();
    const solidParents = solids.map((solid) => solid.parentNode);
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    controller.prepare(createLayerStateArray());

    expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
    expect(solids.map((solid) => solid.parentNode)).toEqual(solidParents);
  });

  it('clones only source solids when existing masks already contain solids', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <a data-immerser-solid="logo">Logo</a>
        <div data-immerser-mask data-immerser-layer-id="first-layer"><div data-immerser-mask-inner><span data-immerser-solid="emoji">Emoji 0</span></div></div>
        <div data-immerser-mask data-immerser-layer-id="second-layer"><div data-immerser-mask-inner><span data-immerser-solid="emoji">Emoji 1</span></div></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const sourceSolid = root.querySelector<HTMLElement>('[data-immerser-solid="logo"]') as HTMLElement;
    const innerSolids = Array.from(root.querySelectorAll<HTMLElement>('[data-immerser-solid="emoji"]'));
    const innerSolidParents = innerSolids.map((solid) => solid.parentNode);
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    controller.prepare(createLayerStateArray());

    expect(root.querySelectorAll('[data-immerser-solid="logo"]')).toHaveLength(2);
    expect(Array.from(root.querySelectorAll('[data-immerser-solid="emoji"]'))).toEqual(innerSolids);
    expect(innerSolids.map((solid) => solid.parentNode)).toEqual(innerSolidParents);
    expect(sourceSolid.parentNode).toBe(null);
  });

  it('removes only added clones when cleaning existing masks', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <a data-immerser-solid="logo">Logo</a>
        <div data-immerser-mask data-immerser-layer-id="first-layer"><div data-immerser-mask-inner><span data-client-child="0"></span></div></div>
        <div data-immerser-mask data-immerser-layer-id="second-layer"><div data-immerser-mask-inner><span data-client-child="1"></span></div></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const sourceSolid = root.querySelector<HTMLElement>('[data-immerser-solid="logo"]') as HTMLElement;
    const clientChildren = Array.from(root.querySelectorAll<HTMLElement>('[data-client-child]'));
    const masks = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.mask));
    const maskInners = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.maskInner));
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });
    controller.prepare(createLayerStateArray());

    controller.cleanup();

    expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
    expect(Array.from(root.querySelectorAll(ImmerserSelectors.mask))).toEqual(masks);
    expect(Array.from(root.querySelectorAll(ImmerserSelectors.maskInner))).toEqual(maskInners);
    expect(root.querySelectorAll('[data-immerser-solid="logo"]')).toHaveLength(1);
    expect(sourceSolid.parentNode).toBe(root);
  });

  it('applies technical styles to root and mask pairs', () => {
    const { maskInners, masks, root } = setupManagedMarkup({ hasSolids: false });
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    controller.prepare(createLayerStateArray());

    expect(root.style.pointerEvents).toBe('none');
    expect(masks.every((mask) => mask.style.position === 'absolute')).toBe(true);
    expect(maskInners.every((maskInner) => maskInner.style.overflow === 'hidden')).toBe(true);
  });

  it('applies and clears interactive styles on existing solids', () => {
    const { clientChildren, root, solids } = setupManagedMarkup();
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    controller.prepare(createLayerStateArray());

    expect(solids.every((solid) => solid.style.pointerEvents === 'all')).toBe(true);
    expect(clientChildren.every((node) => node.style.pointerEvents === '')).toBe(true);

    controller.cleanup();

    expect(solids.every((solid) => solid.getAttribute('style') === null)).toBe(true);
  });

  it('clears all inline styles from technical existing markup during cleanup', () => {
    const { maskInners, masks, root } = setupManagedMarkup({ hasSolids: false });
    masks[0].style.position = 'relative';
    maskInners[0].style.overflow = 'visible';
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });
    controller.prepare(createLayerStateArray());

    controller.cleanup();

    expect(root.getAttribute('style')).toBe(null);
    expect(masks.every((mask) => mask.getAttribute('style') === null)).toBe(true);
    expect(maskInners.every((maskInner) => maskInner.getAttribute('style') === null)).toBe(true);
  });

  it('reports an existing mask count that differs from the layer count', () => {
    const { root } = setupManagedMarkup({ maskCount: 1 });
    const initialOuterHtml = root.outerHTML;
    const report = vi.fn();
    const controller = new ImmerserMarkupController({ report, rootNode: root, selectors: ImmerserSelectors });

    expect(() => controller.prepare(createLayerStateArray())).toThrow(
      'existing markup mask count differs from count of layers',
    );
    expect(report).toHaveBeenCalledOnce();
    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('reports an existing mask without mask-inner', () => {
    const { root } = setupManagedMarkup({ missingMaskInnerIndex: 1 });
    const initialOuterHtml = root.outerHTML;
    const report = vi.fn();
    const controller = new ImmerserMarkupController({ report, rootNode: root, selectors: ImmerserSelectors });

    expect(() => controller.prepare(createLayerStateArray())).toThrow(
      'existing markup mask-inner not found for mask at index 1',
    );
    expect(report).toHaveBeenCalledOnce();
    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('reports an existing mask without layer id', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <div data-immerser-mask><div data-immerser-mask-inner></div></div>
        <div data-immerser-mask data-immerser-layer-id="second-layer"><div data-immerser-mask-inner></div></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const initialOuterHtml = root.outerHTML;
    const report = vi.fn();
    const controller = new ImmerserMarkupController({ report, rootNode: root, selectors: ImmerserSelectors });

    expect(() => controller.prepare(createLayerStateArray())).toThrow(
      'existing markup mask layer id not found for mask at index 0',
    );
    expect(report).toHaveBeenCalledOnce();
    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('reports an existing mask with unknown layer id', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <div data-immerser-mask data-immerser-layer-id="unknown-layer"><div data-immerser-mask-inner></div></div>
        <div data-immerser-mask data-immerser-layer-id="second-layer"><div data-immerser-mask-inner></div></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const initialOuterHtml = root.outerHTML;
    const report = vi.fn();
    const controller = new ImmerserMarkupController({ report, rootNode: root, selectors: ImmerserSelectors });

    expect(() => controller.prepare(createLayerStateArray())).toThrow(
      'existing markup mask layer id "unknown-layer" does not match any layer',
    );
    expect(report).toHaveBeenCalledOnce();
    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('reports duplicate existing mask layer ids', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <div data-immerser-mask data-immerser-layer-id="first-layer"><div data-immerser-mask-inner></div></div>
        <div data-immerser-mask data-immerser-layer-id="first-layer"><div data-immerser-mask-inner></div></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const initialOuterHtml = root.outerHTML;
    const report = vi.fn();
    const controller = new ImmerserMarkupController({ report, rootNode: root, selectors: ImmerserSelectors });

    expect(() => controller.prepare(createLayerStateArray())).toThrow(
      'existing markup has duplicate mask layer id "first-layer"',
    );
    expect(report).toHaveBeenCalledOnce();
    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('warns when source solids and existing mask content are both absent', () => {
    const { root } = setupManagedMarkup({ hasSolids: false });
    root.querySelectorAll(ImmerserSelectors.maskInner).forEach((maskInnerNode) => {
      maskInnerNode.replaceChildren();
    });
    const report = vi.fn();
    const controller = new ImmerserMarkupController({ report, rootNode: root, selectors: ImmerserSelectors });

    controller.prepare(createLayerStateArray());

    expect(report).toHaveBeenCalledOnce();
    expect(report).toHaveBeenCalledWith(expect.objectContaining({ isWarning: true }));
  });

  it('does not accumulate masks across repeated prepare calls', () => {
    const { root, solids } = setupMarkup();
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    controller.prepare(createLayerStateArray());
    controller.prepare(createLayerStateArray());

    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(2);
    expect(root.querySelectorAll(ImmerserSelectors.solid)).toHaveLength(solids.length * 2);
    expect(solids.every((solid) => solid.parentNode === null)).toBe(true);

    controller.cleanup();

    expect(root.querySelectorAll(ImmerserSelectors.mask)).toHaveLength(0);
    expect(root.querySelectorAll(ImmerserSelectors.solid)).toHaveLength(solids.length);
  });

  it('skips an empty classname when cloning source solids', () => {
    const { root } = setupMarkup();
    const controller = new ImmerserMarkupController({
      report: vi.fn(),
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    expect(() => controller.prepare(createLayerStateArray([{ logo: '' }, { logo: '' }]))).not.toThrow();
  });
});

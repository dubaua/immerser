// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import ManagedMarkupStrategy from '../managed-markup-strategy';
import { ImmerserSelectors } from '../../selectors';
import createLayerStateArray from '../../tests/create-layer-state-array.factory';
import setupManagedMarkup from '../../tests/setup-managed-markup.factory';

describe('ManagedMarkupStrategy', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('connects existing masks and mask-inner nodes to layer states', () => {
    const { maskInners, masks, root } = setupManagedMarkup({ hasSolids: false });
    const strategy = new ManagedMarkupStrategy({ report: vi.fn(), rootNode: root, selectors: ImmerserSelectors });

    const layerStateArray = strategy.prepare(createLayerStateArray());

    expect(layerStateArray[0].maskNode).toBe(masks[0]);
    expect(layerStateArray[0].maskInnerNode).toBe(maskInners[0]);
    expect(layerStateArray[1].maskNode).toBe(masks[1]);
    expect(layerStateArray[1].maskInnerNode).toBe(maskInners[1]);
  });

  it('applies the technical styles required by runtime drawing', () => {
    const { maskInners, masks, root } = setupManagedMarkup({ hasSolids: false });
    const strategy = new ManagedMarkupStrategy({ report: vi.fn(), rootNode: root, selectors: ImmerserSelectors });

    strategy.prepare(createLayerStateArray());

    expect(masks.every((mask) => mask.style.position === 'absolute')).toBe(true);
    expect(masks.every((mask) => mask.style.overflow === 'hidden')).toBe(true);
    expect(maskInners.every((maskInner) => maskInner.style.position === 'absolute')).toBe(true);
    expect(maskInners.every((maskInner) => maskInner.style.overflow === 'hidden')).toBe(true);
  });

  it('does not replace or reparent client-owned children', () => {
    const { clientChildren, maskInners, root } = setupManagedMarkup({ hasSolids: false });
    const childParents = clientChildren.map((child) => child.parentNode);
    const strategy = new ManagedMarkupStrategy({ report: vi.fn(), rootNode: root, selectors: ImmerserSelectors });

    strategy.prepare(createLayerStateArray());

    expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
    expect(maskInners.map((maskInner) => Array.from(maskInner.children))).toEqual(
      clientChildren.map((child) => [child]),
    );
    expect(clientChildren.map((child) => child.parentNode)).toEqual(childParents);
  });

  it('does not clone, replace or reparent managed solids', () => {
    const { root, solids } = setupManagedMarkup();
    const solidParents = solids.map((solid) => solid.parentNode);
    const strategy = new ManagedMarkupStrategy({ report: vi.fn(), rootNode: root, selectors: ImmerserSelectors });

    strategy.prepare(createLayerStateArray());

    expect(Array.from(root.querySelectorAll(ImmerserSelectors.solid))).toEqual(solids);
    expect(solids.map((solid) => solid.parentNode)).toEqual(solidParents);
  });

  it('restores previous inline styles during cleanup', () => {
    const { maskInners, masks, root } = setupManagedMarkup({ hasSolids: false });
    masks[0].style.position = 'relative';
    masks[0].style.transform = 'scale(1)';
    maskInners[0].style.overflow = 'visible';
    maskInners[0].style.transform = 'scale(2)';
    const initialOuterHtml = root.outerHTML;
    const strategy = new ManagedMarkupStrategy({ report: vi.fn(), rootNode: root, selectors: ImmerserSelectors });
    strategy.prepare(createLayerStateArray());

    strategy.cleanup();

    expect(masks[0].style.position).toBe('relative');
    expect(masks[0].style.transform).toBe('scale(1)');
    expect(maskInners[0].style.overflow).toBe('visible');
    expect(maskInners[0].style.transform).toBe('scale(2)');
    expect(masks[1].style.position).toBe('');
    expect(maskInners[1].style.position).toBe('');
    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('restores transforms applied by runtime drawing during cleanup', () => {
    const { maskInners, masks, root } = setupManagedMarkup({ hasSolids: false });
    const initialOuterHtml = root.outerHTML;
    const strategy = new ManagedMarkupStrategy({ report: vi.fn(), rootNode: root, selectors: ImmerserSelectors });
    strategy.prepare(createLayerStateArray());
    masks.forEach((mask) => {
      mask.style.transform = 'translateY(10px)';
    });
    maskInners.forEach((maskInner) => {
      maskInner.style.transform = 'translateY(-10px)';
    });

    strategy.cleanup();

    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('keeps managed markup stable across repeated prepare and cleanup', () => {
    const { clientChildren, masks, root } = setupManagedMarkup();
    const initialOuterHtml = root.outerHTML;
    const strategy = new ManagedMarkupStrategy({ report: vi.fn(), rootNode: root, selectors: ImmerserSelectors });
    strategy.prepare(createLayerStateArray());

    strategy.prepare(createLayerStateArray());
    strategy.cleanup();

    expect(root.outerHTML).toBe(initialOuterHtml);
    expect(Array.from(root.querySelectorAll(ImmerserSelectors.mask))).toEqual(masks);
    expect(Array.from(root.querySelectorAll('[data-client-child]'))).toEqual(clientChildren);
  });

  it('reports when the mask count differs from the layer count', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <div data-immerser-mask><div data-immerser-mask-inner></div></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const initialOuterHtml = root.outerHTML;
    const report = vi.fn();
    const strategy = new ManagedMarkupStrategy({
      report,
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    expect(() => strategy.prepare(createLayerStateArray())).toThrow(
      'managed markup mask count differs from count of layers',
    );
    expect(report).toHaveBeenCalledOnce();
    expect(root.outerHTML).toBe(initialOuterHtml);
  });

  it('reports when a managed mask-inner node is missing', () => {
    document.body.innerHTML = `
      <div data-immerser>
        <div data-immerser-mask><div data-immerser-mask-inner></div></div>
        <div data-immerser-mask></div>
      </div>
    `;
    const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
    const initialOuterHtml = root.outerHTML;
    const report = vi.fn();
    const strategy = new ManagedMarkupStrategy({
      report,
      rootNode: root,
      selectors: ImmerserSelectors,
    });

    expect(() => strategy.prepare(createLayerStateArray())).toThrow(
      'managed markup mask-inner not found for mask at index 1',
    );
    expect(report).toHaveBeenCalledOnce();
    expect(root.outerHTML).toBe(initialOuterHtml);
  });
});

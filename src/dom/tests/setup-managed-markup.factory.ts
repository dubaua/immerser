import { ImmerserSelectors } from '../selectors';
import setElementMetrics from './set-element-metrics';
import type { SetupMarkupResult } from './setup-markup.factory';

export type SetupManagedMarkupResult = SetupMarkupResult & {
  clientChildren: HTMLElement[];
  maskInners: HTMLElement[];
  masks: HTMLElement[];
};

export default function setupManagedMarkup({
  hasSolids = true,
  maskCount = 2,
  missingMaskInnerIndex = -1,
}: { hasSolids?: boolean; maskCount?: number; missingMaskInnerIndex?: number } = {}): SetupManagedMarkupResult {
  const layerIdArray = ['first-layer', 'second-layer'];
  const masksMarkup = Array.from({ length: maskCount }, (_, maskIndex) => {
    const children = `
      <span data-client-child="${maskIndex}">Client child</span>
      ${hasSolids ? `<a data-immerser-solid="logo">Logo ${maskIndex}</a>` : ''}
    `;
    return missingMaskInnerIndex === maskIndex
      ? `<div data-immerser-mask data-immerser-layer-id="${layerIdArray[maskIndex]}">${children}</div>`
      : `<div data-immerser-mask data-immerser-layer-id="${layerIdArray[maskIndex]}"><div data-immerser-mask-inner>${children}</div></div>`;
  }).join('');

  document.body.innerHTML = `
    <div data-immerser>${masksMarkup}</div>
    <section data-immerser-layer id="first-layer"></section>
    <section data-immerser-layer id="second-layer"></section>
  `;

  const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
  const layers = Array.from(document.querySelectorAll<HTMLElement>(ImmerserSelectors.layer));
  const masks = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.mask));
  const maskInners = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.maskInner));
  const solids = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.solid));
  const clientChildren = Array.from(root.querySelectorAll<HTMLElement>('[data-client-child]'));

  setElementMetrics(root, { height: 400, top: 0 });
  setElementMetrics(layers[0], { height: 200, top: 0 });
  setElementMetrics(layers[1], { height: 200, top: 200 });

  return { clientChildren, layers, maskInners, masks, root, solids };
}

import { ImmerserSelectors } from '../selectors';
import setElementMetrics from './set-element-metrics';

export type SetupMarkupResult = {
  layers: HTMLElement[];
  root: HTMLElement;
  solids: HTMLElement[];
};

export default function setupMarkup(): SetupMarkupResult {
  document.body.innerHTML = `
    <div data-immerser>
      <a data-immerser-solid="logo">Logo</a>
      <button data-immerser-solid="menu">Menu</button>
    </div>
    <section data-immerser-layer id="first-layer"></section>
    <section data-immerser-layer id="second-layer"></section>
  `;

  const root = document.querySelector<HTMLElement>(ImmerserSelectors.root) as HTMLElement;
  const layers = Array.from(document.querySelectorAll<HTMLElement>(ImmerserSelectors.layer));
  const solids = Array.from(root.querySelectorAll<HTMLElement>(ImmerserSelectors.solid));

  setElementMetrics(root, { height: 400, top: 0 });
  setElementMetrics(layers[0], { height: 200, top: 0 });
  setElementMetrics(layers[1], { height: 200, top: 200 });

  return { layers, root, solids };
}

import { CroppedFullAbsoluteStyles } from '../styles';
import assignInlineStyles from '../utils/assign-inline-styles';
import queryElementArray from '../utils/query-element-array';
import type { IDomLayerState } from '../types';
import type { IMarkupSelectors, IMarkupStrategy, IMarkupStrategyParams } from './types';

export default class ManagedMarkupStrategy implements IMarkupStrategy {
  private readonly _report: IMarkupStrategyParams['report'];
  private readonly _rootNode: HTMLElement;
  private readonly _selectors: IMarkupSelectors;
  private _styleSnapshots: Array<{
    hadStyleAttribute: boolean;
    node: HTMLElement;
    styles: Record<string, string>;
  }> = [];

  constructor({ report, rootNode, selectors }: IMarkupStrategyParams) {
    this._report = report;
    this._rootNode = rootNode;
    this._selectors = selectors;
  }

  /** Connects client-owned masks to layer states without changing their children. */
  public prepare(layerStateArray: IDomLayerState[]): IDomLayerState[] {
    if (this._styleSnapshots.length > 0) {
      this.cleanup();
    }
    const maskNodeArray = queryElementArray({ selector: this._selectors.mask, parent: this._rootNode });
    if (maskNodeArray.length !== layerStateArray.length) {
      const message = 'managed markup mask count differs from count of layers.';
      this._report({
        message,
        docsHash: '#prepare-your-markup',
      });
      throw new Error(message);
    }

    const maskInnerNodeArray = maskNodeArray.map((maskNode, maskIndex) => {
      const maskInnerNode = maskNode.querySelector<HTMLElement>(this._selectors.maskInner);
      if (!maskInnerNode) {
        const message = `managed markup mask-inner not found for mask at index ${maskIndex}.`;
        this._report({
          message,
          docsHash: '#prepare-your-markup',
        });
        throw new Error(message);
      }
      return maskInnerNode;
    });

    return layerStateArray.map((state, stateIndex) => {
      const maskNode = maskNodeArray[stateIndex];
      const maskInnerNode = maskInnerNodeArray[stateIndex];
      this._applyStyles(maskNode, { ...CroppedFullAbsoluteStyles, transform: '' });
      this._applyStyles(maskInnerNode, { ...CroppedFullAbsoluteStyles, transform: '' });
      return { ...state, maskNode, maskInnerNode };
    });
  }

  /** Restores strategy-owned inline style properties changed during managed binding. */
  public cleanup(): void {
    this._styleSnapshots.slice().reverse().forEach(({ hadStyleAttribute, node, styles }) => {
      assignInlineStyles(node, styles);
      if (!hadStyleAttribute && node.getAttribute('style') === '') {
        node.removeAttribute('style');
      }
    });
    this._styleSnapshots = [];
  }

  /** Preserves previous values so strategy-owned styles can be reverted exactly. */
  private _applyStyles(node: HTMLElement, styles: Record<string, string>): void {
    const previousStyles = Object.keys(styles).reduce<Record<string, string>>((result, rule) => {
      result[rule] = Reflect.get(node.style, rule);
      return result;
    }, {});
    this._styleSnapshots.push({
      hadStyleAttribute: node.hasAttribute('style'),
      node,
      styles: previousStyles,
    });
    assignInlineStyles(node, styles);
  }
}

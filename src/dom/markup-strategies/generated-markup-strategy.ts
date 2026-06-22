import { CroppedFullAbsoluteStyles, InteractiveStyles, NotInteractiveStyles } from '../styles';
import assignInlineStyles from '../utils/assign-inline-styles';
import forEachNode from '../utils/for-each-node';
import queryElementArray from '../utils/query-element-array';
import type { IDomLayerState } from '../types';
import type { IMarkupSelectors, IMarkupStrategy, IMarkupStrategyParams } from './types';

type OriginalSolidPosition = {
  nextSibling: ChildNode | null;
  node: HTMLElement;
  parentNode: ParentNode;
};

type AttributeSnapshot = {
  node: HTMLElement;
  value: string | null;
};

type StyleSnapshot = {
  hadStyleAttribute: boolean;
  node: HTMLElement;
  styles: Record<string, string>;
};

export default class GeneratedMarkupStrategy implements IMarkupStrategy {
  private readonly _report: IMarkupStrategyParams['report'];
  private readonly _rootNode: HTMLElement;
  private readonly _selectors: IMarkupSelectors;
  private _ariaHiddenSnapshots: AttributeSnapshot[] = [];
  private _customMaskNodeArray: HTMLElement[] = [];
  private _clonedSolidNodeSet = new WeakSet<HTMLElement>();
  private _isCustomMarkup = false;
  private _maskNodeArray: HTMLElement[] = [];
  private _originalSolidNodeArray: HTMLElement[] = [];
  private _originalSolidPositionArray: OriginalSolidPosition[] = [];
  private _styleSnapshots: StyleSnapshot[] = [];

  constructor({ report, rootNode, selectors }: IMarkupStrategyParams) {
    this._report = report;
    this._rootNode = rootNode;
    this._selectors = selectors;
  }

  /** Builds adapter-owned markup and connects it to the layer states. */
  public prepare(layerStateArray: IDomLayerState[]): IDomLayerState[] {
    if (this._maskNodeArray.length > 0) {
      this.cleanup();
    }
    this._initCustomMarkup(layerStateArray.length);
    this._applyStyles(this._rootNode, NotInteractiveStyles);
    this._originalSolidNodeArray = queryElementArray({ selector: this._selectors.solid, parent: this._rootNode });
    this._originalSolidPositionArray = this._originalSolidNodeArray
      .filter((node) => node.parentNode)
      .map((node) => ({
        nextSibling: node.nextSibling,
        node,
        parentNode: node.parentNode as ParentNode,
      }));

    const nextLayerStateArray = layerStateArray.map((state, stateIndex) => {
      const maskNode = this._isCustomMarkup ? this._customMaskNodeArray[stateIndex] : document.createElement('div');
      const maskInnerNode = this._isCustomMarkup
        ? (maskNode.querySelector<HTMLElement>(this._selectors.maskInner) as HTMLElement)
        : document.createElement('div');

      if (this._isCustomMarkup) {
        this._applyStyles(maskNode, { ...CroppedFullAbsoluteStyles, transform: '' });
        this._applyStyles(maskInnerNode, { ...CroppedFullAbsoluteStyles, transform: '' });
      } else {
        assignInlineStyles(maskNode, CroppedFullAbsoluteStyles);
        assignInlineStyles(maskInnerNode, CroppedFullAbsoluteStyles);
        maskNode.dataset.immerserMask = '';
        maskInnerNode.dataset.immerserMaskInner = '';
      }

      this._originalSolidNodeArray.forEach((childNode) => {
        const clonedChildNode = childNode.cloneNode(true);
        if (clonedChildNode instanceof HTMLElement) {
          assignInlineStyles(clonedChildNode, InteractiveStyles);
          this._clonedSolidNodeSet.add(clonedChildNode);
          maskInnerNode.appendChild(clonedChildNode);
        }
      });

      const clonedSolidNodeList = queryElementArray<HTMLElement>({
        selector: this._selectors.solid,
        parent: maskInnerNode,
      });
      forEachNode(clonedSolidNodeList, (clonedSolidNode) => {
        const solidId = clonedSolidNode.dataset.immerserSolid;
        if (
          this._clonedSolidNodeSet.has(clonedSolidNode) &&
          solidId &&
          state.solidClassnames &&
          Object.prototype.hasOwnProperty.call(state.solidClassnames, solidId)
        ) {
          clonedSolidNode.classList.add(state.solidClassnames[solidId]);
        }
      });

      if (stateIndex !== 0) {
        if (this._isCustomMarkup) {
          this._ariaHiddenSnapshots.push({ node: maskNode, value: maskNode.getAttribute('aria-hidden') });
        }
        maskNode.setAttribute('aria-hidden', 'true');
      }

      if (!this._isCustomMarkup) {
        maskNode.appendChild(maskInnerNode);
        this._rootNode.appendChild(maskNode);
      }
      this._maskNodeArray.push(maskNode);

      return { ...state, maskNode, maskInnerNode };
    });

    this._detachOriginalSolidNodes();
    return nextLayerStateArray;
  }

  /** Restores the original solids and removes adapter-owned markup. */
  public cleanup(): void {
    this._restoreOriginalSolidNodes();
    this._cleanupClonedMarkup();
    this._restoreAriaHidden();
    this._restoreStyles();
    this._clonedSolidNodeSet = new WeakSet<HTMLElement>();
    this._maskNodeArray = [];
    this._customMaskNodeArray = [];
    this._isCustomMarkup = false;
    this._originalSolidNodeArray = [];
    this._originalSolidPositionArray = [];
  }

  /** Detects reusable custom masks and prepares their existing children for interaction. */
  private _initCustomMarkup(layerCount: number): void {
    this._customMaskNodeArray = queryElementArray({ selector: this._selectors.mask, parent: this._rootNode });
    this._isCustomMarkup = this._customMaskNodeArray.length === layerCount;

    if (this._customMaskNodeArray.length > 0 && !this._isCustomMarkup) {
      this._report({
        message: `You're trying use custom markup, but count of your immerser masks doesn't equal layers count.`,
        isWarning: true,
        docsHash: '#cloning-event-listeners',
      });
    }

    if (this._isCustomMarkup) {
      this._customMaskNodeArray.forEach((customMaskNode, maskIndex) => {
        if (!customMaskNode.querySelector(this._selectors.maskInner)) {
          const message = `custom markup mask-inner not found for mask at index ${maskIndex}.`;
          this._report({
            message,
            docsHash: '#cloning-event-listeners',
          });
          throw new Error(message);
        }
      });
    }

    this._customMaskNodeArray.forEach((customMaskNode) => {
      const maskInnerNode = customMaskNode.querySelector<HTMLElement>(this._selectors.maskInner);
      if (!maskInnerNode) {
        return;
      }
      Array.from(maskInnerNode.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          this._applyStyles(child, InteractiveStyles);
        }
      });
    });
  }

  /** Detaches original solids while their generated clones are active. */
  private _detachOriginalSolidNodes(): void {
    this._originalSolidNodeArray.forEach((childNode) => {
      if (this._rootNode.contains(childNode) && childNode.parentNode) {
        childNode.parentNode.removeChild(childNode);
      }
    });
  }

  /** Returns detached solids to their original parents and sibling positions. */
  private _restoreOriginalSolidNodes(): void {
    this._originalSolidPositionArray.slice().reverse().forEach(({ nextSibling, node, parentNode }) => {
      const referenceNode = nextSibling?.parentNode === parentNode ? nextSibling : null;
      parentNode.insertBefore(node, referenceNode);
    });
  }

  /** Removes generated masks or only adapter-owned effects from custom masks. */
  private _cleanupClonedMarkup(): void {
    this._maskNodeArray.forEach((immerserMaskNode) => {
      if (this._isCustomMarkup) {
        const immerserMaskInnerNode = immerserMaskNode.querySelector<HTMLElement>(this._selectors.maskInner);
        if (!immerserMaskInnerNode) {
          return;
        }
        const clonedSolidNodeArray = queryElementArray({
          selector: this._selectors.solid,
          parent: immerserMaskInnerNode,
        });
        clonedSolidNodeArray.forEach((clonedSolidNode) => {
          if (this._clonedSolidNodeSet.has(clonedSolidNode)) {
            immerserMaskInnerNode.removeChild(clonedSolidNode);
          }
        });
      } else {
        this._rootNode.removeChild(immerserMaskNode);
      }
    });
  }

  /** Restores custom mask accessibility attributes changed during preparation. */
  private _restoreAriaHidden(): void {
    this._ariaHiddenSnapshots.forEach(({ node, value }) => {
      if (value === null) {
        node.removeAttribute('aria-hidden');
      } else {
        node.setAttribute('aria-hidden', value);
      }
    });
    this._ariaHiddenSnapshots = [];
  }

  /** Preserves strategy-owned style properties for exact cleanup. */
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

  /** Restores strategy-owned style properties to their pre-bind values. */
  private _restoreStyles(): void {
    this._styleSnapshots.slice().reverse().forEach(({ hadStyleAttribute, node, styles }) => {
      assignInlineStyles(node, styles);
      if (!hadStyleAttribute && node.getAttribute('style') === '') {
        node.removeAttribute('style');
      }
    });
    this._styleSnapshots = [];
  }
}

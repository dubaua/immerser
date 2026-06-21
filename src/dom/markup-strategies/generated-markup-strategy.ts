import { CroppedFullAbsoluteStyles, InteractiveStyles, NotInteractiveStyles } from '../styles';
import assignInlineStyles from '../utils/assign-inline-styles';
import forEachNode from '../utils/for-each-node';
import queryElementArray from '../utils/query-element-array';
import type { IDomLayerState } from '../types';
import type { IMarkupSelectors, IMarkupStrategy, IMarkupStrategyParams } from './types';

export default class GeneratedMarkupStrategy implements IMarkupStrategy {
  private readonly _report: IMarkupStrategyParams['report'];
  private readonly _rootNode: HTMLElement;
  private readonly _selectors: IMarkupSelectors;
  private _customMaskNodeArray: HTMLElement[] = [];
  private _isCustomMarkup = false;
  private _maskNodeArray: HTMLElement[] = [];
  private _originalSolidNodeArray: HTMLElement[] = [];

  constructor({ report, rootNode, selectors }: IMarkupStrategyParams) {
    this._report = report;
    this._rootNode = rootNode;
    this._selectors = selectors;
  }

  /** Builds adapter-owned markup and connects it to the layer states. */
  public prepare(layerStateArray: IDomLayerState[]): IDomLayerState[] {
    assignInlineStyles(this._rootNode, NotInteractiveStyles);
    this._initCustomMarkup(layerStateArray.length);
    this._originalSolidNodeArray = queryElementArray({ selector: this._selectors.solid, parent: this._rootNode });

    const nextLayerStateArray = layerStateArray.map((state, stateIndex) => {
      const maskNode = this._isCustomMarkup ? this._customMaskNodeArray[stateIndex] : document.createElement('div');
      assignInlineStyles(maskNode, CroppedFullAbsoluteStyles);

      let maskInnerNode = this._isCustomMarkup
        ? maskNode.querySelector<HTMLElement>(this._selectors.maskInner)
        : document.createElement('div');
      if (!maskInnerNode) {
        maskInnerNode = document.createElement('div');
      }
      assignInlineStyles(maskInnerNode, CroppedFullAbsoluteStyles);

      if (!this._isCustomMarkup) {
        maskNode.dataset.immerserMask = '';
        maskInnerNode.dataset.immerserMaskInner = '';
      }

      this._originalSolidNodeArray.forEach((childNode) => {
        const clonedChildNode = childNode.cloneNode(true);
        if (clonedChildNode instanceof HTMLElement) {
          assignInlineStyles(clonedChildNode, InteractiveStyles);
          (clonedChildNode as any).__immerserCloned = true;
          maskInnerNode.appendChild(clonedChildNode);
        }
      });

      const clonedSolidNodeList = queryElementArray<HTMLElement>({
        selector: this._selectors.solid,
        parent: maskInnerNode,
      });
      forEachNode(clonedSolidNodeList, (clonedSolidNode) => {
        const solidId = clonedSolidNode.dataset.immerserSolid;
        if (state.solidClassnames && Object.prototype.hasOwnProperty.call(state.solidClassnames, solidId)) {
          clonedSolidNode.classList.add(state.solidClassnames[solidId]);
        }
      });

      if (stateIndex !== 0) {
        maskNode.setAttribute('aria-hidden', 'true');
      }

      maskNode.appendChild(maskInnerNode);
      this._rootNode.appendChild(maskNode);
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
    this._maskNodeArray = [];
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

    this._customMaskNodeArray.forEach((customMaskNode) => {
      const maskInnerNode = customMaskNode.querySelector<HTMLElement>(this._selectors.maskInner);
      if (!maskInnerNode) {
        return;
      }
      Array.from(maskInnerNode.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          assignInlineStyles(child, InteractiveStyles);
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

  /** Returns detached solids to the root during generated markup cleanup. */
  private _restoreOriginalSolidNodes(): void {
    this._originalSolidNodeArray.forEach((childNode) => {
      this._rootNode.appendChild(childNode);
    });
  }

  /** Removes generated masks or only adapter-owned effects from custom masks. */
  private _cleanupClonedMarkup(): void {
    this._maskNodeArray.forEach((immerserMaskNode) => {
      if (this._isCustomMarkup) {
        immerserMaskNode.removeAttribute('style');
        immerserMaskNode.removeAttribute('aria-hidden');
        const immerserMaskInnerNode = immerserMaskNode.querySelector<HTMLElement>(this._selectors.maskInner);
        if (!immerserMaskInnerNode) {
          return;
        }
        immerserMaskInnerNode.removeAttribute('style');
        const clonedSolidNodeArray = queryElementArray({
          selector: this._selectors.solid,
          parent: immerserMaskInnerNode,
        });
        clonedSolidNodeArray.forEach((clonedSolidNode) => {
          if ((clonedSolidNode as any).__immerserCloned) {
            immerserMaskInnerNode.removeChild(clonedSolidNode);
          }
        });
      } else {
        this._rootNode.removeChild(immerserMaskNode);
      }
    });
  }
}

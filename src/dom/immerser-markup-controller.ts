import { CroppedFullAbsoluteStyles, InteractiveStyles, NotInteractiveStyles } from './styles';
import assignInlineStyles from './utils/assign-inline-styles';
import queryElementArray from './utils/query-element-array';
import type { IDomLayerState, IReportParams } from './types';

interface IMarkupSelectors {
  mask: string;
  maskInner: string;
  solid: string;
}

interface IMarkupControllerParams {
  report(params: IReportParams): void;
  rootNode: HTMLElement;
  selectors: IMarkupSelectors;
}

interface IMaskMarkup {
  maskInnerNode: HTMLElement;
  maskNode: HTMLElement;
}

interface IMaskMarkupResolution {
  maskMarkupArray: IMaskMarkup[];
  shouldCreateMasks: boolean;
}

interface IClonedSolid {
  maskInnerNode: HTMLElement;
  node: HTMLElement;
}

export default class ImmerserMarkupController {
  private readonly _report: IMarkupControllerParams['report'];
  private readonly _rootNode: HTMLElement;
  private readonly _selectors: IMarkupSelectors;
  private _clonedSolidArray: IClonedSolid[] = [];
  private _createdMaskMarkupArray: IMaskMarkup[] = [];
  private _maskMarkupArray: IMaskMarkup[] = [];
  private _originalSolidNodeArray: HTMLElement[] = [];
  private _solidNodeArray: HTMLElement[] = [];

  /** Stores DOM dependencies used by the markup lifecycle. */
  constructor({ report, rootNode, selectors }: IMarkupControllerParams) {
    this._report = report;
    this._rootNode = rootNode;
    this._selectors = selectors;
  }

  /** Resolves markup ownership from the current DOM and prepares all runtime nodes. */
  public prepare(layerStateArray: IDomLayerState[]): IDomLayerState[] {
    if (this._maskMarkupArray.length > 0) {
      this.cleanup();
    }

    const { maskMarkupArray, shouldCreateMasks } = this._resolveMaskMarkup(layerStateArray.length);
    const nextLayerStateArray = this._connectLayerStates(layerStateArray, maskMarkupArray);
    const originalSolidNodeArray = this._findSourceSolids(maskMarkupArray);
    const clonedSolidArray = this._cloneSolids(nextLayerStateArray, originalSolidNodeArray);
    const solidNodeArray = this._collectSolidNodes(maskMarkupArray, clonedSolidArray);

    this._reportEmptyMarkup(originalSolidNodeArray, maskMarkupArray);
    this._applyTechnicalStyles(maskMarkupArray, solidNodeArray);
    this._commitNodes(maskMarkupArray, clonedSolidArray, shouldCreateMasks);
    if (shouldCreateMasks) {
      this._applyAriaHidden(maskMarkupArray);
    }
    this._savePreparedState(
      maskMarkupArray,
      clonedSolidArray,
      originalSolidNodeArray,
      solidNodeArray,
      shouldCreateMasks,
    );
    this._detachOriginalSolids(originalSolidNodeArray);

    return nextLayerStateArray;
  }

  /** Removes only controller-owned nodes and clears controller-owned DOM effects. */
  public cleanup(): void {
    this._removeClonedSolids();
    this._restoreOriginalSolids();
    this._clearTechnicalStyles();
    this._removeCreatedMasks();
    this._reset();
  }

  /** Uses complete existing masks or creates a detached mask set when none exists. */
  private _resolveMaskMarkup(layerCount: number): IMaskMarkupResolution {
    const existingMaskNodeArray = queryElementArray({ selector: this._selectors.mask, parent: this._rootNode });
    if (existingMaskNodeArray.length === 0) {
      return {
        maskMarkupArray: Array.from({ length: layerCount }, () => this._createMaskMarkup()),
        shouldCreateMasks: true,
      };
    }
    if (existingMaskNodeArray.length !== layerCount) {
      const message = 'existing markup mask count differs from count of layers.';
      this._report({ message, docsHash: '#prepare-your-markup' });
      throw new Error(message);
    }
    return {
      maskMarkupArray: existingMaskNodeArray.map((maskNode, maskIndex) => this._connectMaskInner(maskNode, maskIndex)),
      shouldCreateMasks: false,
    };
  }

  /** Creates one detached mask and its required inner node. */
  private _createMaskMarkup(): IMaskMarkup {
    const maskNode = document.createElement('div');
    const maskInnerNode = document.createElement('div');
    maskNode.dataset.immerserMask = '';
    maskInnerNode.dataset.immerserMaskInner = '';
    maskNode.appendChild(maskInnerNode);
    return { maskInnerNode, maskNode };
  }

  /** Validates and connects the inner node belonging to an existing mask. */
  private _connectMaskInner(maskNode: HTMLElement, maskIndex: number): IMaskMarkup {
    const maskInnerNode = maskNode.querySelector<HTMLElement>(this._selectors.maskInner);
    if (!maskInnerNode) {
      const message = `existing markup mask-inner not found for mask at index ${maskIndex}.`;
      this._report({ message, docsHash: '#prepare-your-markup' });
      throw new Error(message);
    }
    return { maskInnerNode, maskNode };
  }

  /** Associates each layer state with its corresponding validated mask pair. */
  private _connectLayerStates(layerStateArray: IDomLayerState[], maskMarkupArray: IMaskMarkup[]): IDomLayerState[] {
    return layerStateArray.map((state, stateIndex) => ({
      ...state,
      ...maskMarkupArray[stateIndex],
    }));
  }

  /** Finds source solids while excluding client-owned content already placed inside masks. */
  private _findSourceSolids(maskMarkupArray: IMaskMarkup[]): HTMLElement[] {
    return queryElementArray({ selector: this._selectors.solid, parent: this._rootNode }).filter(
      (solidNode) => !maskMarkupArray.some(({ maskNode }) => maskNode.contains(solidNode)),
    );
  }

  /** Collects existing and cloned solids that require interactive technical styles. */
  private _collectSolidNodes(maskMarkupArray: IMaskMarkup[], clonedSolidArray: IClonedSolid[]): HTMLElement[] {
    const existingSolidNodeArray = maskMarkupArray.flatMap(({ maskInnerNode }) =>
      queryElementArray({ selector: this._selectors.solid, parent: maskInnerNode }),
    );
    return [...existingSolidNodeArray, ...clonedSolidArray.map(({ node }) => node)];
  }

  /** Builds configured clones and records the inner node that will receive each clone. */
  private _cloneSolids(layerStateArray: IDomLayerState[], originalSolidNodeArray: HTMLElement[]): IClonedSolid[] {
    return layerStateArray.reduce<IClonedSolid[]>((result, { maskInnerNode, solidClassnames }) => {
      originalSolidNodeArray.forEach((originalSolidNode) => {
        const clonedSolidNode = originalSolidNode.cloneNode(true);
        if (clonedSolidNode instanceof HTMLElement) {
          const solidId = clonedSolidNode.dataset.immerserSolid;
          const classname = solidId ? solidClassnames?.[solidId] : undefined;
          if (classname) {
            clonedSolidNode.classList.add(classname);
          }
          result.push({ maskInnerNode, node: clonedSolidNode });
        }
      });
      return result;
    }, []);
  }

  /** Warns when neither source solids nor existing mask content can produce a visual result. */
  private _reportEmptyMarkup(originalSolidNodeArray: HTMLElement[], maskMarkupArray: IMaskMarkup[]): void {
    if (
      originalSolidNodeArray.length === 0 &&
      maskMarkupArray.every(({ maskInnerNode }) => maskInnerNode.children.length === 0)
    ) {
      this._report({
        message: 'immerser will do nothing without source solids or existing mask content.',
        docsHash: '#prepare-your-markup',
        isWarning: true,
      });
    }
  }

  /** Replaces inline styles on controller-managed runtime nodes with technical styles. */
  private _applyTechnicalStyles(maskMarkupArray: IMaskMarkup[], solidNodeArray: HTMLElement[]): void {
    this._setTechnicalStyles(this._rootNode, NotInteractiveStyles);
    maskMarkupArray.forEach(({ maskInnerNode, maskNode }) => {
      this._setTechnicalStyles(maskNode, { ...CroppedFullAbsoluteStyles, transform: '' });
      this._setTechnicalStyles(maskInnerNode, { ...CroppedFullAbsoluteStyles, transform: '' });
    });
    solidNodeArray.forEach((node) => {
      this._setTechnicalStyles(node, InteractiveStyles);
    });
  }

  /** Drops client inline styles before assigning the complete technical style set. */
  private _setTechnicalStyles(node: HTMLElement, styles: Record<string, string>): void {
    node.removeAttribute('style');
    assignInlineStyles(node, styles);
  }

  /** Inserts staged clones and appends controller-created masks to the live root. */
  private _commitNodes(
    maskMarkupArray: IMaskMarkup[],
    clonedSolidArray: IClonedSolid[],
    shouldCreateMasks: boolean,
  ): void {
    clonedSolidArray.forEach(({ maskInnerNode, node }) => {
      maskInnerNode.appendChild(node);
    });
    if (shouldCreateMasks) {
      maskMarkupArray.forEach(({ maskNode }) => this._rootNode.appendChild(maskNode));
    }
  }

  /** Hides duplicate content only on masks created by this controller. */
  private _applyAriaHidden(maskMarkupArray: IMaskMarkup[]): void {
    maskMarkupArray.forEach(({ maskNode }, maskIndex) => {
      if (maskIndex !== 0) {
        maskNode.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /** Stores only references required to clean the committed markup lifecycle. */
  private _savePreparedState(
    maskMarkupArray: IMaskMarkup[],
    clonedSolidArray: IClonedSolid[],
    originalSolidNodeArray: HTMLElement[],
    solidNodeArray: HTMLElement[],
    shouldCreateMasks: boolean,
  ): void {
    this._clonedSolidArray = clonedSolidArray;
    this._createdMaskMarkupArray = shouldCreateMasks ? maskMarkupArray : [];
    this._maskMarkupArray = maskMarkupArray;
    this._originalSolidNodeArray = originalSolidNodeArray;
    this._solidNodeArray = solidNodeArray;
  }

  /** Detaches source solids after every clone and mask has been committed successfully. */
  private _detachOriginalSolids(originalSolidNodeArray: HTMLElement[]): void {
    originalSolidNodeArray.forEach((solidNode) => solidNode.remove());
  }

  /** Returns detached source solids to the root in their original relative order. */
  private _restoreOriginalSolids(): void {
    this._originalSolidNodeArray.forEach((solidNode) => this._rootNode.appendChild(solidNode));
  }

  /** Removes every clone owned by this controller without touching existing mask content. */
  private _removeClonedSolids(): void {
    this._clonedSolidArray.forEach(({ node }) => node.remove());
  }

  /** Removes only masks that were created by this controller. */
  private _removeCreatedMasks(): void {
    this._createdMaskMarkupArray.forEach(({ maskNode }) => maskNode.remove());
  }

  /** Clears technical styles from the root and client-owned existing masks. */
  private _clearTechnicalStyles(): void {
    this._rootNode.removeAttribute('style');
    this._maskMarkupArray.forEach((maskMarkup) => {
      if (this._createdMaskMarkupArray.includes(maskMarkup)) {
        return;
      }
      const { maskInnerNode, maskNode } = maskMarkup;
      maskNode.removeAttribute('style');
      maskInnerNode.removeAttribute('style');
    });
    this._solidNodeArray.forEach((node) => node.removeAttribute('style'));
  }

  /** Clears committed ownership references after cleanup completes. */
  private _reset(): void {
    this._clonedSolidArray = [];
    this._createdMaskMarkupArray = [];
    this._maskMarkupArray = [];
    this._originalSolidNodeArray = [];
    this._solidNodeArray = [];
  }
}

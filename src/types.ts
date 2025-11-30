import type Immerser from './immerser';

export type LayerState = {
  beginEnter: number;
  beginLeave: number;
  endEnter: number;
  endLeave: number;
  id: string;
  layerBottom: number;
  layerTop: number;
  maskInnerNode: HTMLElement | null;
  maskNode: HTMLElement | null;
  layerNode: HTMLElement;
  solidClassnames: SolidClassnames | null;
};

/** @public Map of solid id to classname. */
export interface SolidClassnames {
  [key: string]: string;
}

/** @public Runtime configuration accepted by immerser (see README Options for defaults and details). */
export type Options = {
  /** Per-layer map of solid id → classname; can be overridden per layer via data-immerser-layer-config. */
  solidClassnameArray: SolidClassnames[];
  /** Minimal viewport width (px) at which immerser binds; below it will unbind. */
  fromViewportWidth: number;
  /** Portion of viewport height that must overlap the next layer before pager switches (0–1). */
  pagerThreshold: number;
  /** Whether to push active layer id into URL hash on change. */
  hasToUpdateHash: boolean;
  /** Pixel threshold near section edges that triggers scroll snapping when exceeded, if 0 - no adjusting. */
  scrollAdjustThreshold: number;
  /** Delay in ms before running scroll snapping after user scroll stops. */
  scrollAdjustDelay: number;
  /** Classname added to pager link pointing to the active layer. */
  pagerLinkActiveClassname: string;
  /** If false, immerser will not attach its own scroll listener (use external controller). */
  isScrollHandled: boolean;
  /** Callback fired after init; receives immerser instance. */
  onInit: ((immerser: Immerser) => void) | null;
  /** Callback fired after bind; receives immerser instance. */
  onBind: ((immerser: Immerser) => void) | null;
  /** Callback fired after unbind; receives immerser instance. */
  onUnbind: ((immerser: Immerser) => void) | null;
  /** Callback fired after destroy; receives immerser instance. */
  onDestroy: ((immerser: Immerser) => void) | null;
  /** Callback fired when active layer changes; receives next index and immerser instance. */
  onActiveLayerChange: ((layerIndex: number, immerser: Immerser) => void) | null;
};

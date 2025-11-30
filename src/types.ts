import Immerser from '@/immerser';

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

export interface SolidClassnames {
  [key: string]: string;
}

export type Options = {
  solidClassnameArray: SolidClassnames[];
  fromViewportWidth: number;
  pagerThreshold: number;
  hasToUpdateHash: boolean;
  scrollAdjustThreshold: number;
  scrollAdjustDelay: number;
  pagerLinkActiveClassname: string;
  isScrollHandled: boolean;
  onInit: ((immerser: Immerser) => void) | null;
  onBind: ((immerser: Immerser) => void) | null;
  onUnbind: ((immerser: Immerser) => void) | null;
  onDestroy: ((immerser: Immerser) => void) | null;
  onActiveLayerChange: ((layerIndex: number, immerser: Immerser) => void) | null;
};

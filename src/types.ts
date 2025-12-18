import type Immerser from './immerser';
import { EVENT_NAMES } from './options';

/** @internal Runtime metrics for each layer. */
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

/** @public All available immerser event names. */
export type EventName = (typeof EVENT_NAMES)[number];

/** @public Base handler signature for immerser lifecycle events. */
export type BaseHandler = (immerser: Immerser) => void;
/** @public Handler signature for active layer change events. */
export type ActiveLayerChangeHandler = (layerIndex: number, immerser: Immerser) => void;
/** @public Handler signature for layers update events. */
export type LayersUpdateHandler = (layersProgress: number[], immerser: Immerser) => void;

// key EventName value BaseHandler ActiveLayerChangeHandler LayersUpdateHandler
/** @public Map of immerser event names to handler signatures. */
export type HandlerByEventName = {
  init: BaseHandler;
  bind: BaseHandler;
  unbind: BaseHandler;
  destroy: BaseHandler;
  activeLayerChange: ActiveLayerChangeHandler;
  layersUpdate: LayersUpdateHandler;
};

type HandlerArgsMap = {
  [K in EventName]: Parameters<HandlerByEventName[K]>;
};

/** @internal Helper to infer argument tuple for the given event name. */
export type HandlerArgs<K extends EventName> = HandlerArgsMap[K];

/** @public Map of event names to handler signatures. */
export type EventHandlers = { [K in EventName]?: HandlerByEventName[K] };

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
  /** If false, immerser will not attach its own scroll listener.
   * Intended to use with external scroll controller and calling `syncScroll` method on immerser instance.
   */
  isScrollHandled: boolean;
  /** Enables runtime reporting of warnings and errors. */
  debug?: boolean;
  /** Initial event handlers keyed by event name. */
  on?: Partial<EventHandlers>;
};

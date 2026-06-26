import type Immerser from './immerser';
import { EventNames } from './events';

/** @public Map of solid id to classname. */
export interface SolidClassnames {
  [key: string]: string;
}

/** @public Map of layer id to solid classname map. */
export interface SolidClassnamesByLayerId {
  [key: string]: SolidClassnames;
}

/** @public All available immerser event names. */
export type EventName = (typeof EventNames)[keyof typeof EventNames];

/** @public Base handler signature for immerser lifecycle events. */
export type BaseHandler = (immerser: Immerser) => void;
/** @public Handler signature for active layer change events. */
export type ActiveLayerChangeHandler = (layerIndex: number, immerser: Immerser) => void;
/** @public Handler signature for layer progress change events. */
export type LayerProgressChangeHandler = (layerProgressArray: number[], immerser: Immerser) => void;

// key EventName value BaseHandler ActiveLayerChangeHandler LayerProgressChangeHandler
/** @public Map of immerser event names to handler signatures. */
export type HandlerByEventName = {
  [EventNames.init]: BaseHandler;
  [EventNames.mount]: BaseHandler;
  [EventNames.unmount]: BaseHandler;
  [EventNames.destroy]: BaseHandler;
  [EventNames.structureChange]: BaseHandler;
  [EventNames.layoutChange]: BaseHandler;
  [EventNames.activeLayerChange]: ActiveLayerChangeHandler;
  [EventNames.layerProgressChange]: LayerProgressChangeHandler;
  [EventNames.stateChange]: BaseHandler;
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
  /** If true, constructor runs DOM-dependent mount immediately. */
  autoMount: boolean;
  /** Parent node used only for selector discovery during mount. */
  selectorRoot?: ParentNode;
  /** Map of layer id → solid id → classname. */
  solidClassnamesByLayerId: SolidClassnamesByLayerId;
  /** Minimal viewport width (px) at which immerser mounts runtime; below it unmounts runtime. */
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
  /** If true, immerser will not attach its own scroll listener.
   * Intended to use with external scroll controller and calling `syncScroll` method on immerser instance.
   */
  hasExternalScroll: boolean;
  /** If true, immerser will not run most of DOM handling routine.
   * Intended to use with render frameworks such React, Vue.js etc.
   */
  hasExternalRenderer: boolean;
  /** Enables runtime reporting of warnings and errors. */
  debug?: boolean;
  /** Initial event handlers keyed by event name. */
  on?: Partial<EventHandlers>;
};

/** @public Options that can be updated after instance creation. */
export type RuntimeOptions = Pick<
  Options,
  'debug' | 'fromViewportWidth' | 'hasToUpdateHash' | 'pagerThreshold' | 'scrollAdjustDelay' | 'scrollAdjustThreshold'
>;

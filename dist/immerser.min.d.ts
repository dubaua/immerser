/** @public Handler signature for active layer change events. */
export declare type ActiveLayerChangeHandler = (layerIndex: number, immerser: Immerser) => void;

/** @public Base handler signature for immerser lifecycle events. */
export declare type BaseHandler = (immerser: Immerser) => void;

/** @public Style used for masks and mask inners, exposed to use with external rendered */
export declare const CroppedFullAbsoluteStyles: Record<string, string>;

/** @public Map of event names to handler signatures. */
export declare type EventHandlers = {
    [K in EventName]?: HandlerByEventName[K];
};

/** @public All available immerser event names. */
export declare type EventName = (typeof EventNames)[keyof typeof EventNames];

/** @public All available immerser event names as an iterable array. */
export declare const EventNameArray: ("init" | "mount" | "unmount" | "destroy" | "structureChange" | "layoutChange" | "activeLayerChange" | "layerProgressChange" | "stateChange")[];

/** @public All available immerser event names. */
export declare const EventNames: {
    readonly init: "init";
    readonly mount: "mount";
    readonly unmount: "unmount";
    readonly destroy: "destroy";
    readonly structureChange: "structureChange";
    readonly layoutChange: "layoutChange";
    readonly activeLayerChange: "activeLayerChange";
    readonly layerProgressChange: "layerProgressChange";
    readonly stateChange: "stateChange";
};

/** @public Map of immerser event names to handler signatures. */
export declare type HandlerByEventName = {
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

/** @public Main Immerser controller orchestrating markup preparation and scroll-driven transitions. */
declare class Immerser {
    private _options;
    private _selectors;
    private _userOptions;
    private _layerStateArray;
    private _isMounted;
    private _rootNode;
    private _selectorRoot;
    private _layerNodeArray;
    private _maskNodeArray;
    private _pagerLinkNodeArray;
    private _originalSolidNodeArray;
    private _clonedSolidArray;
    private _preparedMaskMarkupArray;
    private _solidNodeArray;
    private _synchroHoverNodeArray;
    private _activeIndex;
    private _rootHeight;
    private _viewportHeight;
    private _resizeObserver;
    private _flushFrameId;
    private _scrollAdjustTimerId;
    private _reactiveSynchroHoverId;
    private _unsubscribeSynchroHover;
    private _handlers;
    private _onResize;
    private _onScroll;
    private _onSynchroHoverMouseOver;
    private _onSynchroHoverMouseOut;
    private _isLayoutSet;
    private _layerProgressArray;
    private _structureSignature;
    private _layoutSignature;
    private _drawSignature;
    private _pendingSync;
    /** Enables warning reporting. Defaults to NODE_ENV===development. */
    debug: boolean;
    /**
     * Creates immerser instance and runs DOM setup unless autoMount is disabled.
     * @param userOptions - overrides for defaults defined in OptionConfig when they pass validation
     */
    constructor(userOptions?: Partial<Options>);
    private _init;
    /** Saves event handlers passed via options into internal registry. */
    private _registerHandlersFromOptions;
    /** Executes registered event handlers with provided arguments. */
    private _emit;
    private _report;
    /** Discovers root, layers and existing masks, then rebuilds layer state references. */
    private _syncStructure;
    /** Validates required markup and option references. */
    private _validateMarkup;
    /** Merges user options with defaults and attaches helper metadata to messages. */
    private _mergeOptions;
    private _createLayerSignature;
    private _getLayerSignature;
    private _shouldMount;
    /** Recalculates sizes and thresholds for each layer. */
    private _syncLayoutSizes;
    private _createLayoutSignature;
    private _addResizeListener;
    /** Attaches runtime listeners respecting hasExternalScroll flag. */
    private _addMountedListeners;
    /** Clears internal caches, observables and references after destroy. */
    private _resetInternalState;
    /** Connects external mask markup or prepares controller-owned markup. */
    private _prepareMarkup;
    /** Restores markup according to controller-recorded ownership. */
    private _cleanupMarkup;
    /** Collects pager links that will receive runtime active state. */
    private _initPagerLinks;
    /** Sets up hover synchronization listeners and reactive updates. */
    private _initHoverSynchronization;
    /** Removes hover synchronization listeners and reactive updates. */
    private _destroyHoverSynchronization;
    /** Clears runtime active state from pager links. */
    private _clearPagerLinks;
    private _removeResizeListener;
    /** Removes runtime listeners while keeping breakpoint resize handling alive. */
    private _removeMountedListeners;
    private _cancelFlushFrame;
    /** Clears the pending scroll-adjust timer. */
    private _clearScrollAdjustTimer;
    /** Cancels deferred runtime work before mounted markup is cleaned. */
    private _cancelScheduledRuntimeWork;
    private _invalidateStructure;
    private _invalidateLayout;
    private _invalidateDraw;
    private _scheduleFlush;
    private _flush;
    private _syncMountedStructure;
    private _drawCurrentState;
    /**
     * Captures the active index before calculation replaces the current active index.
     * Returning both values prevents callers from reading the new index as if it were the previous one.
     */
    private _calculateTransition;
    private _getLayerCalculationArray;
    private _calculate;
    private _createDrawSignature;
    /** Applies transforms based on scroll position and updates active layer state. */
    private _draw;
    /** Adds or removes active pager classname according to current layer. */
    private _drawPagerLinks;
    /** Passes active layer id to configured hash update handler. */
    private _drawHash;
    /** Syncs hover state across elements with matching synchro hover id. */
    private _drawHoverSynchronization;
    /** Adjusts scroll to layer edges when near thresholds, improving alignment. */
    private _adjustScroll;
    private _calculateScrollTarget;
    /** Invalidates draw on scroll and optionally schedules scroll snapping. */
    private _handleScroll;
    /** Invalidates layout on resize-like changes and toggles mount state by breakpoint. */
    private _handleResize;
    /** Keeps updateOptions scoped to runtime fields even when called from plain JavaScript. */
    private _pickRuntimeOptions;
    /** Connects already existing masks without creating or mutating markup. */
    private _connectExistingMaskMarkup;
    /** Uses complete existing masks by layer id or creates a detached mask set when none exists. */
    private _resolveMaskMarkup;
    /** Creates one detached mask and its required inner node. */
    private _createMaskMarkup;
    /** Validates and connects the inner node belonging to an existing mask. */
    private _connectMaskMarkup;
    /** Associates each layer state with its corresponding validated mask pair. */
    private _connectLayerStates;
    /** Finds source solids while excluding client-owned content already placed inside masks. */
    private _findSourceSolids;
    /** Builds configured clones and records the inner node that will receive each clone. */
    private _cloneSolids;
    /** Collects existing and cloned solids that require interactive technical styles. */
    private _collectSolidNodes;
    /** Warns when neither source solids nor existing mask content can produce a visual result. */
    private _reportEmptyMarkup;
    /** Replaces inline styles on controller-managed runtime nodes with technical styles. */
    private _applyTechnicalStyles;
    /** Drops client inline styles before assigning the complete technical style set. */
    private _setTechnicalStyles;
    /** Inserts staged clones and appends controller-created masks to the live root. */
    private _commitNodes;
    /** Hides duplicate content only on masks created by this instance. */
    private _applyCreatedMasksAria;
    /** Stores references required to clean the committed markup lifecycle. */
    private _savePreparedMarkupState;
    /** Detaches source solids after every clone and mask has been committed successfully. */
    private _detachOriginalSolids;
    /** Removes every clone owned by this instance without touching existing mask content. */
    private _removeClonedSolids;
    /** Returns detached source solids to the root in their original relative order. */
    private _restoreOriginalSolids;
    /** Clears technical styles from the root and client-owned existing masks. */
    private _clearTechnicalStyles;
    /** Removes only masks that were created by this instance. */
    private _removeCreatedMasks;
    /** Clears committed ownership references after cleanup completes. */
    private _resetMarkupState;
    private _resetMountedState;
    /** Discovers DOM state, validates configuration and starts runtime when breakpoint allows it. */
    mount(): void;
    /**
     * Stops runtime behavior while keeping resize handling active for breakpoint remount.
     * Safe to call multiple times; no-op when already unmounted.
     */
    unmount(): void;
    /** Updates runtime options and applies minimal side effects without remounting the instance. */
    updateOptions(userOptions: Partial<RuntimeOptions>): void;
    /**
     * Fully destroys immerser: unmounts runtime, removes resize handling, runs destroy event and clears references.
     * Use when component is permanently removed.
     */
    destroy(): void;
    /**
     * Schedules structure, layout and draw synchronization after DOM mutations.
     * Designed for dynamic content updates without reinitializing immerser.
     *
     * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
     */
    render(): void;
    /**
     * Syncs immerser with an externally controlled scroll position.
     * Designed for using with custom scroll handlers when `hasExternalScroll=true`.
     *
     * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
     */
    syncScroll(): void;
    /** Registers persistent event handler. */
    on<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void;
    /** Registers event handler that will be removed after first call. */
    once<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void;
    /** Removes handler(s) for provided event. */
    off<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void;
    /** Current active layer index derived from scroll position. */
    get activeIndex(): number;
    /** Indicates whether immerser runtime is mounted. */
    get isMounted(): boolean;
    /** The root DOM node immerser is attached to. */
    get rootNode(): HTMLElement | null;
    /** Progress of each layer from 0 (off-screen) to 1 (fully visible). */
    get layerProgressArray(): readonly number[];
}
export default Immerser;

/** @public Style for immerser solids, to make them clickable again inside not clickable immerser root, exposed to use with external rendered */
export declare const InteractiveStyles: Record<string, string>;

/** @public Handler signature for layer progress change events. */
export declare type LayerProgressChangeHandler = (layerProgressArray: number[], immerser: Immerser) => void;

/** @public Style for immerser root, to make in click transparent, exposed to use with external rendered */
export declare const NotInteractiveStyles: Record<string, string>;

/** @public Runtime configuration accepted by immerser (see README Options for defaults and details). */
export declare type Options = {
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
    /** Handles active layer id when it should be pushed into location hash. */
    updateLocationHash?: UpdateLocationHashHandler;
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
export declare type RuntimeOptions = Pick<Options, 'debug' | 'fromViewportWidth' | 'updateLocationHash' | 'pagerThreshold' | 'scrollAdjustDelay' | 'scrollAdjustThreshold'>;

/** @public Map of solid id to classname. */
export declare interface SolidClassnames {
    [key: string]: string;
}

/** @public Map of layer id to solid classname map. */
export declare interface SolidClassnamesByLayerId {
    [key: string]: SolidClassnames;
}

/** @public Handler signature for active layer hash updates. */
export declare type UpdateLocationHashHandler = (hash: string) => unknown;

export { }

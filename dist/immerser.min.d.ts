/** @public Handler signature for active layer change events. */
export declare type ActiveLayerChangeHandler = (layerIndex: number, immerser: Immerser) => void;

/** @public Base handler signature for immerser lifecycle events. */
export declare type BaseHandler = (immerser: Immerser) => void;

/** @public All available immerser event names. */
export declare const EVENT_NAMES: readonly ["init", "bind", "unbind", "destroy", "activeLayerChange", "layersUpdate"];

/** @public Map of event names to handler signatures. */
export declare type EventHandlers = {
    [K in EventName]?: HandlerByEventName[K];
};

/** @public All available immerser event names. */
export declare type EventName = (typeof EVENT_NAMES)[number];

/** @public Map of immerser event names to handler signatures. */
export declare type HandlerByEventName = {
    init: BaseHandler;
    bind: BaseHandler;
    unbind: BaseHandler;
    destroy: BaseHandler;
    activeLayerChange: ActiveLayerChangeHandler;
    layersUpdate: LayersUpdateHandler;
};

/** @public Main Immerser controller orchestrating markup cloning and scroll-driven transitions. */
declare class Immerser {
    private _options;
    private _selectors;
    private _layerStateArray;
    private _layerStateIndexById;
    private _isBound;
    private _rootNode;
    private _layerNodeArray;
    private _solidNodeArray;
    private _pagerLinkNodeArray;
    private _originalSolidNodeArray;
    private _maskNodeArray;
    private _synchroHoverNodeArray;
    private _isCustomMarkup;
    private _customMaskNodeArray;
    private _windowHeight;
    private _immerserTop;
    private _immerserHeight;
    private _resizeFrameId;
    private _resizeObserver;
    private _scrollFrameId;
    private _scrollAdjustTimerId;
    private _reactiveActiveLayer;
    private _reactiveWindowWidth;
    private _reactiveSynchroHoverId;
    private _layerProgressArray;
    private _unsubscribeRedrawingPager;
    private _unsubscribeUpdatingHash;
    private _unsubscribeActiveLayerChange;
    private _unsubscribeSynchroHover;
    private _unsubscribeToggleBindOnResize;
    private _handlers;
    private _onResize;
    private _onScroll;
    private _onSynchroHoverMouseOver;
    private _onSynchroHoverMouseOut;
    /** Enables warnings/errors reporting. Defaults to NODE_ENV===development. */
    debug: boolean;
    /**
     * Creates immerser instance and immediately runs setup with optional user options.
     * @param userOptions - overrides for defaults defined in OPTION_CONFIG if pass validation
     */
    constructor(userOptions?: Partial<Options>);
    /** Bootstraps nodes, options, state, listeners and emits init event. */
    private _init;
    /** Saves event handlers passed via options into internal registry. */
    private _registerHandlersFromOptions;
    /** Executes registered event handlers with provided arguments. */
    private _emit;
    private _report;
    /** Collects root, layer and solid nodes from DOM. */
    private _setDomNodes;
    /** Validates required markup presence and reports descriptive errors. */
    private _validateMarkup;
    /** Merges user options with defaults and attaches helper metadata to messages. */
    private _mergeOptions;
    /** Reads per-layer classname configs from data attributes if provided. */
    private _readClassnamesFromMarkup;
    /** Ensures classname configuration length matches layers count. */
    private _validateSolidClassnameArray;
    /** Assigns ids to layers when missing and records their indexes. */
    private _initSectionIds;
    /** Creates initial LayerState entries for every layer. */
    private _initLayerStateArray;
    /** Verifies solid classnames are configured; otherwise warns via showError. */
    private _validateClassnames;
    /** Subscribes to window width changes to bind/unbind based on breakpoint. */
    private _toggleBindOnResizeObserver;
    /** Recalculates sizes and thresholds for each layer and updates window width observable. */
    private _setSizes;
    /** Attaches scroll and resize listeners respecting isScrollHandled flag. */
    private _addScrollAndResizeListeners;
    /** Clears internal caches, observables and references after destroy. */
    private _resetInternalState;
    /** Builds masks, clones solids, applies classes and mounts generated markup. */
    private _createMarkup;
    /** Validates and prepares custom masks, binding interactive styles to their children. */
    private _initCustomMarkup;
    /** Removes original solid nodes from root after clones are in place. */
    private _detachOriginalSolidNodes;
    /** Parses pager links and maps them to layer indexes using href hash. */
    private _initPagerLinks;
    /** Sets up synchro hover listeners and reactive updates. */
    private _initHoverSynchro;
    /** Subscribes to reactive values to redraw pager, hash, callbacks and hover. */
    private _attachCallbacks;
    /** Unsubscribes from all reactive callbacks. */
    private _detachCallbacks;
    /** Removes hover listeners from synchro hover nodes. */
    private _removeSyncroHoverListeners;
    /** Drops autogenerated ids from layers on teardown. */
    private _clearCustomSectionIds;
    /** Restores original solid nodes back into the root node. */
    private _restoreOriginalSolidNodes;
    /** Removes cloned markup or cleans up custom masks when unbinding. */
    private _cleanupClonedMarkup;
    private _removeScrollAndResizeListeners;
    /** Calculates per-layer progress (0..1) based on which part of screen the layer overlaps. */
    private _setLayersProgress;
    /** Applies transforms based on scroll position and updates active layer state. */
    private _draw;
    /** Adds or removes active pager classname according to current layer. */
    private _drawPagerLinks;
    /** Updates window hash to match active layer id. */
    private _drawHash;
    /** Syncs hover state across elements with matching synchroHover id. */
    private _drawSynchroHover;
    /** Adjusts scroll to layer edges when near thresholds, improving alignment. */
    private _adjustScroll;
    /** RAF-throttled scroll handler that draws and optionally snaps scroll. */
    private _handleScroll;
    /** RAF-throttled resize handler that recalculates sizes and redraws. */
    private _handleResize;
    /**
     * Prepares markup, attaches listeners and triggers first draw; also emits bind event.
     * Intended to be idempotent for toggling immerser on when viewport width allows.
     */
    bind(): void;
    /**
     * Tears down generated markup and listeners, restores DOM, resets active layer and emits unbind event.
     * Safe to call multiple times; no-op when already unbound.
     */
    unbind(): void;
    /**
     * Fully destroys immerser: unbinds, removes window listeners, runs destroy event and clears all references.
     * Use when component is permanently removed.
     */
    destroy(): void;
    /**
     * Manually recomputes sizes and redraws masks; call after DOM mutations that change layout.
     * Exposed for dynamic content updates without reinitializing immerser.
     *
     * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
     */
    render(): void;
    /**
     * Syncs immerser with an externally controlled scroll position.
     * `isScrollHandled=false` option flag is required to call this method.
     * Call when using a custom scroll engine.
     *
     * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
     */
    syncScroll(): void;
    /** Register persistent event handler. */
    on<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void;
    /** Register event handler that will be removed after first call. */
    once<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void;
    /** Removes handler(s) for provided event. */
    off<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void;
    /** Current active layer index derived from scroll position. */
    get activeIndex(): number;
    /** Indicates whether immerser is currently bound (markup cloned and listeners attached). */
    get isBound(): boolean;
    /** The root DOM node immerser is attached to. */
    get rootNode(): HTMLElement;
    /** Progress of each layer from 0 (off-screen) to 1 (fully visible). */
    get layerProgressArray(): readonly number[];
}
export default Immerser;

/** @public Handler signature for layers update events. */
export declare type LayersUpdateHandler = (layersProgress: number[], immerser: Immerser) => void;

/** @public Runtime configuration accepted by immerser (see README Options for defaults and details). */
export declare type Options = {
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

/** @public Map of solid id to classname. */
export declare interface SolidClassnames {
    [key: string]: string;
}

export { }

/** @public Handler signature for active layer change events. */
export declare type ActiveLayerChangeHandler = (layerIndex: number, immerser: Immerser) => void;

/** @public Base handler signature for immerser lifecycle events. */
export declare type BaseHandler = (immerser: Immerser) => void;

/** @public Map of event names to handler signatures. */
export declare type EventHandlers = {
    [K in EventName]?: HandlerByEventName[K];
};

/** @public All available immerser event names. */
export declare type EventName = (typeof EventNames)[number];

/** @public All available immerser event names. */
export declare const EventNames: readonly ["init", "bind", "unbind", "destroy", "activeLayerChange", "layersUpdate"];

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
    private _userOptions;
    private _layerStateById;
    private _isMounted;
    private _isBound;
    private _rootNode;
    private _layerNodeArray;
    private _pagerLinkNodeArray;
    private _synchroHoverNodeArray;
    private _resizeFrameId;
    private _resizeObserver;
    private _scrollFrameId;
    private _scrollAdjustTimerId;
    private _reactiveWindowWidth;
    private _reactiveSynchroHoverId;
    private _unsubscribeSynchroHover;
    private _unsubscribeToggleBindOnResize;
    private _handlers;
    private _onResize;
    private _onScroll;
    private _onSynchroHoverMouseOver;
    private _onSynchroHoverMouseOut;
    private _originalSolidNodeArray;
    private _preparedLayerMarkupById;
    private _layerCalculationArray;
    private _layout;
    private _snapshot;
    /** Enables warnings/errors reporting. Defaults to NODE_ENV===development. */
    debug: boolean;
    /**
     * Creates immerser instance and runs DOM setup unless autoMount is disabled.
     * @param userOptions - overrides for defaults defined in OptionConfig if pass validation
     */
    constructor(userOptions?: Partial<Options>);
    private _init;
    /** Merges user options with defaults and attaches helper metadata to messages. */
    private _mergeOptions;
    /** Saves event handlers passed via options into internal registry. */
    private _registerHandlersFromOptions;
    /** Executes registered event handlers with provided arguments. */
    private _emit;
    private _report;
    /** Returns layer states in DOM order for the array-based calculation boundary. */
    private get _orderedLayerStateArray();
    /** Collects root, layer and solid nodes from DOM. */
    private _setDomNodes;
    /** Validates required markup presence and reports descriptive errors. */
    private _validateMarkup;
    /** Reads per-layer classname configs from data attributes if provided. */
    private _readClassnamesFromMarkup;
    /** Ensures every layer has the explicit unique id required by the public contract. */
    private _validateLayerIds;
    /** Ensures classname configuration references only existing layer ids. */
    private _validateSolidClassnamesConfig;
    /** Creates initial LayerState entries for every layer. */
    private _initLayerStateMap;
    /** Adds one validated layer state to the registry. */
    private _addLayerState;
    /** Ensures dynamic layer input does not break id/order based runtime addressing. */
    private _validateLayerStateInput;
    /** Subscribes to window width changes to enable/disable runtime based on breakpoint. */
    private _toggleBindOnResizeObserver;
    /** Recalculates sizes and thresholds for each layer and updates window width observable. */
    private _setSizes;
    /** Attaches scroll and resize listeners respecting isScrollHandled flag. */
    private _addScrollAndResizeListeners;
    /** Attaches the scroll listener once when scroll handling is enabled. */
    private _addScrollListener;
    /** Clears internal caches, observables and references after destroy. */
    private _resetInternalState;
    /** Prepares markup from the current DOM structure. */
    private _prepareMarkup;
    /** Restores markup according to controller-recorded ownership. */
    private _cleanupMarkup;
    /** Writes an updated layer state into the id registry. */
    private _setLayerState;
    /** Applies created mask aria-hidden according to current layer order. */
    private _syncCreatedMasksAria;
    /** Collects pager links that will receive runtime active state. */
    private _initPagerLinks;
    /** Sets up synchro hover listeners and reactive updates. */
    private _initHoverSynchro;
    /** Subscribes to synchronized hover updates. */
    private _attachCallbacks;
    /** Unsubscribes from synchronized hover updates. */
    private _detachCallbacks;
    /** Removes hover listeners from synchro hover nodes. */
    private _removeSyncroHoverListeners;
    /** Clears runtime active state from pager links. */
    private _clearPagerLinks;
    /** Removes browser listeners that outlive individual runtime cycles. */
    private _removeScrollAndResizeListeners;
    /** Removes the scroll listener if it is attached. */
    private _removeScrollListener;
    /** Cancels the pending scroll animation frame. */
    private _cancelScrollFrame;
    /** Cancels the pending resize animation frame. */
    private _cancelResizeFrame;
    /** Clears the pending scroll-adjust timer. */
    private _clearScrollAdjustTimer;
    /** Cancels deferred runtime work before bound markup is cleaned. */
    private _cancelScheduledRuntimeWork;
    /**
     * Captures the active index before calculation replaces the current snapshot.
     * Returning both values prevents callers from reading the new index as if it were the previous one.
     */
    private _calculateSnapshotTransition;
    private _calculate;
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
    private _calculateScrollTarget;
    /** RAF-throttled scroll handler that draws and optionally snaps scroll. */
    private _handleScroll;
    /** RAF-throttled resize handler that recalculates sizes and redraws. */
    private _handleResize;
    /** Keeps updateOptions scoped to runtime fields even when called from plain JavaScript. */
    private _pickRuntimeOptions;
    /** Resolves markup ownership from the current DOM and prepares one runtime layer. */
    private prepareLayer;
    /** Removes only DOM effects owned for one prepared layer. */
    private cleanupLayer;
    /** Removes every controller-owned layer and clears global DOM effects. */
    private cleanup;
    /** Keeps aria hidden on generated duplicate masks only. */
    private syncCreatedMasksAria;
    /** Finds source solids once and reuses detached originals for dynamic layer preparation. */
    private _ensureSourceSolids;
    /** Uses an existing mask for layer id or creates a detached mask pair. */
    private _resolveMaskMarkup;
    /** Creates one detached mask and its required inner node. */
    private _createMaskMarkup;
    /** Validates and connects the inner node belonging to an existing mask. */
    private _connectMaskMarkup;
    /** Builds configured clones for one layer. */
    private _cloneSolids;
    /** Collects existing and cloned solids that require interactive technical styles. */
    private _collectSolidNodes;
    /** Warns when neither source solids nor existing mask content can produce a visual result. */
    private _reportEmptyMarkup;
    /** Replaces inline styles on controller-managed runtime nodes with technical styles. */
    private _applyTechnicalStyles;
    /** Drops client inline styles before assigning the complete technical style set. */
    private _setTechnicalStyles;
    /** Inserts staged clones and appends controller-created mask to the live root. */
    private _commitNodes;
    /** Detaches source solids after every clone and mask has been committed successfully. */
    private _detachOriginalSolids;
    /** Returns detached source solids to the root in their original relative order. */
    private _restoreOriginalSolids;
    private _resetActiveIndex;
    private _reset;
    /** Discovers DOM state, validates configuration and starts responsive runtime handling. */
    mount(selectorRoot?: ParentNode): void;
    /**
     * Enables runtime behavior: prepares markup, attaches hover runtime and triggers first draw; also emits bind event.
     * Intended to be idempotent for toggling immerser on when viewport width allows.
     */
    enable(): void;
    /**
     * Disables runtime behavior: restores DOM, resets active layer and emits unbind event.
     * Safe to call multiple times; no-op when already disabled.
     */
    disable(): void;
    /** Updates runtime options and applies minimal side effects without remounting the instance. */
    updateOptions(userOptions: Partial<RuntimeOptions>): void;
    /**
     * Fully destroys immerser: disables runtime, removes mount-level listeners, runs destroy event and clears references.
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
     * Call when using a custom scroll handler.
     *
     * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
     */
    syncScroll(): void;
    /** Adds one layer and prepares its runtime markup when immerser is enabled. */
    addLayer(id: string, layerNode: HTMLElement, order: number, solidClassnames?: SolidClassnames | null): void;
    /** Removes one layer and its owned runtime markup. */
    removeLayer(id: string): void;
    /** Register persistent event handler. */
    on<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void;
    /** Register event handler that will be removed after first call. */
    once<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void;
    /** Removes handler(s) for provided event. */
    off<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void;
    /** Current active layer index derived from scroll position. */
    get activeIndex(): number;
    /** Indicates whether immerser runtime is enabled (markup cloned and listeners attached). */
    get isEnabled(): boolean;
    /** Indicates whether DOM discovery and mount-level listeners are active. */
    get isMounted(): boolean;
    /** The root DOM node immerser is attached to. */
    get rootNode(): HTMLElement | null;
    /** Progress of each layer from 0 (off-screen) to 1 (fully visible). */
    get layerProgressArray(): readonly number[];
}
export default Immerser;

/** @public Handler signature for layers update events. */
export declare type LayersUpdateHandler = (layersProgress: number[], immerser: Immerser) => void;

/** @public Runtime configuration accepted by immerser (see README Options for defaults and details). */
export declare type Options = {
    /** If true, constructor runs DOM-dependent mount immediately. */
    autoMount: boolean;
    /** Parent node used only for selector discovery during mount. */
    selectorRoot?: ParentNode;
    /** Map of layer id → solid id → classname; can be overridden per layer via data-immerser-layer-config. */
    solidClassnamesByLayerId: SolidClassnamesByLayerId;
    /** Minimal viewport width (px) at which immerser enables runtime; below it disables runtime. */
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

/** @public Options that can be updated after instance creation. */
export declare type RuntimeOptions = Pick<Options, 'debug' | 'fromViewportWidth' | 'hasToUpdateHash' | 'isScrollHandled' | 'pagerThreshold' | 'scrollAdjustDelay' | 'scrollAdjustThreshold'>;

/** @public Map of solid id to classname. */
export declare interface SolidClassnames {
    [key: string]: string;
}

/** @public Map of layer id to solid classname map. */
export declare interface SolidClassnamesByLayerId {
    [key: string]: SolidClassnames;
}

export { }

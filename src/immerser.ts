import mergeOptions from '@dubaua/merge-options';
import ImmerserDomAdapter from './dom/immerser-dom-adapter';
import ImmerserEngine from './engine/immerser-engine';
import { EVENT_NAMES } from './events';
import { INITIAL_DEBUG, OPTION_CONFIG } from './options';
import { getOriginalHandler, wrapOnceHandler } from './utils/once-handler';
import type { IReportParams } from './dom/types';
import type {
  ActiveLayerChangeHandler,
  BaseHandler,
  EventHandlers,
  EventName,
  HandlerArgs,
  HandlerByEventName,
  LayersUpdateHandler,
  Options,
  SolidClassnames,
} from './types';

const MESSAGE_PREFIX = '[immerser]:';

/** @public Main Immerser controller orchestrating markup cloning and scroll-driven transitions. */
export default class Immerser {
  private _adapter!: ImmerserDomAdapter;
  private _handlers: Record<EventName, Set<HandlerByEventName[EventName]>> = {
    init: new Set(),
    bind: new Set(),
    unbind: new Set(),
    destroy: new Set(),
    activeLayerChange: new Set(),
    layersUpdate: new Set(),
  };

  /** Enables warnings/errors reporting. Defaults to NODE_ENV===development. */
  public debug = INITIAL_DEBUG;

  /**
   * Creates immerser instance and immediately runs setup with optional user options.
   * @param userOptions - overrides for defaults defined in OPTION_CONFIG if pass validation
   */
  constructor(userOptions?: Partial<Options>) {
    this._init(userOptions);
  }

  private _init(userOptions?: Partial<Options>): void {
    const options = this._mergeOptions(userOptions);
    this.debug = options.debug;
    this._registerHandlersFromOptions(options);

    const engine = new ImmerserEngine({ pagerThreshold: options.pagerThreshold });
    this._adapter = new ImmerserDomAdapter({
      callbacks: {
        onActiveLayerChange: (layerIndex) => this._emit('activeLayerChange', layerIndex, this),
        onBind: () => this._emit('bind', this),
        onDestroy: () => this._emit('destroy', this),
        onLayersUpdate: (layersProgress) => this._emit('layersUpdate', layersProgress, this),
        onUnbind: () => this._emit('unbind', this),
        report: (params) => this._report(params),
      },
      engine,
      options,
    });
    this._adapter.initialize();
    this._emit('init', this);
  }

  /** Merges user options with defaults and attaches helper metadata to messages. */
  private _mergeOptions(userOptions?: Partial<Options>): Options {
    return mergeOptions({
      optionConfig: OPTION_CONFIG,
      userOptions,
      prefix: MESSAGE_PREFIX,
      suffix: '\nCheck out documentation https://github.com/dubaua/immerser#options',
      strict: false,
    });
  }

  /** Saves event handlers passed via options into internal registry. */
  private _registerHandlersFromOptions(options: Options): void {
    if (!options.on) {
      return;
    }
    EVENT_NAMES.forEach((eventName) => {
      const handler = options.on?.[eventName];
      if (typeof handler === 'function') {
        this.on(eventName, handler);
      }
    });
  }

  /** Executes registered event handlers with provided arguments. */
  private _emit<K extends EventName>(eventName: K, ...args: HandlerArgs<K>): void {
    const handlerSet = this._handlers[eventName];
    handlerSet.forEach((handler: HandlerByEventName[K]) => {
      try {
        handler.apply(undefined, args);
      } catch (error) {
        this._report({
          message: `handler for ${eventName} event failed`,
          error,
          docsHash: '#events',
        });
      }
    });
  }

  private _report({
    message,
    error,
    isWarning = false,
    docsHash = '',
  }: IReportParams): void {
    const resultMessage = `${MESSAGE_PREFIX} ${message} \nCheck out documentation https://github.com/dubaua/immerser${docsHash}`;

    if (isWarning) {
      if (!this.debug) {
        return;
      }

      error !== undefined ? console.warn(resultMessage, error) : console.warn(resultMessage);

      return;
    }

    throw new Error(resultMessage, { cause: error });
  }

  /**
   * Prepares markup, attaches listeners and triggers first draw; also emits bind event.
   * Intended to be idempotent for toggling immerser on when viewport width allows.
   */
  public bind(): void {
    this._adapter.bind();
  }

  /**
   * Tears down generated markup and listeners, restores DOM, resets active layer and emits unbind event.
   * Safe to call multiple times; no-op when already unbound.
   */
  public unbind(): void {
    this._adapter.unbind();
  }

  /**
   * Fully destroys immerser: unbinds, removes window listeners, runs destroy event and clears all references.
   * Use when component is permanently removed.
   */
  public destroy(): void {
    this._adapter.destroy();
    EVENT_NAMES.forEach((eventName) => this._handlers[eventName].clear());
  }

  /**
   * Manually recomputes sizes and redraws masks; call after DOM mutations that change layout.
   * Exposed for dynamic content updates without reinitializing immerser.
   *
   * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
   */
  public render(): void {
    this._adapter.render();
  }

  /**
   * Syncs immerser with an externally controlled scroll position.
   * `isScrollHandled=false` option flag is required to call this method.
   * Call when using a custom scroll engine.
   *
   * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
   */
  public syncScroll(): void {
    this._adapter.syncScroll();
  }

  /** Register persistent event handler. */
  public on<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void {
    this._handlers[eventName].add(handler);
  }

  /** Register event handler that will be removed after first call. */
  public once<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void {
    this._handlers[eventName].add(
      wrapOnceHandler(handler, (...args: HandlerArgs<K>) => {
        this.off(eventName, handler);
        handler.apply(undefined, args);
      }),
    );
  }

  /** Removes handler(s) for provided event. */
  public off<K extends EventName>(eventName: K, handler: HandlerByEventName[K]): void {
    const handlerSet = this._handlers[eventName];

    handlerSet.forEach((storedHandler) => {
      const original = getOriginalHandler(storedHandler);
      if (storedHandler === handler || original === handler) {
        handlerSet.delete(storedHandler);
      }
    });
  }

  /** Current active layer index derived from scroll position. */
  public get activeIndex(): number {
    return this._adapter.activeIndex;
  }

  /** Indicates whether immerser is currently bound (markup cloned and listeners attached). */
  public get isBound(): boolean {
    return this._adapter.isBound;
  }

  /** The root DOM node immerser is attached to. */
  public get rootNode(): HTMLElement {
    return this._adapter.rootNode;
  }

  /** Progress of each layer from 0 (off-screen) to 1 (fully visible). */
  public get layerProgressArray(): readonly number[] {
    return this._adapter.layerProgressArray;
  }
}

// for typedef generation needs
export type {
  ActiveLayerChangeHandler,
  BaseHandler,
  EventHandlers,
  EventName,
  HandlerByEventName,
  LayersUpdateHandler,
  Options,
  SolidClassnames,
};
export { EVENT_NAMES };

import mergeOptions from '@dubaua/merge-options';
import ImmerserDomController from './dom/immerser-dom-controller';
import ImmerserEngine from './engine/immerser-engine';
import { EventNames } from './events';
import { InitialDebug, OptionConfig } from './options';
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
  RuntimeOptions,
  SolidClassnames,
  SolidClassnamesByLayerId,
} from './types';

const MessagePrefix = '[immerser]:';
const RuntimeOptionNames: (keyof RuntimeOptions)[] = [
  'debug',
  'fromViewportWidth',
  'hasToUpdateHash',
  'isScrollHandled',
  'pagerThreshold',
  'scrollAdjustDelay',
  'scrollAdjustThreshold',
];

/** @public Main Immerser controller orchestrating markup cloning and scroll-driven transitions. */
export default class Immerser {
  private _domController!: ImmerserDomController;
  private _options!: Options;
  private _userOptions: Partial<Options> = {};
  private _handlers: Record<EventName, Set<HandlerByEventName[EventName]>> = {
    init: new Set(),
    bind: new Set(),
    unbind: new Set(),
    destroy: new Set(),
    activeLayerChange: new Set(),
    layersUpdate: new Set(),
  };

  /** Enables warnings/errors reporting. Defaults to NODE_ENV===development. */
  public debug = InitialDebug;

  /**
   * Creates immerser instance and runs DOM setup unless autoMount is disabled.
   * @param userOptions - overrides for defaults defined in OptionConfig if pass validation
   */
  constructor(userOptions?: Partial<Options>) {
    this._init(userOptions);
  }

  private _init(userOptions?: Partial<Options>): void {
    this._userOptions = userOptions ?? {};
    const options = this._mergeOptions(this._userOptions);
    this._options = options;
    this.debug = options.debug;
    this._registerHandlersFromOptions(options);

    const engine = new ImmerserEngine({ pagerThreshold: options.pagerThreshold });
    this._domController = new ImmerserDomController({
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
    if (options.autoMount) {
      this.mount();
    }
    this._emit('init', this);
  }

  /** Merges user options with defaults and attaches helper metadata to messages. */
  private _mergeOptions(userOptions?: Partial<Options>): Options {
    return mergeOptions({
      optionConfig: OptionConfig,
      userOptions,
      prefix: MessagePrefix,
      suffix: '\nCheck out documentation https://github.com/dubaua/immerser#options',
      strict: false,
    });
  }

  /** Keeps updateOptions scoped to runtime fields even when called from plain JavaScript. */
  private _pickRuntimeOptions(userOptions: Partial<Options>): Partial<RuntimeOptions> {
    return RuntimeOptionNames.reduce<Partial<RuntimeOptions>>((result, optionName) => {
      if (optionName in userOptions) {
        result[optionName] = userOptions[optionName] as never;
      }
      return result;
    }, {});
  }

  /** Saves event handlers passed via options into internal registry. */
  private _registerHandlersFromOptions(options: Options): void {
    if (!options.on) {
      return;
    }
    EventNames.forEach((eventName) => {
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

  private _report({ message, error, isWarning = false, docsHash = '' }: IReportParams): void {
    const resultMessage = `${MessagePrefix} ${message} \nCheck out documentation https://github.com/dubaua/immerser${docsHash}`;

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
   * Discovers DOM state, validates configuration and starts responsive runtime handling.
   */
  public mount(): void {
    if (this.isMounted) {
      return;
    }
    this._domController.mount(this._options.selectorRoot ?? document);
  }

  /**
   * Enables runtime behavior: prepares markup, attaches hover runtime and triggers first draw; also emits bind event.
   * Intended to be idempotent for toggling immerser on when viewport width allows.
   */
  public enable(): void {
    if (!this.isMounted) {
      return;
    }
    this._domController.enable();
  }

  /**
   * Disables runtime behavior: restores DOM, resets active layer and emits unbind event.
   * Safe to call multiple times; no-op when already disabled.
   */
  public disable(): void {
    this._domController.disable();
  }

  /** Updates runtime options and applies minimal side effects without remounting the instance. */
  public updateOptions(userOptions: Partial<RuntimeOptions>): void {
    const previousOptions = this._options;
    const runtimeOptions = this._pickRuntimeOptions(userOptions as Partial<Options>);
    this._userOptions = { ...this._userOptions, ...runtimeOptions };
    const options = this._mergeOptions(this._userOptions);
    this._options = options;
    this.debug = options.debug;
    this._domController.updateOptions(options, previousOptions);
  }

  /**
   * Fully destroys immerser: disables runtime, removes mount-level listeners, runs destroy event and clears references.
   * Use when component is permanently removed.
   */
  public destroy(): void {
    this._domController.destroy();
    EventNames.forEach((eventName) => this._handlers[eventName].clear());
  }

  /**
   * Manually recomputes sizes and redraws masks; call after DOM mutations that change layout.
   * Exposed for dynamic content updates without reinitializing immerser.
   *
   * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
   */
  public render(): void {
    if (!this.isMounted) {
      return;
    }
    this._domController.render();
  }

  /**
   * Syncs immerser with an externally controlled scroll position.
   * `isScrollHandled=false` option flag is required to call this method.
   * Call when using a custom scroll engine.
   *
   * No throttling or performance optimization is applied here. The client is responsible for invocation frequency.
   */
  public syncScroll(): void {
    if (!this.isMounted) {
      return;
    }
    this._domController.syncScroll();
  }

  /** Adds one layer and prepares its runtime markup when immerser is enabled. */
  public addLayer(
    id: string,
    layerNode: HTMLElement,
    order: number,
    solidClassnames: SolidClassnames | null = null,
  ): void {
    if (!this.isMounted) {
      return;
    }
    this._domController.addLayer(id, layerNode, order, solidClassnames);
  }

  /** Removes one layer and its owned runtime markup. */
  public removeLayer(id: string): void {
    if (!this.isMounted) {
      return;
    }
    this._domController.removeLayer(id);
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
    return this._domController.activeIndex;
  }

  /** Indicates whether immerser runtime is enabled (markup cloned and listeners attached). */
  public get isEnabled(): boolean {
    return this._domController.isBound;
  }

  /** Indicates whether DOM discovery and mount-level listeners are active. */
  public get isMounted(): boolean {
    return this._domController.isMounted;
  }

  /** The root DOM node immerser is attached to. */
  public get rootNode(): HTMLElement | null {
    return this._domController.rootNode;
  }

  /** Progress of each layer from 0 (off-screen) to 1 (fully visible). */
  public get layerProgressArray(): readonly number[] {
    return this._domController.layerProgressArray;
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
  RuntimeOptions,
  SolidClassnames,
  SolidClassnamesByLayerId,
};
export { EventNames };

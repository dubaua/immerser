# 5.0.0

## Breaking Changes

- Replaced individual callback options (`onInit`, `onBind`, `onUnbind`, `onDestroy`, `onActiveLayerChange`, `onLayersUpdate`) with an `on` map keyed by event names (`init`, `bind`, `unbind`, `destroy`, `activeLayerChange`, `layersUpdate`).

## Features

- Added event emitter API with `on`, `once`, `off` methods and exported `EVENT_NAMES`; option `on` now accepts initial handlers.
- Added per-layer progress calculation (normalized 0..1) based on viewport overlap.
- Added `layersUpdate` event and per-layer progress callback support to track per-layer progress on scroll/render.
- Added `layerProgressArray` getter exposing the latest per-layer progress values.

# 4.0.0

## Breaking Changes

- Renamed `onDOMChange` to `render`.
- Rewritten core to TypeScript.
- Updated build tooling (webpack, sass).
- Split public and private fields, removed access to internal methods.
- Adjusted type definitions and validation signatures.
- Added getters `activeIndex`, `isBound`, `rootNode`.
- Methods `bind`, `unbind`, `destroy` and `render` are public, others are private now.

## Migration Notes

- Replace all calls to `onDOMChange()` with `render()`.

# 3.0.0

## Default Options Configuration Prop Names

According to changes [mergeOptions](https://github.com/dubaua/merge-options) library now default option stored in `default` key instead of former `initial` key. Selectors removed from options.

## Pager

Now pager no longer automaticly created by immerser. Instead you can manually markup you pager as regular solid and mark pager links with `data-immerser-pager-link` selector. The script will add classname passed as pagerLinkActiveClassname options to link when active layer changed. Removed `classnamePager`, `classnamePagerLink`, `classnamePagerLinkActive` options.

This changed because somebody might need text pager links or more complicated markup.

## Breakpoints

Now `fromViewportWidth` options is 0 by default. Its better to explicitly mark if you don't need init it on mobile screens. 

## Class Fields Changes

### Renamed or changed
- `statemap` => `stateArray` - renamed
- `immerserNode` => `rootNode` - renamed
- `originalChildrenNodeList` => `originalSolidNodeArray` - now contains array of nodes instead of NodeList
- `immerserMaskNodeArray` => `maskNodeArray` - renamed
- `resizeTimerId` => `resizeFrameId` - renamed
- `scrollTimerId` => `scrollFrameId` - renamed

### New
- `stateIndexById` - a hashmap with layerId keys and layerIndex values
- `scrollAdjustTimerId` - scroll adjust delay timer id
- `selectors` - object of selectors
- `layerNodeArray` - contains array of layer nodes
- `solidNodeArray` - contains array of solid nodes
- `pagerLinkNodeArray` - contains array of pager link nodes
- `customMaskNodeArray` - contains array of custom mask nodes
- `stopRedrawingPager` - a function to detach pager redraw callback
- `stopUpdatingHash` - a function to detach update hash callback
- `stopFiringActiveLayerChangeCallback` - a function to detach active layer change callback
- `stopTrackingWindowWidth` - a function to detach resize callback
- `stopTrackingSynchroHover` - a function to detach syncro hover callback
- `onSynchroHoverMouseOver` - synchro hover mouse over callback
- `onSynchroHoverMouseOut` - synchro hover mouse out callback

### Removed
- `pagerNode`

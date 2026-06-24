| name | kind | description |
| - | - | - |
| debug | `property` | Controls whether immerser reports warnings and errors |
| mount | `method` | Discovers DOM, validates markup, calculates layout, and attaches mount-level listeners |
| enable | `method` | Enables runtime behavior: prepares markup, hover sync, pager state, and first draw |
| disable | `method` | Disables runtime behavior, cleans generated markup, and keeps the instance mounted |
| updateOptions | `method` | Updates runtime options and applies minimal side effects without remounting |
| destroy | `method` | Fully destroys immerser: disables it, removes listeners, restores original markup, and clears internal state |
| render | `method` | Recalculates sizes and redraws masks |
| syncScroll | `method` | Updates immerser when scroll is controlled externally (requires isScrollHandled = false) |
| addLayer | `method` | Adds one layer and prepares its runtime markup when immerser is bound |
| removeLayer | `method` | Removes one layer and its owned runtime markup |
| on | `method` | Registers a persistent immerser event handler |
| once | `method` | Registers a one-time immerser event handler that is removed after the first call |
| off | `method` | Removes a specific handler for the given immerser event |
| activeIndex | `getter` | Index of the currently active layer, calculated from scroll position |
| isEnabled | `getter` | Indicates whether immerser is currently active (markup cloned, listeners attached) |
| isMounted | `getter` | Indicates whether DOM discovery and mount-level listeners are active |
| rootNode | `getter` | Root element the immerser instance is attached to |
| layerProgressArray | `getter` | Per-layer progress values (0–1) showing how much each layer is visible in the viewport |

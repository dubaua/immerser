| name | kind | description |
| - | - | - |
| bind | `method` | Clones markup, attaches listeners, and starts internal logic |
| unbind | `method` | Remove generated markup and listeners, keeping the instance reusable |
| destroy | `method` | Fully destroys immerser: disables it, removes listeners, restores original markup, and clears internal state |
| render | `method` | Recalculates sizes and redraws masks |
| syncScroll | `method` | Updates immerser when scroll is controlled externally (requires isScrollHandled = false) |
| activeIndex | `getter` | Index of the currently active layer, calculated from scroll position |
| isBound | `getter` | Indicates whether immerser is currently active (markup cloned, listeners attached) |
| rootNode | `getter` | Root element the immerser instance is attached to |
| layerProgressArray | `getter` | Per-layer progress values (0–1) showing how much each layer is visible in the viewport |

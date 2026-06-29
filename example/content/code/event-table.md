| event | arguments | description |
| - | - | - |
| init | `immerser: Immerser` | Emitted after initialization |
| mount | `immerser: Immerser` | Emitted after immerser mounts and is ready to work |
| unmount | `immerser: Immerser` | Emitted after unmount when viewport width is below fromViewportWidth |
| destroy | `immerser: Immerser` | Emitted after instance destroy |
| structureChange | `immerser: Immerser` | Emitted after DOM structure synchronization |
| layoutChange | `immerser: Immerser` | Emitted after layer size recalculation changes |
| activeLayerChange | `layerIndex: number`<br>`immerser: Immerser` | Emitted after active layer changes |
| layerProgressChange | `layerProgressArray: number[]`<br>`immerser: Immerser` | Emitted after layer progress changes |
| stateChange | `immerser: Immerser` | Emitted after any immerser event so external renderers can read current public fields |

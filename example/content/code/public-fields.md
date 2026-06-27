| name | kind | description |
| - | - | - |
| debug | `property` | Controls whether immerser reports warnings |
| mount | `method` | Mounts immerser when viewport width passes the fromViewportWidth breakpoint: discovers DOM, prepares markup, calculates layer sizes, and attaches event listeners |
| unmount | `method` | Unmounts immerser: cleans markup owned by immerser and keeps resize handling active for breakpoint remount |
| updateOptions | `method` | Updates runtime options and applies minimal side effects without remounting |
| destroy | `method` | Fully destroys immerser: unmounts it, removes resize handling, restores original markup, and clears internal state |
| render | `method` | Schedules structure synchronization, calculations, and redraw after DOM mutations |
| syncScroll | `method` | Syncs immerser with an externally controlled scroll position. Intended for use with hasExternalScroll=true |
| on | `method` | Registers a persistent immerser event handler |
| once | `method` | Registers a one-time immerser event handler that is removed after the first call |
| off | `method` | Removes a specific handler for the given immerser event |
| activeIndex | `getter` | Active layer index derived from scroll position |
| isMounted | `getter` | Indicates whether immerser is mounted |
| rootNode | `getter` | Root DOM element immerser is attached to |
| layerProgressArray | `getter` | Progress of each layer from 0 (off-screen) to 1 (fully visible) |

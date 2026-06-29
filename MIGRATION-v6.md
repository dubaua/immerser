# Migrating from v5 to v6

This guide lists only changes that may require updates in existing v5 code.

## Options

| Search in v5 code            | Change in v6                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `solidClassnameArray`        | Replace with `solidClassnamesByLayerId`. Use layer ids as keys instead of layer order. |
| `isScrollHandled: false`     | Replace with `hasExternalScroll: true`.                                                |
| `hasToUpdateHash: true`      | Replace with `updateLocationHash(layerId)`.                                            |
| `data-immerser-layer-config` | Remove. Move config to `solidClassnamesByLayerId`.                                     |

## Public fields and methods

| Search in v5 code | Change in v6                                                    |
| ----------------- | --------------------------------------------------------------- |
| `.bind()`         | Replace with `.mount()`.                                        |
| `.unbind()`       | Replace with `.unmount()`.                                      |
| `.isBound`        | Replace with `.isMounted`.                                      |
| `.render()`       | Check usage: it now also syncs structure, not only layout/draw. |
| `.syncScroll()`   | Check config: it no longer requires changed `isScrollHandled`.  |

## Events

| Search in v5 code | Change in v6                        |
| ----------------- | ----------------------------------- |
| `bind`            | Replace with `mount`.               |
| `unbind`          | Replace with `unmount`.             |
| `layersUpdate`    | Replace with `layerProgressChange`. |

## Markup

| Search in v5 markup                                 | Change in v6                                                                                                                                   |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-immerser-layer` without `id`                  | Add explicit `id`.                                                                                                                             |
| `data-immerser-layer-config`                        | Remove. Move config to options.                                                                                                                |
| `data-immerser-solid` nested inside wrappers        | Check: source solids should be direct children of `data-immerser`.                                                                             |
| `data-immerser-pager` without `data-immerser-solid` | Add `data-immerser-solid`, for example `data-immerser-solid="pager"`.                                                                          |
| arbitrary children inside `data-immerser`           | Move/remove. Root is controlled by Immerser.                                                                                                   |
| inline styles on Immerser-owned nodes               | Move to CSS classes. Immerser may overwrite technical inline styles and does not guarantee exact restoration after `unmount()` or `destroy()`. |

## Behavior checks

| Existing v5 behavior                                              | v6 change                                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Hash was updated by `hasToUpdateHash`                             | Hash is updated only if `updateLocationHash(layerId)` is passed.         |
| Events could run on every scroll tick                             | Events now run when related data changes.                                |
| Existing mask markup cleanup restored some technical attrs/styles | Do not rely on previous inline styles being restored on technical nodes. |
| Existing mask markup had duplicated content                       | `aria-hidden` is now client responsibility for existing markup.          |

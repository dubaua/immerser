| option | type | default | description |
| - | - | - | - |
| autoMount | `boolean` | `true` | If true, constructor mounts immerser immediately |
| selectorRoot | `unknown` | `undefined` | Parent element used only for selector lookup during mount |
| solidClassnamesByLayerId | `object` | `{}` | Nested lookup table: layer id → solid id → CSS class that immerser adds to that solid on that layer. Configuration example [is shown above](#initialize-immerser) |
| fromViewportWidth | `number` | `0` | Minimum viewport width in pixels, breakpoint at which immerser mounts |
| pagerThreshold | `number` | `0.5` | Portion of viewport height that must overlap the next layer before pager switches |
| updateLocationHash | `function` | `undefined` | Callback that receives active layer id when active layer changes. Use it to update location hash or route state |
| scrollAdjustThreshold | `number` | `0` | Pixel threshold near section edges that triggers scroll snapping when exceeded. Pass zero to disable scroll snapping |
| scrollAdjustDelay | `number` | `600` | Delay in ms before running scroll snapping after user scroll stops |
| pagerLinkActiveClassname | `string` | `pager-link-active` | Class for the pager link pointing to the active layer |
| hasExternalScroll | `boolean` | `false` | If true, immerser will not attach its own scroll handler. Intended for use with an external scroll controller and syncScroll calls |
| hasExternalRenderer | `boolean` | `false` | If true, skips most DOM mutation routine. Intended for use with render frameworks such as React, Vue.js, and others |
| debug | `boolean` | `false` | Enables warning logging |
| on | `object` | `{}` | Initial event handlers map keyed by event name |

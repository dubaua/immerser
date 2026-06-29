| option | type | default | hot/init | description |
| - | - | - | - | - |
| autoMount | `boolean` | `true` | init | If true, constructor mounts immerser immediately |
| selectorRoot | `unknown` | `undefined` | init | Parent element used only for selector lookup during mount |
| solidClassnamesByLayerId | `object` | `{}` | init | Nested lookup table: layer id → solid id → CSS class that immerser adds to that solid on that layer. Configuration example [is shown above](#initialize-immerser) |
| fromViewportWidth | `number` | `0` | hot | Minimum viewport width in pixels, breakpoint at which immerser mounts |
| pagerThreshold | `number` | `0.5` | hot | Portion of viewport height that must overlap the next layer before pager switches |
| updateLocationHash | `function` | `undefined` | hot | Callback that receives active layer id when active layer changes. Use it to update location hash or route state |
| scrollAdjustThreshold | `number` | `0` | hot | Pixel threshold near section edges that triggers scroll snapping when exceeded. Pass zero to disable scroll snapping |
| scrollAdjustDelay | `number` | `600` | hot | Delay in ms before running scroll snapping after user scroll stops |
| pagerLinkActiveClassname | `string` | `pager-link-active` | init | Class for the pager link pointing to the active layer |
| hasExternalScroll | `boolean` | `false` | init | If true, immerser will not attach its own scroll handler. Intended for use with an external scroll controller and syncScroll calls |
| hasExternalRenderer | `boolean` | `false` | init | If true, skips most DOM mutation routine. Intended for use with render frameworks such as React, Vue.js, and others |
| debug | `boolean` | `false` | hot | Enables warning logging |
| on | `object` | `{}` | init | Initial event handlers map keyed by event name |

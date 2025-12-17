| option | type | default | description |
| - | - | - | - |
| solidClassnameArray | `array` | `[]` | Array of layer class configurations. Overriding by config passed in data-immerser-layer-config for corresponding layer. Configuration example [is shown above](#initialize-immerser) |
| fromViewportWidth | `number` | `0` | A viewport width, from which immerser will init |
| pagerThreshold | `number` | `0.5` | How much next layer should be in viewport to trigger pager |
| hasToUpdateHash | `boolean` | `false` | Flag to control changing hash on pager active state change |
| scrollAdjustThreshold | `number` | `0` | A distance from the viewport top or bottom to the section top or bottom edge in pixels. If the current distance is below the threshold, the scroll adjustment will be applied. Will not adjust, if zero passed |
| scrollAdjustDelay | `number` | `600` | Delay after user interaction and before scroll adjust |
| pagerLinkActiveClassname | `string` | `pager-link-active` | Added to each pager link pointing to active |
| isScrollHandled | `boolean` | `true` | Binds scroll listener if true. Set to false if you're using remote scroll controller |
| on | `object` | `{}` | Initial event handlers map keyed by event name |

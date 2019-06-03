# Library for Switching Fixed Elements on Scroll

Nowadays designers tends to create complex logic and fix parts of the interface. Also they colour page sections contrastly. How to deal with this mess? Immerser can help you.

Immerser fast, because it calculates states once on init. Then it watchs the scroll position and schedules redraw DOM in the next event loop tick with requestAnimationFrame. Script changes transform property, so it uses graphic hardware acceleration.

Immerser doesn’t have any dependencies and is written on vanilla js. Only 3.57kb gzipped.

# How to Use

## Prepare Your Markup

First, setup fixed container as the immerser root container, and add the `data-immerser` attribute.

Next place absolutely positioned children into the immerser parent and add `data-immerser-solid="solid-id"` to each.

Then add the `data-immerser-layer` attribute to each section and pass configuraton in `data-immerser-layer-config='{"solid-id": "classname-modifier"}'`. Otherwise, you can pass configuration as `solidClassnameArray` option to immerser. Config should contain JSON describing what class should be applied on each solid element, when it's over a section.

Also feel free to add `data-immerser-pager` to create a pager for your layers.

```html
<div class="fixed" data-immerser>
  <div class="fixed__pager pager" data-immerser-pager data-immerser-solid="pager"></div>
  <div class="fixed__logo logo" data-immerser-solid="logo">immerser</div>
  <div class="fixed__menu menu" data-immerser-solid="menu">
    <a href="#reasoning" class="menu__link">Reasoning</a>
    <a href="#how-to-use" class="menu__link">How to Use</a>
    <a href="#how-it-works" class="menu__link">How it Works</a>
    <a href="#options" class="menu__link">Options</a>
    <a href="#possibilities" class="menu__link">Possibilities</a>
  </div>
  <div class="fixed__social social" data-immerser-solid="social">
    <a href="https://github.com/dubaua/immerser">github</a>
    <a href="mailto:dubaua@gmail.com">dubaua@gmail.com</a>
  </div>
  <div class="fixed__about about" data-immerser-solid="about">
    © 2019 — Vladimir Lysov, Chelyabinsk, Russia
  </div>
</div>

<div
  data-immerser-layer
  data-immerser-layer-config='{
  "logo": "logo--contrast", 
  "pager": "pager--contrast", 
  "social": "social--contrast"
}'
  id="reasoning"
></div>
<div
  data-immerser-layer
  data-immerser-layer-config='{
  "menu": "menu--contrast", 
  "about": "about--contrast"
}'
  id="how-to-use"
></div>
<div
  data-immerser-layer
  data-immerser-layer-config='{
  "logo": "logo--contrast", 
  "pager": "pager--contrast", 
  "social": "social--contrast"
}'
  id="how-it-works"
></div>
<div
  data-immerser-layer
  data-immerser-layer-config='{
  "menu": "menu--contrast", 
  "about": "about--contrast"
}'
  id="options"
></div>
<div
  data-immerser-layer
  data-immerser-layer-config='{
  "logo": "logo--contrast", 
  "pager": "pager--contrast", 
  "social": "social--contrast"
}'
  id="possibilities"
></div>
```

## Apply styles

Apply color and background styles to your layers and solids according to your classname configuration passed in data attribute or options.

```css
.fixed {
  position: fixed;
  top: 2em;
  bottom: 3em;
  left: 3em;
  right: 3em;
  z-index: 1;
}
.fixed__pager {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
}
.fixed__logo {
  position: absolute;
  top: 0;
  left: 0;
}
.fixed__menu {
  position: absolute;
  top: 0;
  right: 0;
}
.fixed__about {
  position: absolute;
  bottom: 0;
  right: 0;
}
.section {
  min-height: 100vh;
  background: white;
  color: black;
}
.section--contrast {
  background: black;
  color: white;
}
.logo,
.pager,
.menu,
.about {
  color: black;
}
.logo--contrast,
.pager--contrast,
.menu--contrast,
.about--contrast {
  color: white;
}
```

## Initialize Immerser

Include immerser in your code and create immerser instance with options.

```js
import Immerser from '../immerser.js';
import '../immerser.scss';

const my = new Immerser({
  stylesInCSS: true,
  synchroHoverPagerLinks: true,
  onInit(immerser) {
    // callback on init
  },
  onActiveLayerChange(activeIndex, immerser) {
    // callback on layer change
  },
});
```

# How it Works?

First, immerser gathers information about the layers, solids, window and document.

Then it creates a statemap for each layer, containing all necessary information, when the layer is partially and fully in viewport.

After that immerser modifies DOM, cloning all solids into mask containers for each layer and appling the classnames given in configuration. If you have added a pager, immerser also creates links for layers.

Finally, immerser binds listeners to scroll and resize events. On resize, it will meter layers, the window and document heights again and recalculate the statemap. On scroll, immerser moves a mask of solids to show part of each solid group according to the layer below.

# Options

You can pass options to immerser as data-attributes on layers or as function parameters. Data-attributes process last, so they will override options passed in function.

| option                                     | type       | default                 | description                                                                                                                                |
| ------------------------------------------ | ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| solidClassnameArray                        | `array`    | `[]`                    | Array of layer class configurations. Overrides config passed in `data-immerser-layer-config` for corresponding layer                       |
| fromViewportWidth                          | `number`   | `1024`                  | A viewport width, from which immerser will init                                                                                            |
| pagerTreshold                              | `number`   | `0.5`                   | How much next layer should be in viewport to trigger pager                                                                                 |
| stylesInCSS                                | `boolean`  | `false`                 | Flag to controll attaching inline styles to created nodes. Set `true` and include `immerser.css` if you want keep your DOM neat            |
| synchroHoverPagerLinks                     | `boolean`  | `false`                 | Flag to controll hover synchronizing on pager links. [About hover synchronization](https://github.com/dubaua/immerser#hover-synchronizing) |
| updateHash                                 | `boolean`  | `false`                 | Flag to controll changing hash on pager active state change.                                                                               |
| classnamePager                             | `string`   | `'pager'`               | Classname for pager. Style it on your own.                                                                                                 |
| classnamePagerLink                         | `string`   | `'pager__link'`         | Classname for pager link. Style it on your own.                                                                                            |
| classnamePagerLinkActive                   | `string`   | `'pager__link--active'` | Classname for active pager link. Style it on your own.                                                                                     |
| onInit(immerser)                           | `function` | `null`                  | Will be fired after initialization. Accept an immerser instance as the only parameter.                                                     |
| onBind(immerser)                           | `function` | `null`                  | Will be fired after binding DOM. Accept an immerser instance as the only parameter.                                                     |
| onUnbind(immerser)                         | `function` | `null`                  | Will be fired after unbinding DOM. Accept an immerser instance as the only parameter.                                                     |
| onDestroy(immerser)                        | `function` | `null`                  | Will be fired after destroy. Accept an immerser instance as the only parameter.                                                     |
| onActiveLayerChange(activeIndex, immerser) | `function` | `null`                  | Will be fired after active layer change. Accept active layer index as first parameter and an immerser instance as second.                  |

If passed option fails validation it falled back to default value.

# Possibilities

## Custom Markup

Since immerser cloning nested nodes by default, all event listeners and data bound on nodes will be lost after init. Fortunatelly, you can markup the immmerser yourself. It can be useful when you have event listeners on solids, reactive logic or more than classname switching. All you need is to place the number of nested immerser masks equal to the number of the layers. Look how I change the smily face on the right in this page source.

```html
<div class="fixed" data-immerser>
  <div data-immerser-mask>
    <div data-immerser-mask-inner>
      <!-- your markup -->
    </div>
  </div>
  <div data-immerser-mask>
    <div data-immerser-mask-inner>
      <!-- your markup -->
    </div>
  </div>
</div>
```

## Hover Synchronizing

As mentioned above, immerser cloning nested nodes to achieve changing on scroll. Therefore if you hover a partially visible element, the only visible part will recolor. If you want to synchronize it, just pass `data-immerser-synchro-hover="hoverId"` attribute. It will share `_hover` class between all nodes with this `hoverId` when the mouse is over one of them. Add `_hover` selector alongside your `:hover` pseudoselector to style your interactive elements.

```css
a:hover,
a._hover {
  color: magenta;
}
```

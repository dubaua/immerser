# Library for Switching Fixed Elements on Scroll

Sometimes designers create complex logic and fix parts of the interface. Also they colour page sections contrastly. How to deal with this mess?

Immerser comes to help you. It’s a javascript library to change fixed elements on scroll.

Immerser fast, because it calculates states once on init. Then it watches the scroll position and schedules redraw document in the next event loop tick with requestAnimationFrame. Script changes transform property, so it uses graphic hardware acceleration.

Immerser is written on vanilla js. Only 3.4kb gzipped.

# How to Use

## Install

Using npm

```shell
npm install immerser
```

or yarn

```shell
yarn add immerser
```

or if you want to use immerser as UMD

```HTML
<script src="https://unpkg.com/immerser@2.0.3/dist/immerser.min.umd.js"></script>
```

## Prepare Your Markup

First, setup fixed container as the immerser root container, and add the `data-immerser` attribute.

Next place absolutely positioned children into the immerser parent and add `data-immerser-solid="solid-id"` to each.

Then add the `data-immerser-layer` attribute to each section and pass configuraton in `data-immerser-layer-config='{"solid-id": "classname-modifier"}'`. Otherwise, you can pass configuration as `solidClassnameArray` option to immerser. Config should contain JSON describing what class should be applied on each solid element, when it's over a section.

Also feel free to add `data-immerser-pager` to create a pager for your layers.

```html
<div class="fixed" data-immerser>
  <div class="fixed__pager pager" data-immerser-solid="pager">
    <a href="#reasoning" class="pager__link" data-immerser-synchro-hover="pager-reasoning" data-immerser-pager-link></a>
    <a href="#how-to-use" class="pager__link" data-immerser-synchro-hover="pager-how-to-use" data-immerser-pager-link></a>
    <a href="#how-it-works" class="pager__link" data-immerser-synchro-hover="pager-how-it-works" data-immerser-pager-link></a>
    <a href="#options" class="pager__link" data-immerser-synchro-hover="pager-options" data-immerser-pager-link></a>
    <a href="#possibilities" class="pager__link" data-immerser-synchro-hover="pager-possibilities" data-immerser-pager-link></a>
  </div>
  <a href="#reasoning" class="fixed__logo logo" data-immerser-solid="logo">immerser</a>
  <div class="fixed__menu menu" data-immerser-solid="menu">
    <a href="#reasoning" class="menu__link">Reasoning</a>
    <a href="#how-to-use" class="menu__link">How to Use</a>
    <a href="#how-it-works" class="menu__link">How it Works</a>
    <a href="#options" class="menu__link">Options</a>
    <a href="#possibilities" class="menu__link">Possibilities</a>
  </div>
  <div class="fixed__language language" data-immerser-solid="language">
    <a href="/" class="language__link">english</a>
    <a href="/ru.html" class="language__link">по-русски</a>
  </div>
  <div class="fixed__about about" data-immerser-solid="about">
    © 2019 — Vladimir Lysov, Chelyabinsk, Russia
    <a href="https://github.com/dubaua/immerser">github</a>
    <a href="mailto:dubaua@gmail.com">dubaua@gmail.com</a>
  </div>
</div>

<div
  data-immerser-layer
  data-immerser-layer-config='{"logo": "logo--contrast", "pager": "pager--contrast", "social": "social--contrast"}'
  id="reasoning"
></div>
<div
  data-immerser-layer
  data-immerser-layer-config='{"menu": "menu--contrast", "about": "about--contrast"}'
  id="how-to-use"
></div>
<div
  data-immerser-layer
  data-immerser-layer-config='{"logo": "logo--contrast", "pager": "pager--contrast", "social": "social--contrast"}'
  id="how-it-works"
></div>
<div
  data-immerser-layer
  data-immerser-layer-config='{"menu": "menu--contrast", "about": "about--contrast"}'
  id="options"
></div>
<div
  data-immerser-layer
  data-immerser-layer-config='{"logo": "logo--contrast", "pager": "pager--contrast", "social": "social--contrast"}'
  id="possibilities"
></div>
```

## Apply styles

Apply colour and background styles to your layers and solids according to your classname configuration passed in data attribute or options. I'm using [BEM methodology](https://en.bem.info/methodology/) in this example.

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
.fixed__language {
  position: absolute;
  bottom: 0;
  left: 0;
}
.fixed__about {
  position: absolute;
  bottom: 0;
  right: 0;
}
.pager,
.logo,
.menu,
.language,
.about {
  color: black;
}
.pager--contrast,
.logo--contrast,
.menu--contrast,
.language--contrast,
.about--contrast {
  color: white;
}
```

## Initialize Immerser

Include immerser in your code and create immerser instance with options.

```js
// You don't have to import immerser if you're using it as UMD
import Immerser from 'immerser';

const immerserInstance = new Immerser({
  // this option will be overrided by options
  // passed in data-immerser-layer-config attribute in each layer
  solidClassnameArray: [
    {
      logo: 'logo--contrast-lg',
      pager: 'pager--contrast-lg',
      language: 'language--contrast-lg',
    },
    {
      pager: 'pager--contrast-only-md',
      menu: 'menu--contrast',
      about: 'about--contrast',
    },
    {
      logo: 'logo--contrast-lg',
      pager: 'pager--contrast-lg',
      language: 'language--contrast-lg',
    },
    {
      logo: 'logo--contrast-only-md',
      pager: 'pager--contrast-only-md',
      language: 'language--contrast-only-md',
      menu: 'menu--contrast',
      about: 'about--contrast',
    },
    {
      logo: 'logo--contrast-lg',
      pager: 'pager--contrast-lg',
      language: 'language--contrast-lg',
    },
  ],
  hasToUpdateHash: true,
  fromViewportWidth: 1024,
  pagerLinkActiveClassname: 'pager__link--active',
  scrollAdjustThreshold: 50,
  scrollAdjustDelay: 600,
  onInit(immerser) {
    // callback on init
  },
  onBind(immerser) {
    // callback on bind
  },
  onUnbind(immerser) {
    // callback on unbind
  },
  onDestroy(immerser) {
    // callback on destroy
  },
  onActiveLayerChange(activeIndex, immerser) {
    // callback on active layer change
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

| option                                     | type       | default               | description                                                                                                                                                                                                     |
| ------------------------------------------ | ---------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| solidClassnameArray                        | `array`    | `[]`                  | Array of layer class configurations. Overriding by config passed in `data-immerser-layer-config` for corresponding layer                                                                                        |
| fromViewportWidth                          | `number`   | `0`                   | A viewport width, from which immerser will init                                                                                                                                                                 |
| pagerThreshold                             | `number`   | `0.5`                 | How much next layer should be in viewport to trigger pager                                                                                                                                                      |
| hasToUpdateHash                            | `boolean`  | `false`               | Flag to controll changing hash on pager active state change                                                                                                                                                     |
| scrollAdjustThreshold                      | `number`   | `0`                   | A distance from the viewport top or bottom to the section top or bottom edge in pixels. If the current distance is below the threshold, the scroll adjustment will be applied. Will not adjust, if zero passed. |
| scrollAdjustDelay                          | `number`   | `600`                 | Delay after user interaction and before scroll adjust.                                                                                                                                                          |
| pagerLinkActiveClassname                   | `string`   | `'pager-link-active'` | Added to each pager link pointing to active layer.                                                                                                                                                               |
| onInit(immerser)                           | `function` | `null`                | Fired after initialization. Accept an immerser instance as the only parameter                                                                                                                                   |
| onBind(immerser)                           | `function` | `null`                | Fired after binding DOM. Accept an immerser instance as the only parameter                                                                                                                                      |
| onUnbind(immerser)                         | `function` | `null`                | Fired after unbinding DOM. Accept an immerser instance as the only parameter                                                                                                                                    |
| onDestroy(immerser)                        | `function` | `null`                | Fired after destroy. Accept an immerser instance as the only parameter                                                                                                                                          |
| onActiveLayerChange(activeIndex, immerser) | `function` | `null`                | Fired after active layer change. Accept active layer index as first parameter and an immerser instance as second                                                                                                |

If passed option fails validation it falled back to default value.

# Possibilities

## Clonning Node Listeners

Since immerser cloning nested nodes by default, all event listeners and data bound on nodes will be lost after init. Fortunatelly, you can markup the immmerser yourself. It can be useful when you have event listeners on solids, reactive logic or more than classname switching. All you need is to place the number of nested immerser masks equal to the number of the layers. Look how I change the smily emoji on the right in this page source.

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

## Handle Clone Hover

As mentioned above, immerser cloning nested nodes to achieve changing on scroll. Therefore if you hover a partially visible element, only the visible part will change. If you want to synchronize all cloned links, just pass `data-immerser-synchro-hover="hoverId"` attribute. It will share `_hover` class between all nodes with this `hoverId` when the mouse is over one of them. Add `_hover` selector alongside your `:hover` pseudoselector to style your interactive elements.

```css
a:hover,
a._hover {
  color: magenta;
}
```

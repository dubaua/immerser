# Library for Switching Fixed Elements on Scroll

Sometimes designers create complex logic and fix parts of the interface. Also they colour page sections contrasted. How to deal with this mess?

Immerser comes to help you. It’s a javascript library to change fixed elements on scroll.

Immerser fast, because it calculates states once on init. Then it watches the scroll position and schedules redraw document in the next event loop tick with requestAnimationFrame. Script changes transform property, so it uses graphic hardware acceleration.

Immerser is written on typescript. Runtime bundle 9.06Kb gzipped.

## Terms

`Immerser root` — is the parent container for your fixed parts `solids`. Actually, solids are positioned absolutely to fixed immerser root. The `layers` are sections of your page. Also you may want to add `pager` to navigate through layers and indicate active state.

# How to Use

## Install

Using npm:

```shell
npm install immerser
```

Using yarn:

```shell
yarn add immerser
```

Or if you want to use immerser in browser as global variable:

```html
<script src="https://unpkg.com/immerser@6.0.1/dist/immerser.min.js"></script>
```

## Prepare Your Markup

First, setup fixed container as the immerser root container, and add the `data-immerser` attribute.

Next place absolutely positioned children into the immerser parent and add `data-immerser-solid="solid-id"` to each.

Then add `data-immerser-layer` attribute and a unique `id` to each section.

You can also add `data-immerser-pager-link` to navigation links so immerser can mark the active layer in the pager.

```html
<div class="fixed" data-immerser>
  <div class="fixed__pager pager" data-immerser-solid="pager">
    <a href="#reasoning" class="pager__link" data-immerser-synchro-hover="pager-reasoning" data-immerser-pager-link></a>
    <a href="#how-to-use" class="pager__link" data-immerser-synchro-hover="pager-how-to-use" data-immerser-pager-link></a>
    <a href="#how-it-works" class="pager__link" data-immerser-synchro-hover="pager-how-it-works" data-immerser-pager-link></a>
    <a href="#options" class="pager__link" data-immerser-synchro-hover="pager-options" data-immerser-pager-link></a>
    <a href="#recipes" class="pager__link" data-immerser-synchro-hover="pager-recipes" data-immerser-pager-link></a>
  </div>
  <a href="#reasoning" class="fixed__logo logo" data-immerser-solid="logo" data-immerser-synchro-hover="logo">
    immerser
  </a>
  <div class="fixed__menu menu" data-immerser-solid="menu">
    <a href="#reasoning" class="menu__link" data-immerser-synchro-hover="reasoning">Reasoning</a>
    <a href="#how-to-use" class="menu__link" data-immerser-synchro-hover="how-to-use">How to Use</a>
    <a href="#how-it-works" class="menu__link" data-immerser-synchro-hover="how-it-works">How it Works</a>
    <a href="#options" class="menu__link" data-immerser-synchro-hover="options">Options</a>
    <a href="#recipes" class="menu__link" data-immerser-synchro-hover="recipes">Recipes</a>
  </div>
  <div class="fixed__language language" data-immerser-solid="language">
    <span class="language__link language__link--active">english</span><a href="./ru.html" class="language__link">по-русски</a>
  </div>
  <div class="fixed__about about" data-immerser-solid="about">
    <span>&copy; 2026 &mdash; Vladimir Lysov, Chelyabinsk, Russia</span>
    <a href="https://github.com/dubaua/immerser">github</a>
    <a href="mailto:dubaua@gmail.com">dubaua@gmail.com</a>
  </div>
</div>

<div data-immerser-layer id="reasoning"></div>
<div data-immerser-layer id="how-to-use"></div>
<div data-immerser-layer id="how-it-works"></div>
<div data-immerser-layer id="options"></div>
<div data-immerser-layer id="recipes"></div>

```

## Initialize Immerser

Include immerser in your code and create immerser instance with options.

Pass the classname map in the `solidClassnamesByLayerId` option. The example shows how a layer id maps to a fixed solid id and the classname applied while the solid is over that layer.

```js
// You don't have to import immerser
// if you're using it in browser as global variable
import Immerser from 'immerser';

const immerserInstance = new Immerser({
  solidClassnamesByLayerId: {
    reasoning: {
      logo: 'logo--contrast-lg',
      pager: 'pager--contrast-lg',
      language: 'language--contrast-lg',
    },
    'how-to-use': {
      pager: 'pager--contrast-only-md',
      menu: 'menu--contrast',
      about: 'about--contrast',
    },
    'how-it-works': {
      logo: 'logo--contrast-lg',
      pager: 'pager--contrast-lg',
      language: 'language--contrast-lg',
    },
    options: {
      logo: 'logo--contrast-only-md',
      pager: 'pager--contrast-only-md',
      language: 'language--contrast-only-md',
      menu: 'menu--contrast',
      about: 'about--contrast',
    },
    recipes: {
      logo: 'logo--contrast-lg',
      pager: 'pager--contrast-lg',
      language: 'language--contrast-lg',
    },
  },
  updateLocationHash(layerId) {
    window.history.replaceState(null, '', `#${layerId}`);
  },
  fromViewportWidth: 1024,
  pagerLinkActiveClassname: 'pager__link--active',
  scrollAdjustThreshold: 50,
  scrollAdjustDelay: 600,
  on: {
    init(immerser) {
      // callback on init event
    },
    mount(immerser) {
      // callback on mount event
    },
    unmount(immerser) {
      // callback on unmount event
    },
    destroy(immerser) {
      // callback on destroy event
    },
    structureChange(immerser) {
      // callback on DOM structure change event
    },
    layoutChange(immerser) {
      // callback on layer size recalculation event
    },
    activeLayerChange(activeIndex, immerser) {
      // callback on active layer change event
    },
    layerProgressChange(layerProgressArray, immerser) {
      // callback on layer progress change event
    },
  },
});

```

## Apply styles

Apply colour and background styles to your layers and solids according to your classname configuration passed in options. I’m using [BEM methodology](https://en.bem.info/methodology/) in this example.

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

# How it Works

First, immerser finds the root element, layers, solids and masks. Then it measures layers, window and document and calculates the scroll points where each layer enters the viewport, stays there and leaves it.

After that immerser prepares the markup: it creates masks for layers or connects to existing masks, clones solids into each mask and applies the classnames given in configuration. Original solids are temporarily removed, so only masked copies remain visible.

On scroll, immerser moves a mask and its contents in opposite directions. This shows only the part of each solid group that should belong to the current layer. When the active layer changes, immerser updates the pager, can update the location hash and emits events.

When window or container size changes, immerser measures everything again and recalculates positions. If layers change in DOM, call `render()` to synchronize the structure. If scroll is controlled outside immerser, disable the built-in scroll listener and call `syncScroll()` manually.

# Options

You can pass options to immerser as an object parameter.

Hot options can be changed after mount with `updateOptions`. Init options are applied only during initialization.

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


# Events

You can subscribe to events via the `on` option or by calling the `on` or `once` method on an immerser instance.

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


# Public fields and methods

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
| layerIds | `getter` | Layer ids in the same order as layers appear in DOM |
| structureSignature | `getter` | Current structure signature used to detect layer-list changes |
| layoutSignature | `getter` | Current layout signature used to detect geometry changes |
| drawSignature | `getter` | Current draw signature used to detect visual state changes |


# Recipes

## Cloning Event Listeners

Since immerser cloning nested nodes by default, all event listeners and data bound on nodes will be lost after init. Fortunately, you can markup the immerser yourself. It can be useful when you have event listeners on solids, reactive logic or more than classname switching. All you need is to place the number of nested immerser masks equal to the number of the layers. Look how I change the smiley emoji on the right in this page source.

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

As mentioned above, immerser cloning nested nodes to achieve changing on scroll. Therefore if you hover a partially visible element, only the visible part will change. If you want to synchronize all cloned links, just pass `data-immerser-synchro-hover="hoverId"` attribute. It will share `_hover` class between all nodes with this `hoverId` when the mouse is over one of them. Add `_hover` selector alongside your `:hover` pseudoselector to style your interactive elements.

```css
a:hover,
a._hover {
  color: magenta;
}
```

## Handle <abbr title="Document Object Model">DOM</abbr> change

Immerser is not aware of changes in DOM, if you dynamically add or remove nodes. If you change height of the document and want immerser to recalculate and redraw solids, call `render` method on the immerser instance.

```js
// make any manipulations, that changes <abbr title="Document Object Model">DOM</abbr> flow
document.appendChild(someNode);
document.removeChild(anotherNode);

// then tell immerser redraw things
immerserInstance.render();

```

## External Scroll Engine

If you drive scrolling with a custom scroll engine, for example Locomotive Scroll, disable immerser scroll listener with `hasExternalScroll=true` flag and call `syncScroll` method every time the engine updates position. Immerser will only redraw masks without attaching another scroll handler. Keep in mind that immerser will not optimize calls this way, and performance optimization is client responsibility.

```js
import Immerser from 'immerser';

const immerserInstance = new Immerser({
  // turn off immerser scroll handling when using a custom engine
  hasExternalScroll: true,
});

customScrollEngine.on('scroll', () => {
  // subscribe to engine scroll event to run sync immerser
  immerserInstance.syncScroll();
});

```

## External Renderer

Use `hasExternalRenderer=true` when a rendering framework owns immerser markup. For example, a React wrapper can keep the masks and solids in framework state: [immerser-react](https://github.com/dubaua/immerser-react).

With this flag enabled, immerser does not create masks, clone solids, detach original solids, clean or restore renderer-owned markup, update pager active class, or synchronize hover classes. It still connects existing masks, measures layers, applies required technical styles, updates mask transforms, and emits state events for the external renderer.

## <abbr title="Artificial Intelligence">AI</abbr> usage note

The core of the library was written in 2019 and significantly improved in 2022, before AI\-assisted programming became a thing. In later iterations, AI was used as a supporting tool for infrastructure tasks, documentation updates, and generation of code generation.

For me, AI is just another tool alongside linters, bundlers, and other means of speeding up and simplifying work. I am lazy, and my laziness pushes me toward inventing better tools.

I use AI openly and consider it important to state this explicitly, because for some people it can be a deciding factor.

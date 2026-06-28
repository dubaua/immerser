# Library for Switching Fixed Elements on Scroll

Sometimes designers create complex logic and fix parts of the interface. Also they colour page sections contrasted. How to deal with this mess?

Immerser comes to help you. It’s a javascript library to change fixed elements on scroll.

Immerser fast, because it calculates states once on init. Then it watches the scroll position and schedules redraw document in the next event loop tick with requestAnimationFrame. Script changes transform property, so it uses graphic hardware acceleration.

Immerser is written on typescript. Runtime bundle 8.89Kb gzipped.

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
<script src="https://unpkg.com/immerser@5.1.0/dist/immerser.min.js"></script>
```

## Prepare Your Markup

First, setup fixed container as the immerser root container, and add the `data-immerser` attribute.

Next place absolutely positioned children into the immerser parent and add `data-immerser-solid="solid-id"` to each.

Then add `data-immerser-layer` attribute to each section and pass configuration as `solidClassnamesByLayerId` option to immerser. Config should contain JSON describing what class should be applied on each solid element, when it's over a section.

Also feel free to add `data-immerser-pager` to create a pager for your layers.

```html
<div class="fixed" data-immerser>
  <div class="fixed__pager pager" data-immerser-pager data-immerser-solid="pager"></div>
  <a href="#reasoning" class="fixed__logo logo" data-immerser-solid="logo">immerser</a>
  <div class="fixed__menu menu" data-immerser-solid="menu">
    <a href="#reasoning" class="menu__link">Reasoning</a>
    <a href="#how-to-use" class="menu__link">How to Use</a>
    <a href="#how-it-works" class="menu__link">How it Works</a>
    <a href="#options" class="menu__link">Options</a>
    <a href="#recipes" class="menu__link">Recipes</a>
  </div>
  <div class="fixed__language language" data-immerser-solid="language">
    <a href="/" class="language__link">english</a>
    <a href="/ru.html" class="language__link">по-русски</a>
  </div>
  <div class="fixed__about about" data-immerser-solid="about">
    &copy; 2026 &mdash; Vladimir Lysov, Chelyabinsk, Russia
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

# How it Works

First, immerser gathers information about the layers, solids, window and document. Then it creates a statemap for each layer, containing all necessary information, when the layer is partially and fully in viewport.

After that immerser modifies DOM, cloning all solids into mask containers for each layer and applying the classnames given in configuration. If you have added a pager, immerser also creates links for layers.

Finally, immerser binds listeners to scroll and resize events. On resize, it will meter layers, the window and document heights again and recalculate the statemap.

On scroll, immerser moves a mask of solids to show part of each solid group according to the layer below.

# Options

You can pass options to immerser as an object parameter.

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
  isScrollHandled: false,
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

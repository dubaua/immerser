# Library for Switching Fixed Elements on Scroll

Look, you have fixed posh things on your page and contrast sections with same color. If you want smoothly recolor your fixeds on scroll use this.

# How it Works

Immerser clone your nodes to recolor, I call them 'solids', wrap them with cropper containers, and bind classes to clonned children, according to given configuration. On scroll immerser calculate position of solids relative to layers and mask solids as they enter or leave.

# How to Use

## Prepare Your Markup

First, setup your a fixed container as the immerser root container, and add `data-immerser` attribute.

Next place absolutely positioned children into the immerser parent and add `data-immerser-solid="solid-id"` to each.

Then add `data-immerser-layer` attribute for each your section and pass configuraton with `data-immerser-layer-config='{ "solid-id": "classname-modifier" }'`. Otherwise, you can pass configuration as `solidClassnameArray` option to immerser. Config should contain JSON describing what class should be applied on solid element, when it over a section.

Also feel free to add `data-immerser-pager` to create pager for your layers.

```html
<div class="fixed" data-immerser>
  <div class="fixed__logo logo" data-immerser-solid="logo">immerser</div>
  <div class="fixed__pager pager" data-immerser-pager data-immerser-solid="pager"></div>
  <div class="fixed__menu menu" data-immerser-solid="menu">
    <a href="#reasoning" class="menu__link">Reasoning</a>
    <!-- links... -->
  </div>
  <div class="fixed__footer footer" data-immerser-solid="footer">© 2019 — Vladimir Lysov, Chelyabinsk, Russia</div>
</div>

<div
  id="reasoning"
  class="section"
  data-immerser-layer
  data-immerser-layer-config='{ "logo": "logo--contrast", "pager": "pager--contrast"}'
>
  <!-- layer content -->
</div>
<!-- another layers... -->
<div
  id="possibilities"
  class="section"
  data-immerser-layer
  data-immerser-layer-config='{ "menu": "menu--contrast", "footer": "footer--contrast" }'
>
  <!-- layer content -->
</div>
```

## Add Style Modifiers

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
.fixed__footer {
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
.footer {
  color: black;
}
.logo--contrast,
.pager--contrast,
.menu--contrast,
.footer--contrast {
  color: white;
}
```

## Init Immerser

Just import immerser and run it.

```js
import Immerser from 'immerser';
const myImmerser = new Immerser();
```

# Options

You can pass options to immerser as data-attributes or as function parameters. Data-attributes process last, so they will override options passed in function.

| option                   | type       | default                 | description                                                                                                                     |
| ------------------------ | ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| solidClassnameArray      | `array`    | `[]`                    | Array of layer class configurations. Overrides config passed in `data-immerser-layer-config` for corresponding layer            |
| pagerTreshold            | `number`   | `0.5`                   | How much next layer should be in viewport to trigger pager                                                                      |
| stylesInCSS              | `boolean`  | `false`                 | Flag to controll attaching inline styles to created nodes. Set `true` and include `immerser.css` if you want keep your DOM neat |
| pagerClassname           | `string`   | `'pager'`               | Classname for pager. Style it on your own.                                                                                      |
| pagerLinkClassname       | `string`   | `'pager__link'`         | Classname for pager link. Style it on your own.                                                                                 |
| pagerLinkActiveClassname | `string`   | `'pager__link--active'` | Classname for active pager link. Style it on your own.                                                                          |
| onInit                   | `function` | `null`                  | Will be fired after initialization. Accept an immerser instance as the only parameter.                                          |
| onActiveLayerChange      | `function` | `null`                  | Will be fired after active layer change. Accept active layer index as first parameter and an immerser instance as second.       |

If passed option fails validation it falled back to default value.

# Limitations

## Event listeners and data bound on solid nodes

Cause of all immerser child nodes will be clonned, you will lost all listeners and data.

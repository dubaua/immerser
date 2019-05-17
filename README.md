# Library for switching fixed elements on scroll

Look, you have fixed posh things on your page and contrast sections with same color. If you want smoothly recolor your fixeds on scroll use this.

# How it works

Immerser clone your nodes to recolor, I call them 'solids', wrap them with cropper containers, and bind classes to clonned children, according to given configuration. On scroll immerser calculate position of solids relative to layers and mask solids as they enter or leave.

# How to use

## Prepare your markup

First, setup your fixed parent container as immerser parent container, and add `data-immerser` as default selector, or choose your own and pass it as value of `immerserSelector` option to immerser function.

Next add `data-immerser-solid="solid-id"` attribute to each your fixed children to switch on scroll.

Then add `data-immerser-layer` as default selector for your section and pass configuraton with `data-immerser-layer-config='{ "solid-id": "classname-modifier" }'`. Otherwise, you can pass configuration as `solidClassnameArray` option to the function. Config should contain JSON describing what class should be applied on solid element, when it over a section. Watch out JSON wants double quotes!

Also feel free to add `data-immerser-pager` to create pager for your layers.

```html
<div class="fixed-parent" data-immerser>
  <a href="/about" class="logo" data-immerser-solid="logo">
    <img src="/images/logo.svg" alt="Immerser" />
  </a>
  <nav class="navigation" data-immerser-solid="navigation">
    <a href="/about" class="link">About</a>
  </nav>
  <footer class="footer" data-immerser-solid="footer">
    © 2019 Immerser
  </footer>
  <div class="pagination" data-immerser-pager></div>
</div>

<section class="section" data-immerser-layer></section>
<section
  class="section section--contrast"
  data-immerser-layer
  data-immerser-layer-config='{
    "logo": "logo--contrast",
    "navigation": "navigation--contrast",
    "footer": "footer--contrast"
  }'
></section>
<section class="section" data-immerser-layer></section>
<section
  class="section section--contrast"
  data-immerser-layer
  data-immerser-layer-config='{
    "logo": "logo--contrast",
    "navigation": "navigation--contrast",
    "footer": "footer--contrast"
  }'
></section>
```

## Add style modifiers

```css
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
.navigation,
.footer {
  color: black;
}
.logo--contrast,
.navigation--contrast,
.footer--contrast {
  color: white;
}
```

## Init immerser

Just import immerser and run it.

```js
import immerser from 'immerser';
immerser();
```

# Options

You can pass options to immerser as data-attributes or as function parameters. Data-attributes process last, so they will override options passed in function.

| option                   | type      | default                   | description                                                                                                                     |
| ------------------------ | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| immerserSelector         | `string`  | `'[data-immerser]'`       | Selector for immerser solids parent container                                                                                   |
| layerSelector            | `string`  | `'[data-immerser-layer]'` | Selector for immerser layers                                                                                                    |
| solidSelector            | `string`  | `'[data-immerser-solid]'` | Selector for immerser solids                                                                                                    |
| pagerSelector            | `string`  | `'[data-immerser-pager]'` | Selector for pager                                                                                                              |
| solidClassnameArray      | `array`   | `[]`                      | Array of layer class configurations. Overrides config passed in `data-immerser-layer-config` for corresponding layer            |
| pagerTreshold            | `number`  | `0.5`                     | How much next layer should be in viewport to trigger pager                                                                      |
| stylesInCSS              | `boolean` | `false`                   | Flag to controll attaching inline styles to created nodes. Set `true` and include `immerser.css` if you want keep your DOM neat |
| immerserClassname        | `string`  | `'immerser'`              | Classname for immerser root. Applied when `stylesInCss` set to `true`.                                                          |
| immerserWrapperClassname | `string`  | `'immerser__wrapper'`     | Classname for immerser wrapper. Applied when `stylesInCss` set to `true`.                                                       |
| immerserMaskClassname    | `string`  | `'immerser__mask'`        | Classname for immerser mask. Applied when `stylesInCss` set to `true`.                                                          |
| immerserSolidClassname   | `string`  | `'immerser__solid'`       | Classname for immerser solid. Applied when `stylesInCss` set to `true`.                                                         |
| pagerClassname           | `string`  | `'pager'`                 | Classname for pager. Style it on your own.                                                                                      |
| pagerLinkClassname       | `string`  | `'pager__link'`           | Classname for pager link. Style it on your own.                                                                                 |
| pagerLinkActiveClassname | `string`  | `'pager__link--active'`   | Classname for active pager link. Style it on your own.                                                                          |

If passed option fails validation it falled back to default value.

# Limitations

## Event listeners and data bound on solid nodes

Cause of all immerser child nodes will be clonned, you will lost all listeners and data.

# Library for switching fixed elements on scroll

# How to use

## Prepare your markup

First add `data-immerser-id="fixed-id"` attribute to each your fixed elements.

Then add `data-immerser-config='{ "fixed-id": "classname-modifier" }'` attribute to each your screen section. Config should contain JSON describing what class should be applied on fixed element, when it over section. Watch out JSON contains double quotes!

```html
<a href="/about" class="logo" data-immerser-id="logo">
  <img src="/images/logo.svg" alt="Immerser">
</a>
<nav class="navigation" data-immerser-id="navigation">
  <a href="/about" class="link">About</a>
</nav>
<footer class="footer" data-immerser-id="footer">© 2019 Immerser</footer>

<section class="section" data-immerser-config='{
  "logo": "logo--default",
  "navigation": "navigation--default",
  "footer": "footer--default"
}'>
</section>
<section class="section section--contrast" data-immerser-config='{
  "logo": "logo--contrast",
  "navigation": "navigation--contrast",
  "footer": "footer--contrast"
}'>
</section>
<section class="section" data-immerser-config='{
  "logo": "hidden",
  "navigation": "hidden",
  "footer": "hidden"
}'>
</section>
<section class="section" data-immerser-config='{
  "logo": null,
  "navigation": null,
  "footer": null
}'>
</section>
```

## Add style modifiers

## Init immerser

Just import immerser and run it.

```js
import immerser from 'immerser';
immerser();
```

Or if you looking for debug information immerser returns object with
const myImmerser = immerser();

# Limitations
## Text nodes

Please, wrap your text with container, if it is direct child of your fixed element.

Following won't work:
```html
<div class="fixed" data-immerser-id="fixed-text">
  Text to recolor
</div>
```
But this is fine:
```html
<div class="fixed" data-immerser-id="fixed-text">
  <span>Text to recolor</span>
</div>
```
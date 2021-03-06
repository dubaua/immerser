// <%= getTranslation('dont-import-if-umd-line-1') %>
// <%= getTranslation('dont-import-if-umd-line-2') %>
import Immerser from 'immerser';

const immerserInstance = new Immerser({
  // <%= getTranslation('data-attribute-will-override-this-option-line-1') %>
  // <%= getTranslation('data-attribute-will-override-this-option-line-2') %>
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
    // <%= getTranslation('callback-on-init') %>
  },
  onBind(immerser) {
    // <%= getTranslation('callback-on-bind') %>
  },
  onUnbind(immerser) {
    // <%= getTranslation('callback-on-unbind') %>
  },
  onDestroy(immerser) {
    // <%= getTranslation('callback-on-destroy') %>
  },
  onActiveLayerChange(activeIndex, immerser) {
    // <%= getTranslation('callback-on-active-layer-change') %>
  },
});

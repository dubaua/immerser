// <%= getTranslation('dont-import-if-umd-line-1') %>
// <%= getTranslation('dont-import-if-umd-line-2') %>
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
      // <%= getTranslation('callback-on-init') %>
    },
    mount(immerser) {
      // <%= getTranslation('callback-on-mount') %>
    },
    unmount(immerser) {
      // <%= getTranslation('callback-on-unmount') %>
    },
    destroy(immerser) {
      // <%= getTranslation('callback-on-destroy') %>
    },
    structureChange(immerser) {
      // <%= getTranslation('callback-on-structure-change') %>
    },
    layoutChange(immerser) {
      // <%= getTranslation('callback-on-layout-change') %>
    },
    activeLayerChange(activeIndex, immerser) {
      // <%= getTranslation('callback-on-active-layer-change') %>
    },
    layerProgressChange(layerProgressArray, immerser) {
      // <%= getTranslation('callback-on-layer-progress-change') %>
    },
  },
});

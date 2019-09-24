import Immerser from '../immerser.js';

const immerserInstance = new Immerser({
  hasToUpdateHash: true,
  hasToAdjustScroll: true,
  scrollAdjustThreshold: 200,
  scrollAdjustDelay: 300,
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
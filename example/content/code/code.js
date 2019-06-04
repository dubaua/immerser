import Immerser from '../immerser.js';

const immerserInstance = new Immerser({
  hasToUpdateHash: true,
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
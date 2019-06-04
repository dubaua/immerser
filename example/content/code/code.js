import Immerser from '../immerser.js';

const my = new Immerser({
  synchroHoverPagerLinks: true,
  onInit(immerser) {
    // callback on init
  },
  onActiveLayerChange(activeIndex, immerser) {
    // callback on layer change
  }
});
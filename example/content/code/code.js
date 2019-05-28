import Immerser from '../immerser.js';
import '../immerser.scss';

const my = new Immerser({
  stylesInCSS: true,
  synchroHoverPagerLinks: true,
  onInit(immerser) {
    // callback on init
  },
  onActiveLayerChange(activeIndex, immerser) {
    // callback on layer change
  }
});
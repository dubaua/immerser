import Immerser from '../immerser.js';
import '../immerser.scss';

const my = new Immerser({
  stylesInCSS: true,
  onInit(immerser) {
    console.log(immerser);
  },
});

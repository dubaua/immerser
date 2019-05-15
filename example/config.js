import Immerser from '../immerser.js';

const my = new Immerser({
  solidIds: ['logo', 'menu'],
  solidClassnames: [
    { logo: 'logo--contrast', pager: 'pager--contrast' },
    { menu: 'menu--contrast' },
    { logo: 'logo--contrast', pager: 'pager--contrast' },
    { menu: 'menu--contrast' },
  ],
  immerserSelector: '.js-immerser',
  layerSelector: '.js-layer',
  createPager: true,
});

console.log(my);
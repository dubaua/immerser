import immerser from '../immerser.js';

const my = immerser({
  solidIds: ['logo', 'menu'],
  solidClassnames: [
    { logo: 'logo--contrast' },
    { menu: 'menu--contrast' },
    { logo: 'logo--contrast' },
    { menu: 'menu--contrast' },
  ],
  immerserSelector: '.js-immerser',
  layerSelector: '.js-layer',
  pagerSelector: '.js-pager',
  createPager: true,
});

console.log(my);
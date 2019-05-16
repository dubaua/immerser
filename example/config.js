import Immerser from '../immerser.js';

const my = new Immerser({
  solidClassnames: [
    { logo: 'logo--contrast', pager: 'pager--contrast' },
    { menu: 'menu--contrast' },
    { logo: 'logo--contrast', pager: 'pager--contrast' },
    { menu: 'menu--contrast' },
  ],
  pagerTreshold: 1.3,
  pagerClassname: 'jopa',
  pagerLinkClassname: 'jopa',
  pagerLinkActiveClassname: 'jopa',
  layerSelector: 'sea',
  suka: 'bitch'
});

console.log(my);

import Immerser from '../immerser.js';
import 'normalize.css';
import '../immerser.scss';

const my = new Immerser({
  stylesInCSS: true,
  synchroHoverPagerLinks: true,
  onInit(immerser) {
    console.log(immerser);
  },
  onActiveLayerChange(activeIndex, immerser) {
    console.log(activeIndex, immerser);
  }
});

const highlighterNodeList = document.querySelectorAll('[data-highlighter]');
for (let i = 0; i < highlighterNodeList.length; i++) {
  const highlighterNode = highlighterNodeList[i];
  highlighterNode.addEventListener('mouseover', highlight(highlighterNode));
  highlighterNode.addEventListener('click', highlight(highlighterNode));
  function highlight(highlighterNode) {
    return function() {
      const targetSelector = highlighterNode.dataset.highlighter;
      const targetNodeList = document.querySelectorAll(targetSelector);
      for (let j = 0; j < targetNodeList.length; j++) {
        const targetNode = targetNodeList[j];
        targetNode.classList.add('highlight');
        const timerId = setTimeout(() => {
          targetNode.classList.remove('highlight');
          clearTimeout(timerId);
        }, 1500);
      }
    }
  }
}

// TODO
// pass options as DOM props
// host demo on github pages
// finish demo
/*

Рассказть почему иммерсер, он быстрый и понятный.
Почему иммерсер?
No bundlefobia



Есть полный контроль над происходящим.
Поддержка кастомного лайяута
Поддержка ховеров


Рассказать про опции

Рассказать про возможности

Рассказать про рецепты
*/
// finish readme
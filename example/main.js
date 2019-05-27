import Immerser from '../immerser.js';
import 'normalize.css';
import '../immerser.scss';
// import Prism from 'prismjs';

const my = new Immerser({
  stylesInCSS: true,
  synchroHoverPagerLinks: true,
  onInit(immerser) {
    console.log(immerser);
  },
  onActiveLayerChange(activeIndex, immerser) {
    console.log(activeIndex, immerser);
  },
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
        if (!targetNode.isHighlighting) {
          targetNode.isHighlighting = true;
          targetNode.classList.add('highlight');
          const timerId = setTimeout(() => {
            targetNode.classList.remove('highlight');
            clearTimeout(timerId);
            targetNode.isHighlighting = false;
          }, 1500);
        }
      }
    };
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

Справиться с горизонтальным скроллом

Сделать разные фейсы

Сделать прикол по клику на фейс
*/
// finish readme

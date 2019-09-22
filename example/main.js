import Immerser from '../src/immerser.js';
import SimpleBar from 'simplebar';
// import 'simplebar/dist/simplebar.css';
// import 'normalize.css';
import './/styles/main.scss';
// import Prism from 'prismjs';

const scrollbarNodeList = document.querySelectorAll('.scroller-x');
for (let i = 0; i < scrollbarNodeList.length; i++) {
  const scrollbarNode = scrollbarNodeList[i];
  new SimpleBar(scrollbarNode, { autoHide: false });
}

const immerserInstance = new Immerser({
  hasToUpdateHash: true,
  hasToAdjustScroll: true,
  scrollAdjustThreshold: 200,
  scrollAdjustDelay: 300,
  onInit(immerser) {
    window.imm = immerser;
    console.log('onInit', immerser);
  },
  onBind(immerser) {
    console.log('onBind', immerser);
  },
  onUnbind(immerser) {
    console.log('onUnbind', immerser);
  },
  onDestroy(immerser) {
    console.log('onDestroy', immerser);
  },
  onActiveLayerChange(activeIndex, immerser) {
    console.log('onActiveLayerChange', activeIndex, immerser);
  },
});

const highlighterNodeList = document.querySelectorAll('[data-highlighter]');
const highlighterAnimationClassname = 'highlighter-animation-active';

for (let i = 0; i < highlighterNodeList.length; i++) {
  const highlighterNode = highlighterNodeList[i];
  highlighterNode.addEventListener('mouseover', highlight(highlighterNode));
  highlighterNode.addEventListener('click', highlight(highlighterNode));

  function highlight(highlighterNode) {
    return function() {
      if (!immerserInstance.isBound) return;
      const targetSelector = highlighterNode.dataset.highlighter;
      const targetNodeList = document.querySelectorAll(targetSelector);
      for (let j = 0; j < targetNodeList.length; j++) {
        const targetNode = targetNodeList[j];
        if (!targetNode.isHighlighting) {
          targetNode.isHighlighting = true;
          targetNode.classList.add(highlighterAnimationClassname);
          const timerId = setTimeout(() => {
            targetNode.classList.remove(highlighterAnimationClassname);
            clearTimeout(timerId);
            targetNode.isHighlighting = false;
          }, 1500);
        }
      }
    };
  }
}

const emojiNodeList = document.querySelectorAll('[data-emoji-animating]');
for (let i = 0; i < emojiNodeList.length; i++) {
  const emojiNode = emojiNodeList[i];
  emojiNode.addEventListener('click', function() {
    if (emojiNode.dataset.emojiAnimating === 'false') {
      emojiNode.dataset.emojiAnimating = 'true';
      setTimeout(() => {
        emojiNode.dataset.emojiAnimating = 'false';
      }, 620);
    }
  });
}

document.addEventListener('keydown', ({ altKey, key }) => {
  if (altKey && key.toLowerCase() === 'r') {
  document.body.classList.toggle('rulers');
  }
});

console.log('welcome here, fella. Press Alt+R to see vertical rhythm');

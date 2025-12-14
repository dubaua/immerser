import Immerser from '../src/immerser';
import './styles/main.scss';
import { initEmojiAnimation } from './emoji/animation';

type HighlightableElement = HTMLElement & { isHighlighting?: boolean };

declare global {
  interface Window {
    immerserInstance?: Immerser;
  }
}

const { handleLayersUpdate } = initEmojiAnimation();

const immerserInstance = new Immerser({
  solidClassnameArray: [
    {
      logo: 'logo--contrast-lg',
      pager: 'pager--contrast-lg',
      language: 'language--contrast-lg',
    },
    {
      pager: 'pager--contrast-only-md',
      menu: 'menu--contrast',
      about: 'about--contrast',
    },
    {
      logo: 'logo--contrast-lg',
      pager: 'pager--contrast-lg',
      language: 'language--contrast-lg',
    },
    {
      logo: 'logo--contrast-only-md',
      pager: 'pager--contrast-only-md',
      language: 'language--contrast-only-md',
      menu: 'menu--contrast',
      about: 'about--contrast',
    },
    {
      logo: 'logo--contrast-lg',
      pager: 'pager--contrast-lg',
      language: 'language--contrast-lg',
    },
  ],
  fromViewportWidth: 1024,
  pagerLinkActiveClassname: 'pager__link--active',
  scrollAdjustThreshold: 50,
  scrollAdjustDelay: 600,
  onInit(immerser) {
    window.immerserInstance = immerser;
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
  onLayersUpdate(layersProgress, immerser) {
    handleLayersUpdate(layersProgress);
  },
});

const highlighterNodeList = document.querySelectorAll<HTMLElement>('[data-highlighter]');
const highlighterAnimationClassname = 'highlighter-animation-active';

function highlight(highlighterNode: HTMLElement) {
  return () => {
    if (!immerserInstance.isBound) {
      return;
    }
    const targetSelector = highlighterNode.dataset.highlighter;
    if (!targetSelector) {
      return;
    }
    const targetNodeList = document.querySelectorAll<HighlightableElement>(targetSelector);
    targetNodeList.forEach((targetNode) => {
      if (targetNode.isHighlighting) {
        return;
      }
      targetNode.isHighlighting = true;
      targetNode.classList.add(highlighterAnimationClassname);
      const timerId = window.setTimeout(() => {
        targetNode.classList.remove(highlighterAnimationClassname);
        window.clearTimeout(timerId);
        targetNode.isHighlighting = false;
      }, 1500);
    });
  };
}

highlighterNodeList.forEach((highlighterNode) => {
  highlighterNode.addEventListener('mouseover', highlight(highlighterNode));
  highlighterNode.addEventListener('click', highlight(highlighterNode));
});

const rulersNode = document.getElementById('rulers');
if (rulersNode) {
  document.addEventListener('keydown', ({ altKey, code, keyCode }) => {
    const isR = code === 'KeyR' || keyCode === 82;
    if (altKey && isR) {
      rulersNode.classList.toggle('rulers--active');
    }
  });
}

console.log('welcome here, fella. Press Alt+R to see vertical rhythm');

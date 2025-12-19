import { Ogawa } from 'ogawa';
import * as phrasesEn from './phrases.en';
import * as phrasesRu from './phrases.ru';

export function initSulking() {
  const language = document.documentElement.getAttribute('lang');
  const isRu = language === 'ru';
  const phrases = isRu ? phrasesRu : phrasesEn;
  const { requiredPhrases, randomPhrases } = phrases;

  const MOVE_LIMIT = 128;

  type SulkingState = {
    nodes: HTMLElement[];
    sulkNodes: HTMLElement[];
    sulkAnimation: Ogawa | null;
    sulkFadeAnimation: Ogawa | null;
    moveCounter: number;
  };

  type SulkingListener = {
    node: HTMLElement;
    onMouseMove: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
  };

  const sulkingState: SulkingState = {
    nodes: [],
    sulkNodes: [],
    sulkAnimation: null,
    sulkFadeAnimation: null,
    moveCounter: 0,
  };

  const sulkingListeners: SulkingListener[] = [];

  function triggerSulkAnimation(phrase: string) {
    if (sulkingState.sulkAnimation?.isRunning) {
      return;
    }

    const duration = Math.min(phrase.length * 48, 500);

    sulkingState.sulkFadeAnimation?.pause().destroy();
    sulkingState.sulkFadeAnimation = null;
    sulkingState.sulkAnimation = new Ogawa({
      duration,
      draw: (progress) => {
        const charsToShow = Math.floor(phrase.length * progress);
        const text = phrase.slice(0, charsToShow);
        sulkingState.sulkNodes.forEach((sulkNode) => {
          sulkNode.style.opacity = '1';
          sulkNode.textContent = text;
        });
      },
      onComplete: () => {
        sulkingState.sulkNodes.forEach((sulkNode) => {
          sulkNode.textContent = phrase;
        });
        sulkingState.sulkFadeAnimation = new Ogawa({
          delay: 2000,
          duration: 320,
          draw: (progress) => {
            const opacity = (1 - progress).toString();
            sulkingState.sulkNodes.forEach((sulkNode) => {
              sulkNode.style.opacity = opacity;
            });
          },
        });
      },
    });
  }

  function trigger() {
    const requiredPhrase = requiredPhrases.shift();
    if (requiredPhrase) {
      triggerSulkAnimation(requiredPhrase);
      return;
    }

    if (randomPhrases.length === 0) {
      destroy();
      return;
    }

    const randomIndex = Math.floor(Math.random() * randomPhrases.length);
    const randomPhrase = randomPhrases.splice(randomIndex, 1)[0];
    if (randomPhrase) {
      triggerSulkAnimation(randomPhrase);
    }
  }

  function destroy() {
    sulkingListeners.forEach(({ node, onMouseMove, onMouseLeave, onClick }) => {
      node.removeEventListener('mousemove', onMouseMove);
      node.removeEventListener('mouseleave', onMouseLeave);
      node.removeEventListener('click', onClick);
    });

    sulkingListeners.length = 0;
    sulkingState.nodes = [];
    sulkingState.sulkNodes = [];
    sulkingState.sulkAnimation?.pause().destroy();
    sulkingState.sulkAnimation = null;
    sulkingState.sulkFadeAnimation?.pause().destroy();
    sulkingState.sulkFadeAnimation = null;
    sulkingState.moveCounter = 0;
  }

  sulkingState.nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-sulking]'));

  if (sulkingState.nodes.length === 0) {
    return;
  }

  sulkingState.sulkNodes = sulkingState.nodes.map((node) => {
    node.classList.add('sulk');
    node.classList.add('typography');

    const sulkNode = document.createElement('p');
    sulkNode.className = 'sulk__phrase';
    node.append(sulkNode);
    return sulkNode;
  });

  sulkingState.nodes.forEach((node) => {
    const onMouseMove = () => {
      sulkingState.moveCounter += 1;

      if (sulkingState.moveCounter < MOVE_LIMIT) {
        return;
      }

      sulkingState.moveCounter = 0;
      trigger();
    };

    const onMouseLeave = () => {
      sulkingState.moveCounter = 0;
    };

    const onClick = () => {
      trigger();
      sulkingState.moveCounter = 0;
    };

    node.addEventListener('mousemove', onMouseMove);
    node.addEventListener('mouseleave', onMouseLeave);
    node.addEventListener('click', onClick);

    sulkingListeners.push({ node, onMouseMove, onMouseLeave, onClick });
  });
}

import { easeSinInOut } from 'd3-ease';
import Observable from '@dubaua/observable';
import Immerser from 'immerser';
import Animation from '../../../ogawa/src/animate';
import { EmojiNodes, selectEmojiNodes } from './select-emoji-nodes';
import { renderEmojiFace } from './render-emoji-face';
import { EmojiFaceConfig, deadConfig, layerConfigs } from './config';
import { mixConfigByProgress } from './mix-config-by-progress';
import { renderHpBar } from './render-hp-bar';

const emojiAnimationDurationMs = 620;
const facePressOffsetPx = 2;
const MaxHP = 1000;
const HPRegenDelayMS = 1400;

type EmojiState = {
  hp: Observable<number>;
  hpRegen: number;
  regenAnimation: Animation | null;
  hpBarAnimation: Animation | null;
  isDead: Observable<boolean>;
  lastConfig: EmojiFaceConfig;
  nodes: EmojiNodes[];
};

const emojiState: EmojiState = {
  hp: new Observable(1000),
  hpRegen: 333,
  regenAnimation: null,
  hpBarAnimation: null,
  isDead: new Observable(false),
  lastConfig: deadConfig,
  nodes: [],
};

function startDelayedRegen(): void {
  emojiState.regenAnimation?.pause().destroy();

  const missingHp = MaxHP - emojiState.hp.value;
  const duration = (missingHp / emojiState.hpRegen) * 1000;
  const startHp = emojiState.hp.value;

  emojiState.regenAnimation = new Animation({
    duration,
    delay: HPRegenDelayMS,
    draw: (progress) => {
      emojiState.hp.value = Math.min(MaxHP, startHp + missingHp * progress);
    },
    onComplete: () => {
      emojiState.regenAnimation?.destroy();
      emojiState.hpBarAnimation = new Animation({
        delay: 2000,
        duration: 320,
        draw: (p) => {
          renderHpBars(MaxHP, 1 - p);
        },
        onComplete: () => {
          emojiState.regenAnimation?.destroy();
        },
      });
    },
  });
}

function renderHpBars(hp: number, opacity: number) {
  emojiState.nodes.forEach((nodes) => {
    if (nodes.hpBarOutline && nodes.hpBarFill) {
      renderHpBar(hp, MaxHP, opacity, nodes.hpBarOutline, nodes.hpBarFill);
    }
  });
}

export function initEmojiAnimation(immerser: Immerser) {
  const faceNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-emoji-face]'));

  if (faceNodes.length === 0) {
    return { handleLayersUpdate: (_: number[]) => {} };
  }

  emojiState.nodes = faceNodes.map((face) => selectEmojiNodes(face));

  const spinAnimation = new Animation({
    autoStart: false,
    duration: emojiAnimationDurationMs,
    draw: (progress) => {
      const easedProgress = easeSinInOut(progress);
      emojiState.nodes.forEach((nodes) => {
        const target = nodes.rotator;
        if (target) {
          target.setAttribute('transform', `rotate(${360 * easedProgress} 125 125)`);
        }
      });

      emojiState.nodes.forEach((nodes) => {
        if (nodes.handInner) {
          const halfProgress = progress <= 0.5 ? progress / 0.5 : 2 - 2 * progress;
          const angle = -3 * halfProgress;
          nodes.handInner.style.transform = `rotate(${angle}deg)`;
        }
      });
    },
  });

  const faceNodeListeners = faceNodes.map((faceNode) => {
    let isRunning = false;
    const onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();

      isRunning = spinAnimation.isRunning;
      spinAnimation.reset();
      if (!emojiState.isDead.value) {
        faceNodes.forEach((faceNode) => {
          faceNode.style.transform = `translateY(${facePressOffsetPx}px)`;
        });
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();

      faceNodes.forEach((faceNode) => {
        faceNode.style.transform = '';
      });

      if (!emojiState.isDead.value && isRunning) {
        const damage = Math.round(Math.random() * 150) + 100; // TODO use rollDice
        emojiState.hp.value = Math.min(Math.max(0, emojiState.hp.value - damage), MaxHP);
      }

      if (!emojiState.isDead.value) {
        spinAnimation.run();
      }
    };

    faceNode.addEventListener('mousedown', onMouseDown);
    faceNode.addEventListener('mouseup', onMouseUp);

    return { faceNode, onMouseDown, onMouseUp };
  });

  const handleLayersUpdate = (layersProgress: number[]) => {
    console.log('layersUpdate', layersProgress, immerser);

    emojiState.lastConfig = mixConfigByProgress(layersProgress, layerConfigs);

    if (!emojiState.isDead.value) {
      emojiState.nodes.forEach((nodes) => renderEmojiFace(emojiState.lastConfig, nodes));
    }
  };

  handleLayersUpdate([1, 0, 0, 0, 0]);

  emojiState.hp.subscribe((hp, prevHp) => {
    const hasMissingHp = 0 < hp && hp < MaxHP;
    const isDead = hp <= 0;
    const isHit = prevHp !== undefined && hp < prevHp;

    renderHpBars(hp, 1);

    if (isDead) {
      emojiState.regenAnimation?.pause().destroy();
      emojiState.isDead.value = true;
      return;
    }

    if (hasMissingHp && isHit) {
      startDelayedRegen();
    }
  });

  emojiState.isDead.subscribe((isDead) => {
    if (isDead) {
      const fadeToDeadAnimation = new Animation({
        duration: 320,
        draw: (p) => {
          const mixed = mixConfigByProgress([1 - p, p], [emojiState.lastConfig, deadConfig]);
          emojiState.nodes.forEach((nodes) => renderEmojiFace(mixed, nodes));
        },
        onComplete: () => {
          const buryAnimation = new Animation({
            delay: 1000,
            duration: 320,
            draw: (p) => {
              emojiState.nodes.forEach(({ face }) => {
                if (face) {
                  face.style.transform = `translate(${p * 200}%,0)`;
                }
              });
            },
            onComplete: () => {
              immerser.off('layersUpdate', handleLayersUpdate);

              faceNodeListeners.forEach(({ faceNode, onMouseDown, onMouseUp }) => {
                faceNode.removeEventListener('mousedown', onMouseDown);
                faceNode.removeEventListener('mouseup', onMouseUp);
                faceNode.style.transform = '';
              });

              spinAnimation.pause().destroy();
              emojiState.regenAnimation?.pause().destroy();
              emojiState.regenAnimation = null;
              emojiState.hpBarAnimation?.pause().destroy();
              emojiState.hpBarAnimation = null;

              emojiState.hp.reset();
              emojiState.isDead.reset();

              emojiState.nodes.forEach((nodes) => {
                nodes.face = null;
                nodes.mouthClipPath = null;
                nodes.mouthShape = null;
                nodes.mouthLine = null;
                nodes.tongue = null;
                nodes.leftEyeClosed = null;
                nodes.rightEyeClosed = null;
                nodes.leftEyeOpen = null;
                nodes.rightEyeOpen = null;
                nodes.leftBrow = null;
                nodes.rightBrow = null;
                nodes.glass = null;
                nodes.hpBarOutline = null;
                nodes.hpBarFill = null;
                nodes.handInner = null;
                nodes.handOuter = null;
                nodes.rotator = null;
              });
              emojiState.nodes = [];
              emojiState.lastConfig = deadConfig;

              faceNodes.forEach((node) => node.remove());
              faceNodes.length = 0;
              faceNodeListeners.length = 0;

              buryAnimation.destroy();
              fadeToDeadAnimation.destroy();
            },
          });
        },
      });
    }
  });

  return { handleLayersUpdate };
}

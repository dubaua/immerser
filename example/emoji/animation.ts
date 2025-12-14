import { easeSinInOut } from 'd3-ease';
import Observable from '@dubaua/observable';
import Animation from '../../../ogawa/src/animate';
import { EmojiNodes, selectEmojiNodes } from './select-emoji-nodes';
import { renderEmojiFace } from './render-emoji-face';
import { layerConfigs, EmojiFaceConfig, deadConfig } from './config';
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
    new Animation({
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
            // тут потом будем чистить кучу всего.
          },
        });
      },
    });
  }
});

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

export function initEmojiAnimation() {
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

  faceNodes.forEach((faceNode) => {
    let isRunning = false;
    faceNode.addEventListener('mousedown', (e) => {
      e.stopPropagation();

      isRunning = spinAnimation.isRunning;
      spinAnimation.reset();
      if (!emojiState.isDead.value) {
        faceNode.style.transform = `translateY(${facePressOffsetPx}px)`;
      }
    });

    faceNode.addEventListener('mouseup', (e) => {
      e.stopPropagation();

      faceNode.style.transform = '';

      if (!emojiState.isDead.value && isRunning) {
        const damage = Math.round(Math.random() * 150) + 100; // TODO use rollDice
        emojiState.hp.value = Math.min(Math.max(0, emojiState.hp.value - damage), MaxHP);
      }

      if (!emojiState.isDead.value) {
        spinAnimation.run();
      }
    });
  });

  const handleLayersUpdate = (layersProgress: number[]) => {
    emojiState.lastConfig = mixConfigByProgress(layersProgress, layerConfigs);

    if (!emojiState.isDead.value) {
      emojiState.nodes.forEach((nodes) => renderEmojiFace(emojiState.lastConfig, nodes));
    }
  };

  handleLayersUpdate([1, 0, 0, 0, 0]);

  return { handleLayersUpdate };
}

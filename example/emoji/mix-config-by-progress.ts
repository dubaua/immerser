import { EmojiFaceConfig } from './config';

export function mixConfigByProgress(layersProgress: number[], configs: EmojiFaceConfig[]): EmojiFaceConfig {
  return configs.reduce<EmojiFaceConfig>(
    (acc, config, index) => {
      const progress = layersProgress[index] ?? 0;

      acc.mouthEllipse += config.mouthEllipse * progress;
      acc.mouthLineScaleX += config.mouthLineScaleX * progress;
      acc.mouthLineShiftX += config.mouthLineShiftX * progress;
      acc.tongueX += config.tongueX * progress;
      acc.tongueY += config.tongueY * progress;
      acc.eyeOpenLeft += config.eyeOpenLeft * progress;
      acc.eyeOpenRight += config.eyeOpenRight * progress;
      acc.eyeClosedLeft += config.eyeClosedLeft * progress;
      acc.eyeClosedRight += config.eyeClosedRight * progress;
      acc.leftBrowScaleX += config.leftBrowScaleX * progress;
      acc.leftBrowY += config.leftBrowY * progress;
      acc.rightBrowScaleX += config.rightBrowScaleX * progress;
      acc.rightBrowY += config.rightBrowY * progress;
      acc.glasses += config.glasses * progress;
      acc.hand += config.hand * progress;

      return acc;
    },
    {
      mouthEllipse: 0,
      mouthLineScaleX: 0,
      mouthLineShiftX: 0,
      tongueX: 0,
      tongueY: 0,
      eyeOpenLeft: 0,
      eyeOpenRight: 0,
      eyeClosedLeft: 0,
      eyeClosedRight: 0,
      leftBrowScaleX: 0,
      leftBrowY: 0,
      rightBrowScaleX: 0,
      rightBrowY: 0,
      glasses: 0,
      hand: 0,
    },
  );
}

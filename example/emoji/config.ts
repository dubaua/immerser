export type EmojiFaceConfig = {
  mouthEllipse: number;
  mouthLineScaleX: number;
  mouthLineShiftX: number;
  tongueX: number;
  tongueY: number;
  eyeOpenLeft: number;
  eyeOpenRight: number;
  eyeClosedLeft: number;
  eyeClosedRight: number;
  leftBrowScaleX: number;
  leftBrowY: number;
  rightBrowScaleX: number;
  rightBrowY: number;
  glasses: number;
  hand: number;
};

export const currentConfig: EmojiFaceConfig = {
  mouthEllipse: 0,
  mouthLineScaleX: 1,
  mouthLineShiftX: 0.5,
  tongueX: 0.315,
  tongueY: 0.7,
  eyeOpenLeft: 0,
  eyeOpenRight: 0,
  eyeClosedLeft: 0.8,
  eyeClosedRight: 0.8,
  leftBrowScaleX: 0,
  leftBrowY: 0,
  rightBrowScaleX: 0,
  rightBrowY: 0,
  glasses: 0,
  hand: 0,
};

const configReasoning: EmojiFaceConfig = {
  mouthEllipse: 0,
  mouthLineScaleX: 1,
  mouthLineShiftX: 0.5,
  tongueX: 0.685,
  tongueY: 0,
  eyeOpenLeft: 0.8,
  eyeOpenRight: 0.8,
  eyeClosedLeft: 0,
  eyeClosedRight: 0,
  leftBrowScaleX: 0,
  leftBrowY: 0,
  rightBrowScaleX: 0,
  rightBrowY: 0,
  glasses: 0,
  hand: 0,
};

const configHowToUse: EmojiFaceConfig = {
  mouthEllipse: 0,
  mouthLineScaleX: 1,
  mouthLineShiftX: 0.5,
  tongueX: 0.685,
  tongueY: 0.7,
  eyeOpenLeft: 0.8,
  eyeOpenRight: 0.8,
  eyeClosedLeft: 0,
  eyeClosedRight: 0,
  leftBrowScaleX: 0,
  leftBrowY: 0,
  rightBrowScaleX: 0,
  rightBrowY: 0,
  glasses: 0,
  hand: 0,
};

const configHowItWorks: EmojiFaceConfig = {
  mouthEllipse: 0,
  mouthLineScaleX: 0.5,
  mouthLineShiftX: 0.67,
  tongueX: 0.685,
  tongueY: 0,
  eyeOpenLeft: 0.8,
  eyeOpenRight: 0.8,
  eyeClosedLeft: 0,
  eyeClosedRight: 0,
  leftBrowScaleX: 1,
  leftBrowY: 1,
  rightBrowScaleX: 1,
  rightBrowY: 0,
  glasses: 0,
  hand: 1,
};

const configOptions: EmojiFaceConfig = {
  mouthEllipse: 0,
  mouthLineScaleX: 1,
  mouthLineShiftX: 0.5,
  tongueX: 0.685,
  tongueY: 0,
  eyeOpenLeft: 0.8,
  eyeOpenRight: 0.8,
  eyeClosedLeft: 0,
  eyeClosedRight: 0,
  leftBrowScaleX: 0,
  leftBrowY: 0,
  rightBrowScaleX: 0,
  rightBrowY: 0,
  glasses: 1,
  hand: 0,
};

const configRecipes: EmojiFaceConfig = {
  mouthEllipse: 1,
  mouthLineScaleX: 1,
  mouthLineShiftX: 0.5,
  tongueX: 0.685,
  tongueY: 0,
  eyeOpenLeft: 1,
  eyeOpenRight: 1,
  eyeClosedLeft: 0,
  eyeClosedRight: 0,
  leftBrowScaleX: 0,
  leftBrowY: 0,
  rightBrowScaleX: 0,
  rightBrowY: 0,
  glasses: 0,
  hand: 0,
};

export const layerConfigs = [configReasoning, configHowToUse, configHowItWorks, configOptions, configRecipes];

export const deadConfig: EmojiFaceConfig = {
  mouthEllipse: 0,
  mouthLineScaleX: 1,
  mouthLineShiftX: 0.5,
  tongueX: 0.315,
  tongueY: 0.7,
  eyeOpenLeft: 0,
  eyeOpenRight: 0,
  eyeClosedLeft: 0.8,
  eyeClosedRight: 0.8,
  leftBrowScaleX: 0,
  leftBrowY: 0,
  rightBrowScaleX: 0,
  rightBrowY: 0,
  glasses: 0,
  hand: 0,
};

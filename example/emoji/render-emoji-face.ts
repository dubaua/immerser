import { renderMouthEllipse, renderMouthLine } from './render-mouth-ellipse';
import { renderTongue } from './render-tongue';
import { renderOpenEyeLeft, renderOpenEyeRight, renderClosedEyeLeft, renderClosedEyeRight } from './render-open-eye';
import { renderLeftBrow, renderRightBrow } from './render-left-brow';
import { renderGlasses } from './render-glasses';
import { renderHand } from './render-hand';
import { EmojiFaceConfig } from './config';
import { EmojiNodes } from './select-emoji-nodes';
import { easeInOutCubic } from './easing';

export function renderEmojiFace(config: EmojiFaceConfig, nodes: EmojiNodes): void {
  if (nodes.mouthClipPath && nodes.mouthShape) {
    renderMouthEllipse(config.mouthEllipse, nodes.mouthClipPath, nodes.mouthShape);
  }
  if (nodes.mouthLine) {
    renderMouthLine(config.mouthLineScaleX, config.mouthLineShiftX, nodes.mouthLine);
  }
  if (nodes.tongue) {
    const tongueX = easeInOutCubic(config.tongueX);
    const tongueY = easeInOutCubic(config.tongueY);
    renderTongue(tongueX, tongueY, nodes.tongue);
  }
  if (nodes.leftEyeOpen) {
    renderOpenEyeLeft(config.eyeOpenLeft, nodes.leftEyeOpen);
  }
  if (nodes.rightEyeOpen) {
    renderOpenEyeRight(config.eyeOpenRight, nodes.rightEyeOpen);
  }
  if (nodes.leftEyeClosed) {
    renderClosedEyeLeft(config.eyeClosedLeft, nodes.leftEyeClosed);
  }
  if (nodes.rightEyeClosed) {
    renderClosedEyeRight(config.eyeClosedRight, nodes.rightEyeClosed);
  }
  if (nodes.leftBrow) {
    renderLeftBrow(config.leftBrowScaleX, config.leftBrowY, nodes.leftBrow);
  }
  if (nodes.rightBrow) {
    renderRightBrow(config.rightBrowScaleX, config.rightBrowY, nodes.rightBrow);
  }
  if (nodes.glass) {
    const glassesValue = easeInOutCubic(config.glasses);
    renderGlasses(glassesValue, nodes.glass);
  }
  if (nodes.handInner && nodes.handOuter) {
    const handValue = easeInOutCubic(config.hand);
    renderHand(handValue, nodes.handInner, nodes.handOuter);
  }
}

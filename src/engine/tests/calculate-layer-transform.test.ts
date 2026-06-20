import { describe, expect, it } from 'vitest';
import calculateLayerTransform from '../calculate-layer-transform';
import createLayerCalculation from './layer-calculation.factory';

describe('calculateLayerTransform', () => {
  it('places the mask below the root before entering begins', () => {
    const layer = createLayerCalculation({
      beginEnter: 100,
      beginLeave: 300,
      bottom: 450,
      endEnter: 200,
      endLeave: 400,
      top: 150,
    });
    expect(calculateLayerTransform(layer, 99, 100)).toEqual({
      innerTranslateY: -100,
      maskTranslateY: 100,
    });
  });

  it('places the mask below the root at the beginning of entering', () => {
    const layer = createLayerCalculation({
      beginEnter: 100,
      beginLeave: 300,
      bottom: 450,
      endEnter: 200,
      endLeave: 400,
      top: 150,
    });
    expect(calculateLayerTransform(layer, 100, 100)).toEqual({
      innerTranslateY: -100,
      maskTranslateY: 100,
    });
  });

  it('calculates opposite transforms while entering', () => {
    const layer = createLayerCalculation({
      beginEnter: 100,
      beginLeave: 300,
      bottom: 450,
      endEnter: 200,
      endLeave: 400,
      top: 150,
    });
    expect(calculateLayerTransform(layer, 150, 100)).toEqual({
      innerTranslateY: -50,
      maskTranslateY: 50,
    });
  });

  it('resets transforms when entering ends', () => {
    const layer = createLayerCalculation({
      beginEnter: 100,
      beginLeave: 300,
      bottom: 450,
      endEnter: 200,
      endLeave: 400,
      top: 150,
    });
    expect(calculateLayerTransform(layer, 200, 100)).toEqual({
      innerTranslateY: 0,
      maskTranslateY: 0,
    });
  });

  it('keeps transforms at zero while the layer covers the root', () => {
    const layer = createLayerCalculation({
      beginEnter: 100,
      beginLeave: 300,
      bottom: 450,
      endEnter: 200,
      endLeave: 400,
      top: 150,
    });
    expect(calculateLayerTransform(layer, 250, 100)).toEqual({
      innerTranslateY: 0,
      maskTranslateY: 0,
    });
  });

  it('keeps transforms at zero when leaving begins', () => {
    const layer = createLayerCalculation({
      beginEnter: 100,
      beginLeave: 300,
      bottom: 450,
      endEnter: 200,
      endLeave: 400,
      top: 150,
    });
    expect(calculateLayerTransform(layer, 300, 100)).toEqual({
      innerTranslateY: 0,
      maskTranslateY: 0,
    });
  });

  it('calculates opposite transforms while leaving', () => {
    const layer = createLayerCalculation({
      beginEnter: 100,
      beginLeave: 300,
      bottom: 450,
      endEnter: 200,
      endLeave: 400,
      top: 150,
    });
    expect(calculateLayerTransform(layer, 350, 100)).toEqual({
      innerTranslateY: 50,
      maskTranslateY: -50,
    });
  });

  it('places the mask above the root when leaving ends', () => {
    const layer = createLayerCalculation({
      beginEnter: 100,
      beginLeave: 300,
      bottom: 450,
      endEnter: 200,
      endLeave: 400,
      top: 150,
    });
    expect(calculateLayerTransform(layer, 400, 100)).toEqual({
      innerTranslateY: 100,
      maskTranslateY: -100,
    });
  });

  it('keeps the mask above the root after leaving ends', () => {
    const layer = createLayerCalculation({
      beginEnter: 100,
      beginLeave: 300,
      bottom: 450,
      endEnter: 200,
      endLeave: 400,
      top: 150,
    });
    expect(calculateLayerTransform(layer, 401, 100)).toEqual({
      innerTranslateY: 100,
      maskTranslateY: -100,
    });
  });

  it('preserves opposite transforms when root height is zero', () => {
    const layer = createLayerCalculation({
      beginEnter: 100,
      beginLeave: 300,
      bottom: 450,
      endEnter: 200,
      endLeave: 400,
      top: 150,
    });
    expect(calculateLayerTransform(layer, 99, 0)).toEqual({
      innerTranslateY: 0,
      maskTranslateY: 0,
    });
  });
});

import { describe, expect, it } from 'vitest';
import calculateLayerProgress from '../calculate-layer-progress';

describe('calculateLayerProgress', () => {
  it('returns zero when the layer is above the viewport', () => {
    expect(calculateLayerProgress({ top: 0, bottom: 100 }, 200, 100)).toBe(0);
  });

  it('returns zero when the layer is below the viewport', () => {
    expect(calculateLayerProgress({ top: 300, bottom: 400 }, 100, 100)).toBe(0);
  });

  it('returns zero when the layer only touches the viewport top edge', () => {
    expect(calculateLayerProgress({ top: 0, bottom: 100 }, 100, 100)).toBe(0);
  });

  it('returns zero when the layer only touches the viewport bottom edge', () => {
    expect(calculateLayerProgress({ top: 200, bottom: 300 }, 100, 100)).toBe(0);
  });

  it('calculates progress while a layer enters the viewport', () => {
    expect(calculateLayerProgress({ top: 150, bottom: 250 }, 100, 100)).toBe(0.5);
  });

  it('calculates progress while a layer leaves the viewport', () => {
    expect(calculateLayerProgress({ top: 50, bottom: 150 }, 100, 100)).toBe(0.5);
  });

  it('returns one when a short layer is fully inside the viewport', () => {
    expect(calculateLayerProgress({ top: 125, bottom: 175 }, 100, 100)).toBe(1);
  });

  it('returns one when the viewport is fully inside a tall layer', () => {
    expect(calculateLayerProgress({ top: 0, bottom: 300 }, 100, 100)).toBe(1);
  });

  it('uses layer height as the progress base when the layer is shorter than the viewport', () => {
    expect(calculateLayerProgress({ top: 75, bottom: 175 }, 100, 200)).toBe(0.75);
  });

  it('uses viewport height as the progress base when the layer is taller than the viewport', () => {
    expect(calculateLayerProgress({ top: 50, bottom: 250 }, 200, 100)).toBe(0.5);
  });

  it('calculates progress from fractional layer and viewport metrics', () => {
    expect(calculateLayerProgress({ top: 100.25, bottom: 300.75 }, 200.5, 100.25)).toBeCloseTo(1);
  });

  it('returns zero for a zero-height layer', () => {
    expect(calculateLayerProgress({ top: 100, bottom: 100 }, 50, 100)).toBe(0);
  });

  it('returns zero for a zero-height viewport', () => {
    expect(calculateLayerProgress({ top: 100, bottom: 200 }, 100, 0)).toBe(0);
  });

  it('returns zero when layer bottom is above its top', () => {
    expect(calculateLayerProgress({ top: 200, bottom: 100 }, 100, 100)).toBe(0);
  });
});

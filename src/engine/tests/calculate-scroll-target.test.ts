import { describe, expect, it } from 'vitest';
import calculateScrollTarget from '../calculate-scroll-target';

describe('calculateScrollTarget', () => {
  it('returns the layer top when it is the nearest edge within the threshold', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 500, top: 100 },
        scrollAdjustThreshold: 20,
        scrollY: 110,
        viewportHeight: 200,
      }),
    ).toBe(100);
  });

  it('returns the bottom-aligned position when the layer bottom is the nearest edge within the threshold', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 500, top: 100 },
        scrollAdjustThreshold: 20,
        scrollY: 290,
        viewportHeight: 200,
      }),
    ).toBe(300);
  });

  it('prefers the layer top when both edge distances are equal', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 400, top: 100 },
        scrollAdjustThreshold: 50,
        scrollY: 150,
        viewportHeight: 200,
      }),
    ).toBe(100);
  });

  it('includes the adjustment threshold boundary', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 500, top: 100 },
        scrollAdjustThreshold: 20,
        scrollY: 120,
        viewportHeight: 200,
      }),
    ).toBe(100);
  });

  it('returns a fractional layer top when it is within the threshold', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 500.75, top: 100.25 },
        scrollAdjustThreshold: 10,
        scrollY: 110.125,
        viewportHeight: 200,
      }),
    ).toBeCloseTo(100.25);
  });

  it('returns the bottom-aligned position when both edges are within the threshold and bottom is closer', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 250, top: 90 },
        scrollAdjustThreshold: 40,
        scrollY: 60,
        viewportHeight: 200,
      }),
    ).toBe(50);
  });

  it('returns null when the nearest edge is outside the threshold', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 500, top: 100 },
        scrollAdjustThreshold: 20,
        scrollY: 150,
        viewportHeight: 200,
      }),
    ).toBeNull();
  });

  it('returns null when scroll is already aligned with the layer top', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 500, top: 100 },
        scrollAdjustThreshold: 20,
        scrollY: 100,
        viewportHeight: 200,
      }),
    ).toBeNull();
  });

  it('returns null when scroll is already aligned with the layer bottom', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 500, top: 100 },
        scrollAdjustThreshold: 20,
        scrollY: 300,
        viewportHeight: 200,
      }),
    ).toBeNull();
  });

  it('returns null when the adjustment threshold is zero', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 500, top: 100 },
        scrollAdjustThreshold: 0,
        scrollY: 110,
        viewportHeight: 200,
      }),
    ).toBeNull();
  });

  it('returns the raw bottom-aligned target even when it is negative', () => {
    expect(
      calculateScrollTarget({
        activeLayer: { bottom: 100, top: 90 },
        scrollAdjustThreshold: 100,
        scrollY: 0,
        viewportHeight: 150,
      }),
    ).toBe(-50);
  });
});

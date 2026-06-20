import { describe, expect, it } from 'vitest';
import calculateLayerStateArray from '../calculate-layer-state-array';
import createLayoutMetrics from './layout-metrics.factory';

describe('calculateLayerStateArray', () => {
  it('returns an empty array when the layout has no layers', () => {
    expect(
      calculateLayerStateArray(
        createLayoutMetrics({
          layers: [],
          rootHeight: 100,
          rootTop: 50,
        }),
      ),
    ).toEqual([]);
  });

  it('derives all transition boundaries from the root and layer metrics', () => {
    expect(
      calculateLayerStateArray(
        createLayoutMetrics({
          layers: [{ bottom: 650, top: 250 }],
          rootHeight: 100,
          rootTop: 50,
        }),
      ),
    ).toEqual([
      {
        beginEnter: 100,
        beginLeave: 500,
        bottom: 650,
        endEnter: 200,
        endLeave: 600,
        top: 250,
      },
    ]);
  });

  it('preserves layer order when deriving transition boundaries', () => {
    const result = calculateLayerStateArray(
      createLayoutMetrics({
        layers: [
          { bottom: 300, top: 100 },
          { bottom: 700, top: 300 },
        ],
        rootHeight: 50,
        rootTop: 25,
      }),
    );

    expect(result).toEqual([
      {
        beginEnter: 25,
        beginLeave: 225,
        bottom: 300,
        endEnter: 75,
        endLeave: 275,
        top: 100,
      },
      {
        beginEnter: 225,
        beginLeave: 625,
        bottom: 700,
        endEnter: 275,
        endLeave: 675,
        top: 300,
      },
    ]);
  });

  it('derives transition boundaries from fractional DOM metrics without rounding', () => {
    const result = calculateLayerStateArray(
      createLayoutMetrics({
        layers: [{ bottom: 650.125, top: 250.75 }],
        rootHeight: 100.5,
        rootTop: 50.25,
      }),
    )[0];

    expect(result.beginEnter).toBeCloseTo(100);
    expect(result.beginLeave).toBeCloseTo(499.375);
    expect(result.bottom).toBeCloseTo(650.125);
    expect(result.endEnter).toBeCloseTo(200.5);
    expect(result.endLeave).toBeCloseTo(599.875);
    expect(result.top).toBeCloseTo(250.75);
  });

  it('derives negative transition boundaries when a layer starts above the root', () => {
    expect(
      calculateLayerStateArray(
        createLayoutMetrics({
          layers: [{ bottom: 350, top: 250 }],
          rootHeight: 100,
          rootTop: 300,
        }),
      ),
    ).toEqual([
      {
        beginEnter: -150,
        beginLeave: -50,
        bottom: 350,
        endEnter: -50,
        endLeave: 50,
        top: 250,
      },
    ]);
  });
});

// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import getLastScrollPosition from '../get-last-scroll-position';
import mockScrollMetrics, { restoreScrollMetrics } from './mock-scroll-metrics';

describe('getLastScrollPosition', () => {
  afterEach(restoreScrollMetrics);

  it('returns window scroll coordinates within document bounds', () => {
    mockScrollMetrics({ documentHeight: 2000, documentWidth: 1200, scrollX: 150, scrollY: 900 });

    expect(getLastScrollPosition()).toEqual({ x: 150, y: 900 });
  });

  it('falls back to document scroll coordinates when window coordinates are zero', () => {
    mockScrollMetrics({
      documentHeight: 2000,
      documentScrollLeft: 75,
      documentScrollTop: 450,
      documentWidth: 1200,
      scrollX: 0,
      scrollY: 0,
    });

    expect(getLastScrollPosition()).toEqual({ x: 75, y: 450 });
  });

  it('clamps negative scroll coordinates to zero', () => {
    mockScrollMetrics({ documentHeight: 2000, documentWidth: 1200, scrollX: -20, scrollY: -30 });

    expect(getLastScrollPosition()).toEqual({ x: 0, y: 0 });
  });

  it('clamps scroll coordinates to document bounds', () => {
    mockScrollMetrics({ documentHeight: 2000, documentWidth: 1200, scrollX: 1300, scrollY: 2100 });

    expect(getLastScrollPosition()).toEqual({ x: 1200, y: 2000 });
  });

  it('preserves fractional scroll coordinates', () => {
    mockScrollMetrics({ documentHeight: 2000.75, documentWidth: 1200.5, scrollX: 150.25, scrollY: 900.5 });

    const result = getLastScrollPosition();

    expect(result.x).toBeCloseTo(150.25);
    expect(result.y).toBeCloseTo(900.5);
  });
});

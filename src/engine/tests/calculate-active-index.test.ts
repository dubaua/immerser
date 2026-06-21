import { describe, expect, it } from 'vitest';
import calculateActiveIndex from '../calculate-active-index';
import createLayerCalculation from './layer-calculation.factory';
import type { ILayerCalculation } from '../types';

const adjacentLayerCalculations = [
  createLayerCalculation({ bottom: 300, top: 100 }),
  createLayerCalculation({ bottom: 500, top: 300 }),
] satisfies readonly ILayerCalculation[];

const sectionCalculations = [
  createLayerCalculation({ bottom: 1040.75, top: 240.5 }),
  createLayerCalculation({ bottom: 2450.25, top: 1040.75 }),
  createLayerCalculation({ bottom: 3180.5, top: 2450.25 }),
] satisfies readonly ILayerCalculation[];

describe('calculateActiveIndex', () => {
  describe('pager point', () => {
    it('selects the layer containing the pager point', () => {
      expect(calculateActiveIndex(adjacentLayerCalculations, 100, 100, 0.5, -1)).toBe(0);
    });

    it('uses the viewport bottom as the pager point when threshold is zero', () => {
      expect(calculateActiveIndex(adjacentLayerCalculations, 200, 100, 0, -1)).toBe(1);
    });

    it('uses the viewport top as the pager point when threshold is one', () => {
      expect(calculateActiveIndex(adjacentLayerCalculations, 300, 100, 1, -1)).toBe(1);
    });
  });

  describe('layer boundaries', () => {
    it('includes the layer top boundary', () => {
      expect(calculateActiveIndex(adjacentLayerCalculations, 50, 100, 0.5, -1)).toBe(0);
    });

    it('excludes the layer bottom boundary', () => {
      expect(calculateActiveIndex([adjacentLayerCalculations[0]], 250, 100, 0.5, -1)).toBe(-1);
    });

    it('selects the next adjacent layer at the previous layer bottom boundary', () => {
      expect(calculateActiveIndex(adjacentLayerCalculations, 250, 100, 0.5, -1)).toBe(1);
    });
  });

  describe('fallback behavior', () => {
    it('preserves the previous index when the pager point is before every layer', () => {
      expect(calculateActiveIndex(adjacentLayerCalculations, -100, 100, 0.5, 1)).toBe(1);
    });

    it('preserves the previous index when the pager point is after every layer', () => {
      expect(calculateActiveIndex(adjacentLayerCalculations, 500, 100, 0.5, 0)).toBe(0);
    });

    it('preserves the previous index when the pager point is in a layer gap', () => {
      const layersWithGap = [adjacentLayerCalculations[0], createLayerCalculation({ bottom: 500, top: 400 })];
      expect(calculateActiveIndex(layersWithGap, 300, 100, 0.5, 0)).toBe(0);
    });

    it('preserves the previous index when there are no layers', () => {
      expect(calculateActiveIndex([], 100, 100, 0.5, 2)).toBe(2);
    });
  });

  describe('overlapping layers', () => {
    it('selects the last matching layer', () => {
      const overlappingLayers = [
        adjacentLayerCalculations[0],
        createLayerCalculation({ bottom: 500, top: 200 }),
      ];
      expect(calculateActiveIndex(overlappingLayers, 200, 100, 0.5, -1)).toBe(1);
    });
  });

  describe('usage scenarios', () => {
    it('selects the first section when the pager point enters its visible range', () => {
      expect(calculateActiveIndex(sectionCalculations, 120.25, 768, 0.5, -1)).toBe(0);
    });

    it('keeps the previous active section while the pager point is above all sections', () => {
      expect(calculateActiveIndex(sectionCalculations, -700, 768, 0.5, 1)).toBe(1);
    });

    it('switches to the next section exactly at an adjacent boundary', () => {
      expect(calculateActiveIndex(sectionCalculations, 455.75, 900, 0.35, 0)).toBe(1);
    });

    it('selects the first section before its bottom boundary', () => {
      expect(calculateActiveIndex(sectionCalculations, 500, 900, 0.5, -1)).toBe(0);
    });

    it('selects a section taller than the viewport while its middle crosses the pager point', () => {
      expect(calculateActiveIndex(sectionCalculations, 1350, 900, 0.5, 0)).toBe(1);
    });

    it('selects the shorter final section after leaving the tall section', () => {
      expect(calculateActiveIndex(sectionCalculations, 2400, 768, 0.5, 1)).toBe(2);
    });

    it('uses fractional values without rounding the pager point up to the next section', () => {
      expect(calculateActiveIndex(sectionCalculations, 541.3775, 768.25, 0.35, 1)).toBe(0);
    });

    it('uses a custom pager threshold to switch to the next section', () => {
      expect(calculateActiveIndex(sectionCalculations, 500, 800, 0.25, 0)).toBe(1);
    });

    it('does not switch sections while the pager point crosses a layout gap', () => {
      const gappedSectionCalculations = [
        sectionCalculations[0],
        createLayerCalculation({ bottom: 2450.25, top: 1240.75 }),
      ];
      expect(calculateActiveIndex(gappedSectionCalculations, 700, 768, 0.5, 0)).toBe(0);
    });

    it('keeps the final section active after the pager point leaves all sections', () => {
      expect(calculateActiveIndex(sectionCalculations, 3400, 1080, 0.5, 2)).toBe(2);
    });

    it('selects a section with a negative top when the pager point is inside it', () => {
      const negativeTopSectionCalculations = [createLayerCalculation({ bottom: 200, top: -300 })];
      expect(calculateActiveIndex(negativeTopSectionCalculations, -500, 900, 0.5, -1)).toBe(0);
    });
  });
});

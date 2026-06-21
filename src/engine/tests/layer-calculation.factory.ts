import type { ILayerCalculation } from '../types';

type Props = Partial<ILayerCalculation> & {
  bottom: number;
  top: number;
};

export default function createLayerCalculation({
  beginEnter = 0,
  beginLeave = 0,
  bottom,
  endEnter = 0,
  endLeave = 0,
  top,
}: Props): ILayerCalculation {
  return {
    beginEnter,
    beginLeave,
    bottom,
    endEnter,
    endLeave,
    top,
  };
}

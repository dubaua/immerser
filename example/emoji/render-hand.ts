import { easeCircleIn } from 'd3-ease';
const handOffsetFactor = 12;

export function renderHand(value: number, innerNode: SVGGraphicsElement, outerNode: SVGGElement): void {
  const translateX = -handOffsetFactor * (1 - easeCircleIn(value));
  const translateY = handOffsetFactor * (1 - easeCircleIn(value));
  outerNode.setAttribute('transform', `translate(${translateX} ${translateY})`);
  innerNode.setAttribute('opacity', value.toString());
}

import { easeCircleIn } from 'd3-ease';

const glassesOffsetX = 550;
const glassesOffsetY = -100;
const glassesRotation = 30;

export function renderGlasses(value: number, node: SVGGElement): void {
  const translateX = glassesOffsetX * (1 - easeCircleIn(value));
  const translateY = glassesOffsetY * (1 - easeCircleIn(value));
  const rotate = glassesRotation * (1 - easeCircleIn(value));
  node.setAttribute('transform', `translate(${translateX} ${translateY}) rotate(${rotate})`);
}

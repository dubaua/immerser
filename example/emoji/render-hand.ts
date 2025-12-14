const handOffsetFactor = 0.12;

export function renderHand(value: number, innerNode: SVGGraphicsElement, outerNode: SVGGElement): void {
  const bbox = innerNode.getBBox();
  const translateX = -(bbox.width || 0) * handOffsetFactor * (1 - value);
  const translateY = (bbox.height || 0) * handOffsetFactor * (1 - value);
  outerNode.setAttribute('transform', `translate(${translateX} ${translateY})`);
  innerNode.setAttribute('opacity', value.toString());
}

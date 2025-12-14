const glassesOffsetX = 250;

export function renderGlasses(value: number, node: SVGGElement): void {
  const translateX = glassesOffsetX * (1 - value);
  node.setAttribute('transform', `translate(${translateX} 0)`);
}

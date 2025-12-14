const tongueMaxShiftX = 102;
const tongueMaxShiftY = 72;

export function renderTongue(valueX: number, valueY: number, node: SVGPathElement): void {
  const shiftX = tongueMaxShiftX * valueX;
  const shiftY = tongueMaxShiftY * valueY;
  node.setAttribute('transform', `translate(${shiftX} ${shiftY})`);
}

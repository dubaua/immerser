const mouthEllipseMaxRy = 75;
const mouthLineMaxShiftX = 50; // px

export function renderMouthEllipse(
  value: number,
  clipNode: SVGEllipseElement,
  shapeNode: SVGEllipseElement,
): void {
  const ry = (mouthEllipseMaxRy * value).toString();
  clipNode.setAttribute('ry', ry);
  shapeNode.setAttribute('ry', ry);
}

export function renderMouthLine(scaleX: number, shiftX: number, node: SVGPathElement): void {
  const translateX = mouthLineMaxShiftX * (shiftX - 0.5) * 2;
  node.setAttribute('transform', `translate(${translateX} 0) scale(${scaleX} 1)`);
}

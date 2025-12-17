const browMaxTranslateY = 8;

function renderBrow(scaleX: number, valueY: number, node: SVGPathElement): void {
  const translateY = -browMaxTranslateY * valueY;
  node.setAttribute('transform', `scale(${scaleX} 1) translate(0 ${translateY})`);
}

export function renderLeftBrow(scaleX: number, translateY: number, node: SVGPathElement): void {
  renderBrow(scaleX, translateY, node);
}

export function renderRightBrow(scaleX: number, translateY: number, node: SVGPathElement): void {
  renderBrow(scaleX, translateY, node);
}

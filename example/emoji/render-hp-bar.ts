export function renderHpBar(
  currentHp: number,
  maxHp: number,
  opacity: number,
  outline: SVGRectElement,
  fill: SVGRectElement,
): void {
  const baseWidth = 100;
  const ratio = Math.max(0, Math.min(1, currentHp / maxHp));
  const nextWidth = baseWidth * ratio;

  fill.setAttribute('width', nextWidth.toString());

  const { r, g, b } = colorForRatio(ratio);
  fill.setAttribute('fill', `rgb(${r}, ${g}, ${b})`);
  if (outline.parentElement) {
    outline.parentElement.style.opacity = opacity.toString();
  }
}

function colorForRatio(ratio: number): { r: number; g: number; b: number } {
  const clamp = Math.max(0, Math.min(1, ratio));
  const green = { r: 0, g: 255, b: 0 };
  const yellow = { r: 255, g: 204, b: 0 };
  const red = { r: 255, g: 51, b: 0 };

  if (clamp <= 0.25) {
    return red;
  }
  if (clamp <= 0.5) {
    const t = (0.5 - clamp) / 0.25; // yellow -> red
    return lerpColor(yellow, red, t);
  }
  if (clamp < 0.75) {
    const t = (0.75 - clamp) / 0.25; // green -> yellow
    return lerpColor(green, yellow, t);
  }
  return green;
}

function lerpColor(from: { r: number; g: number; b: number }, to: { r: number; g: number; b: number }, t: number) {
  return {
    r: Math.round(from.r + (to.r - from.r) * t),
    g: Math.round(from.g + (to.g - from.g) * t),
    b: Math.round(from.b + (to.b - from.b) * t),
  };
}

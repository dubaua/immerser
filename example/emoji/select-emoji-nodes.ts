export type EmojiNodes = {
  face: HTMLElement | null;
  mouthClipPath: SVGEllipseElement | null;
  mouthShape: SVGEllipseElement | null;
  mouthLine: SVGPathElement | null;
  tongue: SVGPathElement | null;
  leftEyeClosed: SVGPathElement | null;
  rightEyeClosed: SVGPathElement | null;
  leftEyeOpen: SVGCircleElement | null;
  rightEyeOpen: SVGCircleElement | null;
  leftBrow: SVGPathElement | null;
  rightBrow: SVGPathElement | null;
  glass: SVGGElement | null;
  hpBarOutline: SVGRectElement | null;
  hpBarFill: SVGRectElement | null;
  handInner: SVGGraphicsElement | null;
  handOuter: SVGGElement | null;
  rotator: SVGGElement | null;
};

export function selectEmojiNodes(root: HTMLElement): EmojiNodes {
  return {
    face: root,
    mouthClipPath: root.querySelector<SVGEllipseElement>('[data-mouth-clip-path]'),
    mouthShape: root.querySelector<SVGEllipseElement>('[data-mouth-shape]'),
    mouthLine: root.querySelector<SVGPathElement>('[data-mouth-line]'),
    tongue: root.querySelector<SVGPathElement>('[data-tongue]'),
    leftEyeClosed: root.querySelector<SVGPathElement>('[data-left-eye-closed]'),
    rightEyeClosed: root.querySelector<SVGPathElement>('[data-right-eye-closed]'),
    leftEyeOpen: root.querySelector<SVGCircleElement>('[data-left-eye-open]'),
    rightEyeOpen: root.querySelector<SVGCircleElement>('[data-right-eye-open]'),
    leftBrow: root.querySelector<SVGPathElement>('[data-left-brow]'),
    rightBrow: root.querySelector<SVGPathElement>('[data-right-brow]'),
    glass: root.querySelector<SVGGElement>('[data-glass]'),
    hpBarOutline: root.querySelector<SVGRectElement>('[data-emoji-hp-bar-outline]'),
    hpBarFill: root.querySelector<SVGRectElement>('[data-emoji-hp-bar-fill]'),
    handInner: root.querySelector<SVGGraphicsElement>('[data-emoji-hand]'),
    handOuter: root.querySelector<SVGGElement>('[data-emoji-hand-outer]'),
    rotator: root.querySelector<SVGGElement>('[data-emoji-rotator]'),
  };
}

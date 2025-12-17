import { buildCrossPath, Point } from './paths';

const eyeMaxRadius = 12;

const closedEyeLeftBase: Point[] = [
  { x: 79, y: 74 },
  { x: 105, y: 100 },
  { x: 105, y: 74 },
  { x: 79, y: 100 },
];
const closedEyeLeftCenter: Point = { x: 92, y: 87 };

const closedEyeRightBase: Point[] = [
  { x: 145, y: 74 },
  { x: 171, y: 100 },
  { x: 171, y: 74 },
  { x: 145, y: 100 },
];
const closedEyeRightCenter: Point = { x: 158, y: 87 };

export function renderOpenEye(value: number, node: SVGCircleElement): void {
  const radius = eyeMaxRadius * value;
  node.setAttribute('r', radius.toString());
}

function renderClosedEye(value: number, points: Point[], center: Point, node: SVGPathElement): void {
  const d = buildCrossPath(points, center, value);
  node.setAttribute('d', d);
}

export function renderClosedEyeLeft(value: number, node: SVGPathElement): void {
  renderClosedEye(value, closedEyeLeftBase, closedEyeLeftCenter, node);
}

export function renderClosedEyeRight(value: number, node: SVGPathElement): void {
  renderClosedEye(value, closedEyeRightBase, closedEyeRightCenter, node);
}

export function renderOpenEyeLeft(value: number, node: SVGCircleElement): void {
  renderOpenEye(value, node);
}

export function renderOpenEyeRight(value: number, node: SVGCircleElement): void {
  renderOpenEye(value, node);
}

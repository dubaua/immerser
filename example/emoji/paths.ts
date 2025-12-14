export type Point = { x: number; y: number };

export function buildCrossPath(points: ReadonlyArray<Point>, center: Point, factor: number): string {
  const scaled = points.map(({ x, y }) => ({
    x: center.x + (x - center.x) * factor,
    y: center.y + (y - center.y) * factor,
  }));

  return `M${scaled[0].x} ${scaled[0].y}L${scaled[1].x} ${scaled[1].y}M${scaled[2].x} ${scaled[2].y}L${scaled[3].x} ${scaled[3].y}`;
}

export function buildLinePath(points: ReadonlyArray<Point>, center: Point, factor: number): string {
  const scaled = points.map(({ x, y }) => ({
    x: center.x + (x - center.x) * factor,
    y: center.y + (y - center.y) * factor,
  }));

  return `M${scaled[0].x} ${scaled[0].y}H${scaled[1].x}`;
}

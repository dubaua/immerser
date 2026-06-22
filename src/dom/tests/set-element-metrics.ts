export default function setElementMetrics(
  element: HTMLElement,
  { height, top }: { height: number; top: number },
): void {
  Object.defineProperties(element, {
    offsetHeight: { configurable: true, value: height },
    offsetTop: { configurable: true, value: top },
  });
}

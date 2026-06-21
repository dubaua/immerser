function limit(number: number, min: number, max: number): number {
  return Math.max(Math.min(number, max), min);
}

export default function getLastScrollPosition(): { x: number; y: number } {
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  // limit scroll position between 0 and document height in case of iOS overflow scroll
  return {
    x: limit(scrollX, 0, document.documentElement.offsetWidth),
    y: limit(scrollY, 0, document.documentElement.offsetHeight),
  };
}

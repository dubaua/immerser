const windowScrollXDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollX');
const windowScrollYDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY');
const documentOffsetHeightDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, 'offsetHeight');
const documentOffsetWidthDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, 'offsetWidth');
const documentScrollLeftDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, 'scrollLeft');
const documentScrollTopDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, 'scrollTop');

function restoreProperty(target: object, property: PropertyKey, descriptor?: PropertyDescriptor): void {
  if (descriptor) {
    Object.defineProperty(target, property, descriptor);
  } else {
    Reflect.deleteProperty(target, property);
  }
}

export default function mockScrollMetrics({
  documentHeight,
  documentScrollLeft = 0,
  documentScrollTop = 0,
  documentWidth,
  scrollX,
  scrollY,
}: {
  documentHeight: number;
  documentScrollLeft?: number;
  documentScrollTop?: number;
  documentWidth: number;
  scrollX: number;
  scrollY: number;
}): void {
  Object.defineProperties(window, {
    scrollX: { configurable: true, value: scrollX },
    scrollY: { configurable: true, value: scrollY },
  });
  Object.defineProperties(document.documentElement, {
    offsetHeight: { configurable: true, value: documentHeight },
    offsetWidth: { configurable: true, value: documentWidth },
    scrollLeft: { configurable: true, value: documentScrollLeft },
    scrollTop: { configurable: true, value: documentScrollTop },
  });
}

export function restoreScrollMetrics(): void {
  restoreProperty(window, 'scrollX', windowScrollXDescriptor);
  restoreProperty(window, 'scrollY', windowScrollYDescriptor);
  restoreProperty(document.documentElement, 'offsetHeight', documentOffsetHeightDescriptor);
  restoreProperty(document.documentElement, 'offsetWidth', documentOffsetWidthDescriptor);
  restoreProperty(document.documentElement, 'scrollLeft', documentScrollLeftDescriptor);
  restoreProperty(document.documentElement, 'scrollTop', documentScrollTopDescriptor);
}

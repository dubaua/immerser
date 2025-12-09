import { MESSAGE_PREFIX } from './options';

export function bindStyles(node: HTMLElement, styles: { [key: string]: string }): void {
  for (const rule in styles) {
    (node.style as any)[rule] = styles[rule];
  }
}

export function forEachNode<T extends Element>(
  nodeList: ArrayLike<T>,
  callback: (node: T, index: number, nodeList: ArrayLike<T>) => void,
): void {
  for (let index = 0; index < nodeList.length; index++) {
    const node = nodeList[index];
    callback(node, index, nodeList);
  }
}

export function getNodeArray<T extends Element = HTMLElement>({
  selector,
  parent = document,
}: {
  selector: string;
  parent?: Document | Element | null;
}): T[] {
  if (!parent) {
    return [];
  }
  const nodeList = parent.querySelectorAll<T>(selector);
  return Array.from(nodeList);
}

export function showMessageWithDocumentationLink({
  message,
  error,
  isWarning = false,
  docsHash = '',
}: {
  message: string;
  error?: unknown;
  isWarning?: boolean;
  docsHash?: string;
}): void {
  const resultMessage = `${MESSAGE_PREFIX} ${message} \nCheck out documentation https://github.com/dubaua/immerser${docsHash}`;
  if (isWarning) {
    if (error !== undefined) {
      console.warn(resultMessage, error);
    } else {
      console.warn(resultMessage);
    }
  } else {
    throw new Error(resultMessage, { cause: error });
  }
}

export function isEmpty(obj?: Record<string, any> | null): boolean {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function limit(number: number, min: number, max: number): number {
  return Math.max(Math.min(number, max), min);
}

export function getLastScrollPosition(): { x: number; y: number } {
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  // limit scroll position between 0 and document height in case of iOS overflow scroll
  return {
    x: limit(scrollX, 0, document.documentElement.offsetWidth),
    y: limit(scrollY, 0, document.documentElement.offsetHeight),
  };
}

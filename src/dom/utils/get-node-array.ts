export default function getNodeArray<T extends Element = HTMLElement>({
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

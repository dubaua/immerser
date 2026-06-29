export default function queryElementArray<T extends Element = HTMLElement>({
  selector,
  parent = document,
}: {
  selector: string;
  parent?: ParentNode | null;
}): T[] {
  if (!parent) {
    return [];
  }
  const nodeList = parent.querySelectorAll<T>(selector);
  return Array.from(nodeList);
}

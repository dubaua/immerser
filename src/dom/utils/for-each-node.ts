export default function forEachNode<T extends Element>(
  nodeList: ArrayLike<T>,
  callback: (node: T, index: number, nodeList: ArrayLike<T>) => void,
): void {
  for (let index = 0; index < nodeList.length; index++) {
    const node = nodeList[index];
    callback(node, index, nodeList);
  }
}

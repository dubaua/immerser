export default function bindStyles(node: HTMLElement, styles: { [key: string]: string }): void {
  for (const rule in styles) {
    (node.style as any)[rule] = styles[rule];
  }
}

export default function assignInlineStyles(
  node: HTMLElement,
  styles: Partial<Record<keyof CSSStyleDeclaration, string>>,
): void {
  for (const rule in styles) {
    Reflect.set(node.style, rule, styles[rule]);
  }
}

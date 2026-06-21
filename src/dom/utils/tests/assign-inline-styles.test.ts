// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import assignInlineStyles from '../assign-inline-styles';

describe('assignInlineStyles', () => {
  it('applies every provided style to the element', () => {
    const node = document.createElement('div');

    assignInlineStyles(node, {
      pointerEvents: 'none',
      position: 'absolute',
      top: '10px',
    });

    expect(node.style.pointerEvents).toBe('none');
    expect(node.style.position).toBe('absolute');
    expect(node.style.top).toBe('10px');
  });

  it('overwrites an existing inline style', () => {
    const node = document.createElement('div');
    node.style.position = 'relative';

    assignInlineStyles(node, { position: 'fixed' });

    expect(node.style.position).toBe('fixed');
  });

  it('leaves existing styles unchanged when no styles are provided', () => {
    const node = document.createElement('div');
    node.style.position = 'relative';

    assignInlineStyles(node, {});

    expect(node.style.position).toBe('relative');
  });
});

// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import forEachNode from '../for-each-node';

describe('forEachNode', () => {
  it('calls the callback for every node in collection order', () => {
    const firstNode = document.createElement('div');
    const secondNode = document.createElement('span');
    const nodeList = [firstNode, secondNode];
    const callback = vi.fn();

    forEachNode(nodeList, callback);

    expect(callback.mock.calls).toEqual([
      [firstNode, 0, nodeList],
      [secondNode, 1, nodeList],
    ]);
  });

  it('does not call the callback for an empty collection', () => {
    const callback = vi.fn();

    forEachNode([], callback);

    expect(callback).not.toHaveBeenCalled();
  });

  it('iterates an actual DOM NodeList', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<span></span><span></span><span></span>';
    const nodeList = parent.querySelectorAll('span');
    const callback = vi.fn();

    forEachNode(nodeList, callback);

    expect(callback.mock.calls).toEqual([
      [nodeList[0], 0, nodeList],
      [nodeList[1], 1, nodeList],
      [nodeList[2], 2, nodeList],
    ]);
  });
});

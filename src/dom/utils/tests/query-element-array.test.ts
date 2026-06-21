// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import queryElementArray from '../query-element-array.ts';

describe('queryElementArray', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns matching nodes from the document by default', () => {
    document.body.innerHTML = '<div data-node></div><span data-node></span><p></p>';

    const result = queryElementArray({ selector: '[data-node]' });

    expect(result).toEqual([document.body.children[0], document.body.children[1]]);
  });

  it('limits the query to the provided parent', () => {
    document.body.innerHTML = `
      <section><div data-node></div></section>
      <section><div data-node></div></section>
    `;
    const parent = document.querySelector('section') as HTMLElement;

    const result = queryElementArray({ selector: '[data-node]', parent });

    expect(result).toEqual([parent.firstElementChild]);
  });

  it('returns an empty array when parent is null', () => {
    expect(queryElementArray({ selector: '[data-node]', parent: null })).toEqual([]);
  });

  it('returns an empty array when no nodes match', () => {
    document.body.innerHTML = '<div></div>';

    expect(queryElementArray({ selector: '[data-node]' })).toEqual([]);
  });

  it('returns a new array on each query', () => {
    document.body.innerHTML = '<div data-node></div>';

    const firstResult = queryElementArray({ selector: '[data-node]' });
    const secondResult = queryElementArray({ selector: '[data-node]' });

    expect(firstResult).not.toBe(secondResult);
  });
});

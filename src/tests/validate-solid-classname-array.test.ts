import { describe, expect, it } from 'vitest';
import validateSolidClassnameArray from '../validate-solid-classname-array';

describe('validateSolidClassnameArray', () => {
  it('accepts solid classname maps', () => {
    const value = [{ logo: 'logo-first' }, { logo: 'logo-second' }];

    expect(validateSolidClassnameArray(value)).toEqual({ isValid: true, value });
  });

  it('accepts an array matching the expected layer count', () => {
    const value = [{ logo: 'logo-first' }, { logo: 'logo-second' }];

    expect(validateSolidClassnameArray(value, 2)).toEqual({ isValid: true, value });
  });

  it('rejects a non-array value', () => {
    expect(validateSolidClassnameArray({ logo: 'logo-first' })).toMatchObject({
      isValid: false,
      reason: 'invalid-array',
    });
  });

  it('rejects a non-object entry', () => {
    expect(validateSolidClassnameArray(['logo-first'])).toMatchObject({
      isValid: false,
      reason: 'invalid-entry',
    });
  });

  it('rejects a non-string classname', () => {
    expect(validateSolidClassnameArray([{ logo: 1 }])).toMatchObject({
      isValid: false,
      reason: 'invalid-entry',
    });
  });

  it('rejects an array differing from the expected layer count', () => {
    expect(validateSolidClassnameArray([{ logo: 'logo-first' }], 2)).toMatchObject({
      isValid: false,
      reason: 'length-mismatch',
    });
  });
});

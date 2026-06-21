import type { SolidClassnames } from './types';

/** @public Reason why solid classname array validation failed. */
export type SolidClassnameArrayValidationFailureReason = 'invalid-array' | 'invalid-entry' | 'length-mismatch';

/** @public Result returned by solid classname array validation. */
export type SolidClassnameArrayValidationResult =
  | { isValid: true; value: SolidClassnames[] }
  | { isValid: false; message: string; reason: SolidClassnameArrayValidationFailureReason };

/**
 * Validates solid classname maps and optionally checks their count against layers.
 * Returns a result so callers can choose their own error-reporting behavior.
 * @public
 */
export default function validateSolidClassnameArray(
  value: unknown,
  expectedLayerCount?: number,
): SolidClassnameArrayValidationResult {
  if (!Array.isArray(value)) {
    return {
      isValid: false,
      message: 'solidClassnameArray must be an array',
      reason: 'invalid-array',
    };
  }

  const hasInvalidEntry = value.some(
    (entry) =>
      !entry ||
      typeof entry !== 'object' ||
      Array.isArray(entry) ||
      Object.values(entry).some((classname) => typeof classname !== 'string'),
  );
  if (hasInvalidEntry) {
    return {
      isValid: false,
      message: 'solidClassnameArray entries must map solid ids to classname strings',
      reason: 'invalid-entry',
    };
  }

  if (expectedLayerCount !== undefined && value.length !== expectedLayerCount) {
    return {
      isValid: false,
      message: 'solidClassnameArray length differs from count of layers',
      reason: 'length-mismatch',
    };
  }

  return { isValid: true, value: value as SolidClassnames[] };
}

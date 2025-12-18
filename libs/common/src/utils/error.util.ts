/**
 * Type guard to check if error has a stack property
 */
export function hasStack(error: unknown): error is Error {
  return (
    error instanceof Error ||
    (typeof error === 'object' && error !== null && 'stack' in error)
  );
}

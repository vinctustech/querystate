// utils.ts - Parameter handling utility functions

/**
 * Parse a string value from URL to appropriate type
 * @param value The string value from URL parameter
 * @param type The expected parameter type
 * @param parseFunction Optional custom parsing function
 * @returns The parsed value or undefined if invalid
 */
export function parseParameterValue<T>(
  value: string | null,
  type: 'string' | 'number' | 'date',
  parseFunction?: (val: string) => T,
): T | undefined {
  if (value === null) return undefined

  if (type === 'number') {
    const parsed = Number(value)
    return !isNaN(parsed) && isFinite(parsed) ? (parsed as unknown as T) : undefined
  } else if (type === 'date') {
    return parseFunction ? parseFunction(value) : (new Date(value) as unknown as T)
  }

  return value as unknown as T
}

/**
 * Serialize a value for the URL
 * @param value The value to serialize
 * @param type The parameter type
 * @param serializeFunction Optional custom serialization function
 * @returns String representation for URL
 */
export function serializeParameterValue<T>(
  value: T,
  type: 'string' | 'number' | 'date',
  serializeFunction?: (val: T) => string,
): string {
  if (type === 'date' && serializeFunction) {
    return serializeFunction(value)
  } else if (type === 'date') {
    return (value as unknown as Date).toISOString()
  }

  return String(value)
}

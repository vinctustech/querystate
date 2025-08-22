// Common parsing utilities
export function parseStringFromUrl(str: string): string {
  return decodeURIComponent(str)
}

export function serializeStringToUrl(str: string): string {
  return encodeURIComponent(str)
}
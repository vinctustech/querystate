// String validation patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^https?:\/\/.+/
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function applyStringConstraints(
  value: string,
  config: {
    minLength?: number
    maxLength?: number
    lowercase?: boolean
    uppercase?: boolean
    email?: boolean
    url?: boolean
    uuid?: boolean
    defaultValue?: string
  }
): string | undefined {
  // Apply transformations first
  if (config.lowercase) value = value.toLowerCase()
  if (config.uppercase) value = value.toUpperCase()
  
  // Check length constraints
  if (config.minLength && value.length < config.minLength) {
    return config.defaultValue
  }
  if (config.maxLength && value.length > config.maxLength) {
    value = value.substring(0, config.maxLength)
  }
  
  // Check format constraints
  if (config.email && !EMAIL_REGEX.test(value)) {
    return config.defaultValue
  }
  if (config.url && !URL_REGEX.test(value)) {
    return config.defaultValue
  }
  if (config.uuid && !UUID_REGEX.test(value)) {
    return config.defaultValue
  }
  
  return value
}

export function applyArrayConstraints<T>(
  array: T[],
  config: {
    min?: number
    max?: number
    defaultValue?: T[]
  }
): T[] {
  // Check minimum length
  if (config.min && array.length < config.min) {
    return config.defaultValue ?? []
  }
  
  // Check maximum length
  if (config.max && array.length > config.max) {
    return array.slice(0, config.max)
  }
  
  return array
}

export function applySetConstraints<T>(
  array: T[],
  config: {
    min?: number
    max?: number
    defaultValue?: T[]
  }
): T[] {
  // Remove duplicates
  const unique = [...new Set(array)]
  
  // Apply array constraints to the unique set
  return applyArrayConstraints(unique, config)
}
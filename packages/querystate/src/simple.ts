// Ultra-simple implementation to get basic functionality working
import { useSearchParams } from 'react-router-dom'

export interface StringConfig {
  type: 'string'
  defaultValue?: string
  minLength?: number
  maxLength?: number
}

export interface NumberConfig {
  type: 'number'
  defaultValue?: number
  min?: number
  max?: number
}

export interface BooleanConfig {
  type: 'boolean'
  defaultValue?: boolean
}

export interface StringArrayConfig {
  type: 'stringArray'
  defaultValue?: string[]
  minLength?: number
  maxLength?: number
}

export type SimpleConfig =
  | StringConfig
  | NumberConfig
  | BooleanConfig
  | StringArrayConfig
  | StringBuilder
  | NumberBuilder
  | BooleanBuilder
  | StringArrayBuilder

export interface StringBuilder {
  type: 'string'
  min(length: number): StringBuilder
  max(length: number): StringBuilder
  default(value: string): StringConfig
}

export interface NumberBuilder {
  type: 'number'
  min(value: number): NumberBuilder
  max(value: number): NumberBuilder
  default(value: number): NumberConfig
}

export interface BooleanBuilder {
  type: 'boolean'
  default(value: boolean): BooleanConfig
}

export interface StringArrayBuilder {
  type: 'stringArray'
  min(length: number): StringArrayBuilder
  max(length: number): StringArrayBuilder
  default(value: string[]): StringArrayConfig
}

// String builder
export function string(): StringBuilder {
  const createBuilder = (config: Partial<StringConfig> = {}): StringBuilder => ({
    type: 'string',

    min(length: number): StringBuilder {
      return createBuilder({ ...config, minLength: length })
    },

    max(length: number): StringBuilder {
      return createBuilder({ ...config, maxLength: length })
    },

    default(value: string): StringConfig {
      return { type: 'string', ...config, defaultValue: value }
    },
  })

  return createBuilder()
}

// Number builder
export function number(): NumberBuilder {
  const createBuilder = (config: Partial<NumberConfig> = {}): NumberBuilder => ({
    type: 'number',

    min(value: number): NumberBuilder {
      return createBuilder({ ...config, min: value })
    },

    max(value: number): NumberBuilder {
      return createBuilder({ ...config, max: value })
    },

    default(value: number): NumberConfig {
      return { type: 'number', ...config, defaultValue: value }
    },
  })

  return createBuilder()
}

// Boolean builder
export function boolean(): BooleanBuilder {
  const createBuilder = (config: Partial<BooleanConfig> = {}): BooleanBuilder => ({
    type: 'boolean',

    default(value: boolean): BooleanConfig {
      return { type: 'boolean', ...config, defaultValue: value }
    },
  })

  return createBuilder()
}

// String array builder
export function stringArray(): StringArrayBuilder {
  const createBuilder = (config: Partial<StringArrayConfig> = {}): StringArrayBuilder => ({
    type: 'stringArray',

    min(length: number): StringArrayBuilder {
      return createBuilder({ ...config, minLength: length })
    },

    max(length: number): StringArrayBuilder {
      return createBuilder({ ...config, maxLength: length })
    },

    default(value: string[]): StringArrayConfig {
      return { type: 'stringArray', ...config, defaultValue: value }
    },
  })

  return createBuilder()
}

// Parse and validate values from URL
function parseValue(rawValue: string | null, config: SimpleConfig): any {
  const defaultValue = getDefaultValue(config)

  if (rawValue === null) {
    return defaultValue
  }

  if (config.type === 'string') {
    let value = rawValue

    // Apply string constraints
    const minLength = getMinLength(config)
    const maxLength = getMaxLength(config)

    if (minLength && value.length < minLength) {
      return defaultValue
    }
    if (maxLength && value.length > maxLength) {
      value = value.substring(0, maxLength)
    }

    return value
  }

  if (config.type === 'number') {
    const parsed = parseFloat(rawValue)
    if (isNaN(parsed)) {
      return defaultValue
    }

    let value = parsed

    // Apply number constraints
    const min = getMin(config)
    const max = getMax(config)

    if (min !== undefined && value < min) {
      value = min
    }
    if (max !== undefined && value > max) {
      value = max
    }

    return value
  }

  if (config.type === 'boolean') {
    // Boolean parsing: 'true', '1', 'yes' -> true, everything else -> false
    const lowerValue = rawValue.toLowerCase()
    return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes'
  }

  if (config.type === 'stringArray') {
    // Parse comma-separated string into array
    const parsed = rawValue.split(',')
    let value = parsed

    // Apply array constraints
    const minLength = getMinLength(config)
    const maxLength = getMaxLength(config)

    if (minLength && value.length < minLength) {
      return defaultValue
    }
    if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength)
    }

    return value
  }

  return rawValue
}

// Validate and process values before setting in URL
function validateValue(value: any, config: SimpleConfig): any {
  const defaultValue = getDefaultValue(config)

  if (value === undefined || value === null) {
    return defaultValue
  }

  if (config.type === 'string') {
    let stringValue = String(value)

    // Apply string constraints
    const minLength = getMinLength(config)
    const maxLength = getMaxLength(config)

    if (minLength && stringValue.length < minLength) {
      return defaultValue
    }
    if (maxLength && stringValue.length > maxLength) {
      stringValue = stringValue.substring(0, maxLength)
    }

    return stringValue
  }

  if (config.type === 'number') {
    const numValue = typeof value === 'number' ? value : parseFloat(String(value))
    if (isNaN(numValue)) {
      return defaultValue
    }

    let validatedValue = numValue

    // Apply number constraints
    const min = getMin(config)
    const max = getMax(config)

    if (min !== undefined && validatedValue < min) {
      validatedValue = min
    }
    if (max !== undefined && validatedValue > max) {
      validatedValue = max
    }

    return validatedValue
  }

  if (config.type === 'boolean') {
    // Boolean validation: coerce to boolean
    return Boolean(value)
  }

  if (config.type === 'stringArray') {
    // String array validation
    const arrayValue = Array.isArray(value) ? value : [String(value)]
    let validatedValue = arrayValue.map((item) => String(item))

    // Apply array constraints
    const minLength = getMinLength(config)
    const maxLength = getMaxLength(config)

    if (minLength && validatedValue.length < minLength) {
      return defaultValue
    }
    if (maxLength && validatedValue.length > maxLength) {
      validatedValue = validatedValue.slice(0, maxLength)
    }

    return validatedValue
  }

  return value
}

// Serialize values for URL
function serializeValue(value: any, config: SimpleConfig): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  if (config.type === 'number') {
    return value.toString()
  }

  if (config.type === 'stringArray') {
    // Serialize array as comma-separated string
    return Array.isArray(value) ? value.join(',') : String(value)
  }

  return String(value)
}

// Global debug log for sharing with UI
let debugMessages: string[] = []

// Main hook
export function useQueryState<T extends Record<string, SimpleConfig>>(schema: T): any {
  const [searchParams, setSearchParams] = useSearchParams()

  // Clear debug messages on each hook call
  debugMessages = []

  // Check if defaults need to be applied to URL on initial load
  const needsDefaultsApplied = Object.entries(schema).some(([key, config]) => {
    const arrayKey = key + '[]'
    const hasArrayValue = config.type === 'stringArray' && searchParams.has(arrayKey)
    const hasRegularValue = searchParams.has(key)
    const hasValue = hasArrayValue || hasRegularValue
    const hasDefault = getDefaultValue(config) !== undefined
    debugMessages.push(
      `DEBUG: ${key} - hasValue: ${hasValue}, hasDefault: ${hasDefault}, getDefaultValue: ${getDefaultValue(config)}`,
    )
    return !hasValue && hasDefault
  })

  debugMessages.push(`DEBUG: needsDefaultsApplied: ${needsDefaultsApplied}`)

  // Apply defaults to URL using setTimeout to avoid calling setSearchParams during render
  if (needsDefaultsApplied) {
    debugMessages.push(`DEBUG: Scheduling defaults to be applied to URL`)

    // Capture current debug messages and search params in closure
    const currentDebugMessages = [...debugMessages]
    const currentSearchParams = new URLSearchParams(searchParams)

    setTimeout(() => {
      const timeoutDebugMessages: string[] = []
      currentDebugMessages.forEach((msg) => timeoutDebugMessages.push(msg))
      timeoutDebugMessages.push(`DEBUG: setTimeout - About to apply defaults to URL`)
      const paramsWithDefaults = new URLSearchParams(currentSearchParams)

      Object.entries(schema).forEach(([key, config]) => {
        const arrayKey = key + '[]'
        const hasArrayValue = config.type === 'stringArray' && paramsWithDefaults.has(arrayKey)
        const hasRegularValue = paramsWithDefaults.has(key)
        
        if (!hasArrayValue && !hasRegularValue) {
          const defaultValue = getDefaultValue(config)
          timeoutDebugMessages.push(
            `DEBUG: setTimeout - Setting ${key} to default: ${defaultValue}`,
          )
          if (defaultValue !== undefined) {
            if (config.type === 'stringArray' && Array.isArray(defaultValue)) {
              // For arrays, use param[] syntax - set multiple entries
              defaultValue.forEach(item => {
                paramsWithDefaults.append(arrayKey, String(item))
              })
              timeoutDebugMessages.push(`DEBUG: setTimeout - Set array ${arrayKey} with ${defaultValue.length} items`)
            } else {
              const serialized = serializeValue(defaultValue, config)
              timeoutDebugMessages.push(`DEBUG: setTimeout - Serialized ${key}: ${serialized}`)
              if (serialized !== undefined) {
                paramsWithDefaults.set(key, serialized)
              }
            }
          }
        }
      })

      timeoutDebugMessages.push(
        `DEBUG: setTimeout - Final params: ${paramsWithDefaults.toString()}`,
      )
      timeoutDebugMessages.push(`DEBUG: setTimeout - About to call setSearchParams`)
      setSearchParams(paramsWithDefaults, { replace: true })
      timeoutDebugMessages.push(`DEBUG: setTimeout - setSearchParams called successfully`)

      // Update global debug messages after the timeout
      ;(globalThis as any).queryStateDebug = timeoutDebugMessages
    }, 0)
  }

  // Add debug messages to result
  ;(globalThis as any).queryStateDebug = debugMessages

  const result: any = {}

  // Helper to rebuild URL with only schema keys
  const rebuildURL = (updatedKey?: string, updatedValue?: any) => {
    const newParams = new URLSearchParams()

    Object.entries(schema).forEach(([key, config]) => {
      let valueToUse: any

      if (key === updatedKey) {
        // Use the new value being set
        valueToUse = updatedValue
      } else {
        // Use current parsed value
        let rawValue: string | null
        if (config.type === 'stringArray') {
          // For arrays, use param[] syntax with URLSearchParams.getAll()
          const arrayKey = key + '[]'
          const arrayValues = searchParams.getAll(arrayKey)
          rawValue = arrayValues.length > 0 ? arrayValues.join(',') : null
        } else {
          rawValue = searchParams.get(key)
        }
        valueToUse = parseValue(rawValue, config)
      }

      // Validate the value before setting
      const validatedValue = validateValue(valueToUse, config)
      
      if (config.type === 'stringArray' && Array.isArray(validatedValue)) {
        // For arrays, use param[] syntax - set multiple entries
        const arrayKey = key + '[]'
        validatedValue.forEach(item => {
          newParams.append(arrayKey, String(item))
        })
      } else {
        const serialized = serializeValue(validatedValue, config)
        if (serialized !== undefined) {
          newParams.set(key, serialized)
        }
      }
    })

    return newParams
  }

  // Add values and setters for each key
  Object.entries(schema).forEach(([key, config]) => {
    // Get and parse current value
    let rawValue: string | null
    if (config.type === 'stringArray') {
      // For arrays, use param[] syntax with URLSearchParams.getAll()
      const arrayKey = key + '[]'
      const arrayValues = searchParams.getAll(arrayKey)
      rawValue = arrayValues.length > 0 ? arrayValues.join(',') : null
    } else {
      rawValue = searchParams.get(key)
    }
    const value = parseValue(rawValue, config)
    result[key] = value

    // Create setter
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1)
    result[`set${capitalizedKey}`] = (newValue: any) => {
      const newParams = rebuildURL(key, newValue)
      setSearchParams(newParams)
    }
  })

  return result
}

// Helper function to get config values from builder or config objects
function getConfigValue<T>(obj: SimpleConfig, key: string): T | undefined {
  // For config objects, access directly
  if ('defaultValue' in obj || !('min' in obj && typeof obj.min === 'function')) {
    return (obj as any)[key]
  }
  // For builder objects, these properties aren't accessible - return undefined
  return undefined
}

function getDefaultValue(config: SimpleConfig): any {
  return getConfigValue(config, 'defaultValue')
}

function getMinLength(config: SimpleConfig): number | undefined {
  return getConfigValue(config, 'minLength')
}

function getMaxLength(config: SimpleConfig): number | undefined {
  return getConfigValue(config, 'maxLength')
}

function getMin(config: SimpleConfig): number | undefined {
  return getConfigValue(config, 'min')
}

function getMax(config: SimpleConfig): number | undefined {
  return getConfigValue(config, 'max')
}

// Main queryState object
export const queryState = {
  string,
  number,
  boolean,
  stringArray,
}

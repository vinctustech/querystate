// Ultra-simple implementation to get basic functionality working
import { useSearchParams } from 'react-router-dom'

// Base configs without defaults
export interface StringConfig {
  type: 'string'
  defaultValue?: string
  minLength?: number
  maxLength?: number
  lowercase?: boolean
  uppercase?: boolean
  email?: boolean
  url?: boolean
  uuid?: boolean
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

export interface NumberArrayConfig {
  type: 'numberArray'
  defaultValue?: number[]
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

export interface BooleanArrayConfig {
  type: 'booleanArray'
  defaultValue?: boolean[]
  minLength?: number
  maxLength?: number
}

// More specific configs with required defaults
export interface StringConfigWithDefault {
  type: 'string'
  defaultValue: string
  minLength?: number
  maxLength?: number
  lowercase?: boolean
  uppercase?: boolean
  email?: boolean
  url?: boolean
  uuid?: boolean
}

export interface NumberConfigWithDefault {
  type: 'number'
  defaultValue: number
  min?: number
  max?: number
}

export interface BooleanConfigWithDefault {
  type: 'boolean'
  defaultValue: boolean
}

export interface StringArrayConfigWithDefault {
  type: 'stringArray'
  defaultValue: string[]
  minLength?: number
  maxLength?: number
}

export interface NumberArrayConfigWithDefault {
  type: 'numberArray'
  defaultValue: number[]
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

export interface BooleanArrayConfigWithDefault {
  type: 'booleanArray'
  defaultValue: boolean[]
  minLength?: number
  maxLength?: number
}

export type Config =
  | StringConfig
  | NumberConfig
  | BooleanConfig
  | StringArrayConfig
  | NumberArrayConfig
  | BooleanArrayConfig
  | StringConfigWithDefault
  | NumberConfigWithDefault
  | BooleanConfigWithDefault
  | StringArrayConfigWithDefault
  | NumberArrayConfigWithDefault
  | BooleanArrayConfigWithDefault
  | StringBuilder
  | NumberBuilder
  | BooleanBuilder
  | StringArrayBuilder
  | NumberArrayBuilder
  | BooleanArrayBuilder

// Type helper to infer the value type from a config
type InferConfigType<T extends Config> = 
  T extends StringConfigWithDefault ? string :
  T extends StringConfig ? string | undefined :
  T extends StringBuilder ? string | undefined :
  T extends NumberConfigWithDefault ? number :
  T extends NumberConfig ? number | undefined :
  T extends NumberBuilder ? number | undefined :
  T extends BooleanConfigWithDefault ? boolean :
  T extends BooleanConfig ? boolean | undefined :
  T extends BooleanBuilder ? boolean | undefined :
  T extends StringArrayConfigWithDefault ? string[] :
  T extends StringArrayConfig ? string[] | undefined :
  T extends StringArrayBuilder ? string[] | undefined :
  T extends NumberArrayConfigWithDefault ? number[] :
  T extends NumberArrayConfig ? number[] | undefined :
  T extends NumberArrayBuilder ? number[] | undefined :
  T extends BooleanArrayConfigWithDefault ? boolean[] :
  T extends BooleanArrayConfig ? boolean[] | undefined :
  T extends BooleanArrayBuilder ? boolean[] | undefined :
  never

// Type helper to create setter function type - always accepts undefined for clearing
type SetterType<T> = (value: T | undefined) => void

// Type helper to convert schema to return type
type UseQueryStateReturnType<T extends Record<string, Config>> = {
  [K in keyof T]: InferConfigType<T[K]>
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: SetterType<InferConfigType<T[K]>>
}

export interface StringBuilder {
  type: 'string'
  _config: Partial<StringConfig> // Expose internal config
  min(length: number): StringBuilder
  max(length: number): StringBuilder
  lowercase(): StringBuilder
  uppercase(): StringBuilder
  email(): StringBuilder
  url(): StringBuilder
  uuid(): StringBuilder
  default(value: string): StringConfigWithDefault
}

export interface NumberBuilder {
  type: 'number'
  min(value: number): NumberBuilder
  max(value: number): NumberBuilder
  default(value: number): NumberConfigWithDefault
}

export interface BooleanBuilder {
  type: 'boolean'
  default(value: boolean): BooleanConfigWithDefault
}

export interface StringArrayBuilder {
  type: 'stringArray'
  min(length: number): StringArrayBuilder
  max(length: number): StringArrayBuilder
  default(value: string[]): StringArrayConfigWithDefault
}

export interface NumberArrayBuilder {
  type: 'numberArray'
  min(length: number): NumberArrayBuilder
  max(length: number): NumberArrayBuilder
  minValue(value: number): NumberArrayBuilder
  maxValue(value: number): NumberArrayBuilder
  default(value: number[]): NumberArrayConfigWithDefault
}

export interface BooleanArrayBuilder {
  type: 'booleanArray'
  min(length: number): BooleanArrayBuilder
  max(length: number): BooleanArrayBuilder
  default(value: boolean[]): BooleanArrayConfigWithDefault
}

// String builder
export function string(): StringBuilder {
  const createBuilder = (config: Partial<StringConfig> = {}): StringBuilder => ({
    type: 'string',
    _config: config,

    min(length: number): StringBuilder {
      return createBuilder({ ...config, minLength: length })
    },

    max(length: number): StringBuilder {
      return createBuilder({ ...config, maxLength: length })
    },

    lowercase(): StringBuilder {
      return createBuilder({ ...config, lowercase: true })
    },

    uppercase(): StringBuilder {
      return createBuilder({ ...config, uppercase: true })
    },

    email(): StringBuilder {
      return createBuilder({ ...config, email: true })
    },

    url(): StringBuilder {
      return createBuilder({ ...config, url: true })
    },

    uuid(): StringBuilder {
      return createBuilder({ ...config, uuid: true })
    },

    default(value: string): StringConfigWithDefault {
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

    default(value: number): NumberConfigWithDefault {
      return { type: 'number', ...config, defaultValue: value }
    },
  })

  return createBuilder()
}

// Boolean builder
export function boolean(): BooleanBuilder {
  const createBuilder = (config: Partial<BooleanConfig> = {}): BooleanBuilder => ({
    type: 'boolean',

    default(value: boolean): BooleanConfigWithDefault {
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

    default(value: string[]): StringArrayConfigWithDefault {
      return { type: 'stringArray', ...config, defaultValue: value }
    },
  })

  return createBuilder()
}

// Number array builder
export function numberArray(): NumberArrayBuilder {
  const createBuilder = (config: Partial<NumberArrayConfig> = {}): NumberArrayBuilder => ({
    type: 'numberArray',
    
    min(length: number): NumberArrayBuilder {
      return createBuilder({ ...config, minLength: length })
    },
    
    max(length: number): NumberArrayBuilder {
      return createBuilder({ ...config, maxLength: length })
    },
    
    minValue(value: number): NumberArrayBuilder {
      return createBuilder({ ...config, min: value })
    },
    
    maxValue(value: number): NumberArrayBuilder {
      return createBuilder({ ...config, max: value })
    },
    
    default(value: number[]): NumberArrayConfigWithDefault {
      return { type: 'numberArray', ...config, defaultValue: value }
    },
  })
  
  return createBuilder()
}

// Boolean array builder
export function booleanArray(): BooleanArrayBuilder {
  const createBuilder = (config: Partial<BooleanArrayConfig> = {}): BooleanArrayBuilder => ({
    type: 'booleanArray',
    
    min(length: number): BooleanArrayBuilder {
      return createBuilder({ ...config, minLength: length })
    },
    
    max(length: number): BooleanArrayBuilder {
      return createBuilder({ ...config, maxLength: length })
    },
    
    default(value: boolean[]): BooleanArrayConfigWithDefault {
      return { type: 'booleanArray', ...config, defaultValue: value }
    },
  })
  
  return createBuilder()
}

// Parse and validate values from URL
function parseValue(rawValue: string | null, config: Config): any {
  const defaultValue = getDefaultValue(config)

  if (rawValue === null) {
    return defaultValue
  }

  if (config.type === 'string') {
    let value = rawValue

    // Apply transformation constraints first
    const isLowercase = getConfigValue(config, 'lowercase')
    const isUppercase = getConfigValue(config, 'uppercase')
    
    if (isLowercase) {
      value = value.toLowerCase()
    } else if (isUppercase) {
      value = value.toUpperCase()
    }

    // Apply length constraints
    const minLength = getMinLength(config)
    const maxLength = getMaxLength(config)

    if (minLength && value.length < minLength) {
      return defaultValue
    }
    if (maxLength && value.length > maxLength) {
      value = value.substring(0, maxLength)
    }

    // Apply validation constraints
    const isEmail = getConfigValue(config, 'email')
    const isUrl = getConfigValue(config, 'url')
    const isUuid = getConfigValue(config, 'uuid')

    if (isEmail && !isValidEmail(value)) {
      return defaultValue
    }
    if (isUrl && !isValidUrl(value)) {
      return defaultValue
    }
    if (isUuid && !isValidUuid(value)) {
      return defaultValue
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

  if (config.type === 'numberArray') {
    // Parse comma-separated string into number array
    const parsed = rawValue.split(',').map(v => parseFloat(v))
    
    // Check for invalid numbers
    if (parsed.some(isNaN)) {
      return defaultValue
    }
    
    // Apply value constraints to each number
    const min = getMin(config)
    const max = getMax(config)
    let value = parsed.map(n => {
      let num = n
      if (min !== undefined && num < min) num = min
      if (max !== undefined && num > max) num = max
      return num
    })

    // Apply array length constraints
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

  if (config.type === 'booleanArray') {
    // Parse comma-separated string into boolean array
    const parsed = rawValue.split(',').map(v => {
      const lower = v.toLowerCase().trim()
      return lower === 'true' || lower === '1' || lower === 'yes'
    })
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
function validateValue(value: any, config: Config): any {
  const defaultValue = getDefaultValue(config)

  if (value === undefined || value === null) {
    return defaultValue
  }

  if (config.type === 'string') {
    let stringValue = String(value)

    // Apply transformation constraints first
    const isLowercase = getConfigValue(config, 'lowercase')
    const isUppercase = getConfigValue(config, 'uppercase')
    
    if (isLowercase) {
      stringValue = stringValue.toLowerCase()
    } else if (isUppercase) {
      stringValue = stringValue.toUpperCase()
    }

    // Apply length constraints
    const minLength = getMinLength(config)
    const maxLength = getMaxLength(config)

    if (minLength && stringValue.length < minLength) {
      return defaultValue
    }
    if (maxLength && stringValue.length > maxLength) {
      stringValue = stringValue.substring(0, maxLength)
    }

    // Apply validation constraints
    const isEmail = getConfigValue(config, 'email')
    const isUrl = getConfigValue(config, 'url')
    const isUuid = getConfigValue(config, 'uuid')

    if (isEmail && !isValidEmail(stringValue)) {
      return defaultValue
    }
    if (isUrl && !isValidUrl(stringValue)) {
      return defaultValue
    }
    if (isUuid && !isValidUuid(stringValue)) {
      return defaultValue
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

  if (config.type === 'numberArray') {
    // Number array validation
    const arrayValue = Array.isArray(value) ? value : [value]
    
    // Convert to numbers and validate
    const parsed = arrayValue.map(v => typeof v === 'number' ? v : parseFloat(String(v)))
    if (parsed.some(isNaN)) {
      return defaultValue
    }
    
    // Apply value constraints to each number
    const min = getMin(config)
    const max = getMax(config)
    let validatedValue = parsed.map(n => {
      let num = n
      if (min !== undefined && num < min) num = min
      if (max !== undefined && num > max) num = max
      return num
    })

    // Apply array length constraints
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

  if (config.type === 'booleanArray') {
    // Boolean array validation
    const arrayValue = Array.isArray(value) ? value : [value]
    let validatedValue = arrayValue.map((item) => Boolean(item))

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
function serializeValue(value: any, config: Config): string | undefined {
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
export function useQueryState<T extends Record<string, Config>>(schema: T): UseQueryStateReturnType<T> {
  const [searchParams, setSearchParams] = useSearchParams()

  // Clear debug messages on each hook call
  debugMessages = []

  // Check if defaults need to be applied to URL on initial load
  const needsDefaultsApplied = Object.entries(schema).some(([key, config]) => {
    const arrayKey = key + '[]'
    const isArrayType = config.type === 'stringArray' || config.type === 'numberArray' || config.type === 'booleanArray'
    const hasArrayValue = isArrayType && searchParams.has(arrayKey)
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
        const isArrayType = config.type === 'stringArray' || config.type === 'numberArray' || config.type === 'booleanArray'
        const hasArrayValue = isArrayType && paramsWithDefaults.has(arrayKey)
        const hasRegularValue = paramsWithDefaults.has(key)

        if (!hasArrayValue && !hasRegularValue) {
          const defaultValue = getDefaultValue(config)
          timeoutDebugMessages.push(
            `DEBUG: setTimeout - Setting ${key} to default: ${defaultValue}`,
          )
          if (defaultValue !== undefined) {
            const isArrayType = config.type === 'stringArray' || config.type === 'numberArray' || config.type === 'booleanArray'
            if (isArrayType && Array.isArray(defaultValue)) {
              // For arrays, use param[] syntax - set multiple entries
              defaultValue.forEach((item) => {
                paramsWithDefaults.append(arrayKey, String(item))
              })
              timeoutDebugMessages.push(
                `DEBUG: setTimeout - Set array ${arrayKey} with ${defaultValue.length} items`,
              )
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
        const isArrayType = config.type === 'stringArray' || config.type === 'numberArray' || config.type === 'booleanArray'
        if (isArrayType) {
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

      const isArrayType = config.type === 'stringArray' || config.type === 'numberArray' || config.type === 'booleanArray'
      if (isArrayType && Array.isArray(validatedValue)) {
        // For arrays, use param[] syntax - set multiple entries
        const arrayKey = key + '[]'
        validatedValue.forEach((item) => {
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
    const isArrayType = config.type === 'stringArray' || config.type === 'numberArray' || config.type === 'booleanArray'
    if (isArrayType) {
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
function getConfigValue<T>(obj: Config, key: string): T | undefined {
  // For config objects, access directly
  if ('defaultValue' in obj || !('min' in obj && typeof obj.min === 'function')) {
    return (obj as any)[key]
  }
  
  // For StringBuilder objects, check the _config property
  if ('_config' in obj && obj._config) {
    return (obj._config as any)[key]
  }
  
  // For other builder objects, these properties aren't accessible - return undefined
  return undefined
}

function getDefaultValue(config: Config): any {
  return getConfigValue(config, 'defaultValue')
}

function getMinLength(config: Config): number | undefined {
  return getConfigValue(config, 'minLength')
}

function getMaxLength(config: Config): number | undefined {
  return getConfigValue(config, 'maxLength')
}

function getMin(config: Config): number | undefined {
  return getConfigValue(config, 'min')
}

function getMax(config: Config): number | undefined {
  return getConfigValue(config, 'max')
}

// String validation functions
function isValidEmail(email: string): boolean {
  // Simple email regex for basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidUuid(uuid: string): boolean {
  // UUID v4 regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Main queryState object
export const queryState = {
  string,
  number,
  boolean,
  stringArray,
  numberArray,
  booleanArray,
}

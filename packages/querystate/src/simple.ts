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

export type SimpleConfig = StringConfig | NumberConfig

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
    }
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
    }
  })
  
  return createBuilder()
}

// Parse and validate values from URL
function parseValue(rawValue: string | null, config: SimpleConfig): any {
  if (rawValue === null) {
    return config.defaultValue
  }
  
  if (config.type === 'string') {
    let value = rawValue
    
    // Apply string constraints
    if (config.minLength && value.length < config.minLength) {
      return config.defaultValue
    }
    if (config.maxLength && value.length > config.maxLength) {
      value = value.substring(0, config.maxLength)
    }
    
    return value
  }
  
  if (config.type === 'number') {
    const parsed = parseFloat(rawValue)
    if (isNaN(parsed)) {
      return config.defaultValue
    }
    
    let value = parsed
    
    // Apply number constraints
    if (config.min !== undefined && value < config.min) {
      value = config.min
    }
    if (config.max !== undefined && value > config.max) {
      value = config.max
    }
    
    return value
  }
  
  return rawValue
}

// Validate and process values before setting in URL
function validateValue(value: any, config: SimpleConfig): any {
  if (value === undefined || value === null) {
    return config.defaultValue
  }
  
  if (config.type === 'string') {
    let stringValue = String(value)
    
    // Apply string constraints
    if (config.minLength && stringValue.length < config.minLength) {
      return config.defaultValue
    }
    if (config.maxLength && stringValue.length > config.maxLength) {
      stringValue = stringValue.substring(0, config.maxLength)
    }
    
    return stringValue
  }
  
  if (config.type === 'number') {
    const numValue = typeof value === 'number' ? value : parseFloat(String(value))
    if (isNaN(numValue)) {
      return config.defaultValue
    }
    
    let validatedValue = numValue
    
    // Apply number constraints
    if (config.min !== undefined && validatedValue < config.min) {
      validatedValue = config.min
    }
    if (config.max !== undefined && validatedValue > config.max) {
      validatedValue = config.max
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
  
  return String(value)
}

// Simple hook
export function useSimpleQueryState<T extends Record<string, SimpleConfig>>(
  schema: T
): any {
  const [searchParams, setSearchParams] = useSearchParams()
  
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
        const rawValue = searchParams.get(key)
        valueToUse = parseValue(rawValue, config)
      }
      
      // Validate the value before setting
      const validatedValue = validateValue(valueToUse, config)
      const serialized = serializeValue(validatedValue, config)
      
      if (serialized !== undefined) {
        newParams.set(key, serialized)
      }
    })
    
    return newParams
  }
  
  // Add values and setters for each key
  Object.entries(schema).forEach(([key, config]) => {
    // Get and parse current value
    const rawValue = searchParams.get(key)
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

// Simple queryState object
export const simpleQueryState = {
  string,
  number
}
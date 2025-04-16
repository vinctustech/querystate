import { useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'

// Parameter type definitions
interface StringParamConfig {
  type: 'single'
  defaultValue?: string
}

interface ArrayParamConfig {
  type: 'array'
  defaultValue?: string[]
}

type ParamConfig = StringParamConfig | ArrayParamConfig

// Helper type for capitalizing first letter
type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S

// Builder interfaces for chainable API
interface StringParamBuilder extends StringParamConfig {
  array(): ArrayParamBuilder
  default(value: string): StringParamConfig
}

interface ArrayParamBuilder extends ArrayParamConfig {
  default(value: string[]): ArrayParamConfig
}

// Define result type based on schema
type QueryStateResult<T extends Record<string, ParamConfig>> = {
  [K in keyof T]: T[K]['type'] extends 'array' ? string[] : string | undefined
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: T[K]['type'] extends 'array'
    ? (value: string[] | undefined) => void
    : (value: string | undefined) => void
}

// The queryState API with chainable methods
export const queryState = {
  string(): StringParamBuilder {
    const config: StringParamConfig = { type: 'single' }

    return {
      ...config,
      array(): ArrayParamBuilder {
        const arrayConfig: ArrayParamConfig = { type: 'array' }

        return {
          ...arrayConfig,
          default(value: string[]): ArrayParamConfig {
            return { ...arrayConfig, defaultValue: value }
          },
        }
      },
      default(value: string): StringParamConfig {
        return { ...config, defaultValue: value }
      },
    }
  },
}

/**
 * A custom hook for managing URL query parameters with support for both
 * single string values and string arrays with chainable configuration.
 *
 * @param schema An object defining the parameters using the queryState builder
 * @returns An object with values and setters for each parameter
 */
export function useQueryState<T extends Record<string, ParamConfig>>(
  schema: T,
): QueryStateResult<T> {
  const [searchParams, setSearchParams] = useSearchParams()

  // Apply default values if parameters aren't in the URL
  useEffect(() => {
    let needsUpdate = false
    const updatedParams = new URLSearchParams(searchParams)

    Object.entries(schema).forEach(([key, config]) => {
      if (!searchParams.has(key) && config.defaultValue !== undefined) {
        if (config.type === 'array') {
          const arrayDefaults = config.defaultValue as string[]
          if (arrayDefaults.length > 0) {
            needsUpdate = true
            arrayDefaults.forEach((val) => {
              updatedParams.append(key, val)
            })
          }
        } else {
          needsUpdate = true
          updatedParams.set(key, config.defaultValue as string)
        }
      }
    })

    if (needsUpdate) {
      setSearchParams(updatedParams)
    }
  }, [])

  // Create result object with values and setters
  return useMemo(() => {
    const result = {} as QueryStateResult<T>

    Object.entries(schema).forEach(([key, config]) => {
      const capitalizedKey = (key.charAt(0).toUpperCase() + key.slice(1)) as Capitalize<string>

      if (config.type === 'array') {
        // Handle array parameters
        const values = searchParams.getAll(key)
        const arrayValue = values.length > 0 ? values : []

        const setArrayValue = (newValue: string[] | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)
          updatedParams.delete(key)

          if (newValue && newValue.length > 0) {
            newValue.forEach((val) => {
              updatedParams.append(key, val)
            })
          } else if (config.defaultValue && (config.defaultValue as string[]).length > 0) {
            ;(config.defaultValue as string[]).forEach((val) => {
              updatedParams.append(key, val)
            })
          }

          setSearchParams(updatedParams)
        }

        Object.defineProperty(result, key, {
          value: arrayValue,
          enumerable: true,
        })

        Object.defineProperty(result, `set${capitalizedKey}`, {
          value: setArrayValue,
          enumerable: true,
        })
      } else {
        // Handle single parameters
        const paramValue = searchParams.get(key)
        const singleValue = paramValue !== null ? paramValue : undefined

        const setSingleValue = (newValue: string | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)

          if (newValue !== undefined && newValue !== '') {
            updatedParams.set(key, newValue)
          } else if (config.defaultValue) {
            updatedParams.set(key, config.defaultValue as string)
          } else {
            updatedParams.delete(key)
          }

          setSearchParams(updatedParams)
        }

        Object.defineProperty(result, key, {
          value: singleValue,
          enumerable: true,
        })

        Object.defineProperty(result, `set${capitalizedKey}`, {
          value: setSingleValue,
          enumerable: true,
        })
      }
    })

    return result
  }, [searchParams, setSearchParams])
}

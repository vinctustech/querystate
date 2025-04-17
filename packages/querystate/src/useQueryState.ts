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

interface NumberParamConfig {
  type: 'singleNumber'
  defaultValue?: number
}

interface NumberArrayParamConfig {
  type: 'numberArray'
  defaultValue?: number[]
}

// Tuple config with size parameter
interface TupleParamConfig<N extends number> {
  type: 'tuple'
  size: N
  defaultValue?: number[]
}

// Helper type to create numeric tuples of specific length
type NumberTuple<N extends number, T extends number[] = []> = T['length'] extends N
  ? T
  : NumberTuple<N, [...T, number]>

// Union of all parameter configs
type ParamConfig =
  | StringParamConfig
  | ArrayParamConfig
  | NumberParamConfig
  | NumberArrayParamConfig
  | TupleParamConfig<number>

// Helper type for capitalizing first letter
type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S

// String parameter builder interfaces
interface StringParamBuilder extends StringParamConfig {
  array(): ArrayParamBuilder
  default(value: string): StringParamConfig & { defaultValue: string }
}

interface ArrayParamBuilder extends ArrayParamConfig {
  default(value: string[]): ArrayParamConfig & { defaultValue: string[] }
}

// Number parameter builder interfaces
interface NumberParamBuilder extends NumberParamConfig {
  array(): NumberArrayParamBuilder
  tuple<N extends number>(size: N): TupleParamBuilder<N>
  default(value: number): NumberParamConfig & { defaultValue: number }
}

interface NumberArrayParamBuilder extends NumberArrayParamConfig {
  default(value: number[]): NumberArrayParamConfig & { defaultValue: number[] }
}

// Tuple parameter builder interface
interface TupleParamBuilder<N extends number> extends Omit<TupleParamConfig<N>, 'defaultValue'> {
  default(value: NumberTuple<N>): TupleParamConfig<N> & { defaultValue: NumberTuple<N> }
}

// Improved helper type for parameter extraction that handles defaults correctly
type ExtractParamType<T extends ParamConfig> =
  T extends TupleParamConfig<infer N>
    ? NumberTuple<N> // Tuples are always fixed-length arrays
    : T extends NumberArrayParamConfig
      ? number[] // Number arrays are always arrays
      : T extends ArrayParamConfig
        ? string[] // String arrays are always arrays
        : T extends NumberParamConfig
          ? T['defaultValue'] extends number
            ? number // Number with default is always a number
            : number | undefined // Number without default can be undefined
          : T extends StringParamConfig
            ? T['defaultValue'] extends string
              ? string // String with default is always a string
              : string | undefined // String without default can be undefined
            : never

// Define result type based on schema
type QueryStateResult<T extends Record<string, ParamConfig>> = {
  [K in keyof T]: ExtractParamType<T[K]>
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: T[K] extends TupleParamConfig<infer N>
    ? (value: NumberTuple<N> | undefined) => void
    : T[K] extends NumberArrayParamConfig
      ? (value: number[] | undefined) => void
      : T[K] extends ArrayParamConfig
        ? (value: string[] | undefined) => void
        : T[K] extends NumberParamConfig
          ? (value: number | undefined) => void
          : (value: string | undefined) => void
}

// Helper functions for number conversion
function parseUrlNumber(value: string | null): number | undefined {
  if (value === null) return undefined
  const parsed = Number(value)
  return !isNaN(parsed) && isFinite(parsed) ? parsed : undefined
}

function numberToUrlString(value: number | undefined): string | undefined {
  if (value === undefined || isNaN(value) || !isFinite(value)) return undefined
  return value.toString()
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
          default(value: string[]): ArrayParamConfig & { defaultValue: string[] } {
            return { ...arrayConfig, defaultValue: value }
          },
        }
      },
      default(value: string): StringParamConfig & { defaultValue: string } {
        return { ...config, defaultValue: value }
      },
    }
  },

  number(): NumberParamBuilder {
    const config: NumberParamConfig = { type: 'singleNumber' }

    return {
      ...config,
      array(): NumberArrayParamBuilder {
        const arrayConfig: NumberArrayParamConfig = { type: 'numberArray' }

        return {
          ...arrayConfig,
          default(value: number[]): NumberArrayParamConfig & { defaultValue: number[] } {
            return { ...arrayConfig, defaultValue: value }
          },
        }
      },
      tuple<N extends number>(size: N): TupleParamBuilder<N> {
        // Validate tuple size
        if (size < 2 || !Number.isInteger(size)) {
          throw new Error('Tuple size must be an integer >= 2')
        }

        const tupleConfig: TupleParamConfig<N> = { type: 'tuple', size }

        return {
          ...tupleConfig,
          default(value: NumberTuple<N>): TupleParamConfig<N> & { defaultValue: NumberTuple<N> } {
            // Type assertion to make TypeScript recognize this is an array
            if ((value as number[]).length !== size) {
              throw new Error(`Default value must be a tuple of exactly ${size} numbers`)
            }
            return { ...tupleConfig, defaultValue: value as NumberTuple<N> }
          },
        }
      },
      default(value: number): NumberParamConfig & { defaultValue: number } {
        return { ...config, defaultValue: value }
      },
    }
  },
}

/**
 * A custom hook for managing URL query parameters with support for string values,
 * number values, arrays, and fixed-length tuples, with chainable configuration.
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
        } else if (config.type === 'numberArray') {
          const arrayDefaults = config.defaultValue as number[]
          if (arrayDefaults.length > 0) {
            needsUpdate = true
            arrayDefaults.forEach((val) => {
              updatedParams.append(key, val.toString())
            })
          }
        } else if (config.type === 'tuple') {
          const tupleDefaults = config.defaultValue as number[]
          if (tupleDefaults.length > 0) {
            needsUpdate = true
            tupleDefaults.forEach((val) => {
              updatedParams.append(key, val.toString())
            })
          }
        } else if (config.type === 'singleNumber') {
          needsUpdate = true
          updatedParams.set(key, (config.defaultValue as number).toString())
        } else {
          needsUpdate = true
          updatedParams.set(key, config.defaultValue as string)
        }
      } else if (config.type === 'tuple' && !searchParams.has(key)) {
        // Special case for tuples without explicit defaults
        // For tuples with no values and no default, use zeros (tuples should never be undefined)
        const size = config.size as number
        needsUpdate = true
        Array(size)
          .fill(0)
          .forEach((val) => {
            updatedParams.append(key, val.toString())
          })
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
        // Handle string array parameters
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
      } else if (config.type === 'numberArray') {
        // Handle number array parameters
        const stringValues = searchParams.getAll(key)
        const numberValues = stringValues
          .map((val) => parseUrlNumber(val))
          .filter((val): val is number => val !== undefined)

        const setNumberArrayValue = (newValue: number[] | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)
          updatedParams.delete(key)

          if (newValue && newValue.length > 0) {
            newValue.forEach((val) => {
              if (!isNaN(val) && isFinite(val)) {
                updatedParams.append(key, val.toString())
              }
            })
          } else if (config.defaultValue && (config.defaultValue as number[]).length > 0) {
            ;(config.defaultValue as number[]).forEach((val) => {
              updatedParams.append(key, val.toString())
            })
          }

          setSearchParams(updatedParams)
        }

        Object.defineProperty(result, key, {
          value: numberValues,
          enumerable: true,
        })

        Object.defineProperty(result, `set${capitalizedKey}`, {
          value: setNumberArrayValue,
          enumerable: true,
        })
      } else if (config.type === 'tuple') {
        // Handle tuple parameters (fixed-length arrays)
        const size = config.size
        const stringValues = searchParams.getAll(key)
        const parsedValues = stringValues
          .map((val) => parseUrlNumber(val))
          .filter((val): val is number => val !== undefined)

        // Create the tuple, ensuring it's always the correct length
        let tupleValue: number[]

        // Type assertion for array length comparison
        if ((parsedValues as number[]).length !== size) {
          // Wrong size in URL - use default or zeros
          tupleValue = config.defaultValue ? [...config.defaultValue] : Array(size).fill(0)
        } else {
          tupleValue = parsedValues
        }

        // Create setter that maintains tuple structure
        const setTupleValue = (newValue: number[] | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)
          updatedParams.delete(key)

          // Use either the new value, default, or zeros - always maintaining tuple size
          let valueToSet: number[]

          if (newValue && (newValue as number[]).length === size) {
            valueToSet = newValue
          } else if (config.defaultValue) {
            valueToSet = [...config.defaultValue]
          } else {
            valueToSet = Array(size).fill(0)
          }

          // Always set exactly 'size' values
          valueToSet.forEach((val) => {
            updatedParams.append(key, val.toString())
          })

          setSearchParams(updatedParams)
        }

        // Use type assertion to convince TypeScript this is a proper tuple
        Object.defineProperty(result, key, {
          value: tupleValue,
          enumerable: true,
        })

        Object.defineProperty(result, `set${capitalizedKey}`, {
          value: setTupleValue,
          enumerable: true,
        })
      } else if (config.type === 'singleNumber') {
        // Handle single number parameters
        const paramValue = searchParams.get(key)
        const numberValue = parseUrlNumber(paramValue)

        // If this parameter has a default and the value is undefined, use the default
        const valueToUse =
          numberValue !== undefined
            ? numberValue
            : config.defaultValue !== undefined
              ? config.defaultValue
              : undefined

        const setNumberValue = (newValue: number | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)

          if (newValue !== undefined && !isNaN(newValue) && isFinite(newValue)) {
            updatedParams.set(key, newValue.toString())
          } else if (config.defaultValue !== undefined) {
            updatedParams.set(key, (config.defaultValue as number).toString())
          } else {
            updatedParams.delete(key)
          }

          setSearchParams(updatedParams)
        }

        Object.defineProperty(result, key, {
          value: valueToUse,
          enumerable: true,
        })

        Object.defineProperty(result, `set${capitalizedKey}`, {
          value: setNumberValue,
          enumerable: true,
        })
      } else {
        // Handle single string parameters
        const paramValue = searchParams.get(key)

        // If this parameter has a default and the value is null, use the default
        const valueToUse =
          paramValue !== null
            ? paramValue
            : config.defaultValue !== undefined
              ? config.defaultValue
              : undefined

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
          value: valueToUse,
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

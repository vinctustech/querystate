import { useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import dayjs, { Dayjs } from 'dayjs'

// String parameter type definitions
interface StringParamConfig {
  type: 'single'
  defaultValue?: string
}

interface ArrayParamConfig {
  type: 'array'
  defaultValue?: string[]
}

// Number parameter type definitions
interface NumberParamConfig {
  type: 'singleNumber'
  defaultValue?: number
}

interface NumberArrayParamConfig {
  type: 'numberArray'
  defaultValue?: number[]
}

// Number tuple config with size parameter
interface TupleParamConfig<N extends number> {
  type: 'tuple'
  size: N
  defaultValue?: number[]
}

// Date parameter type definitions
interface DateParamConfig<T = Date> {
  type: 'date'
  defaultValue?: T
  parse?: (str: string) => T
  serialize?: (date: T) => string
}

interface DateArrayParamConfig<T = Date> {
  type: 'dateArray'
  defaultValue?: T[]
  parse?: (str: string) => T
  serialize?: (date: T) => string
}

interface DateTupleParamConfig<N extends number, T = Date> {
  type: 'dateTuple'
  size: N
  defaultValue?: T[]
  parse?: (str: string) => T
  serialize?: (date: T) => string
}

// Helper type to create numeric tuples of specific length
type NumberTuple<N extends number, T extends number[] = []> = T['length'] extends N
  ? T
  : NumberTuple<N, [...T, number]>

// Helper type to create date tuples of specific length
type DateTuple<N extends number, T = Date, A extends T[] = []> = A['length'] extends N
  ? A
  : DateTuple<N, T, [...A, T]>

// Union of all parameter configs
type ParamConfig =
  | StringParamConfig
  | ArrayParamConfig
  | NumberParamConfig
  | NumberArrayParamConfig
  | TupleParamConfig<number>
  | DateParamConfig<any>
  | DateArrayParamConfig<any>
  | DateTupleParamConfig<number, any>

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

// Date parameter builder interfaces
interface DateParamBuilder<T = Date> extends DateParamConfig<T> {
  array(): DateArrayParamBuilder<T>
  tuple<N extends number>(size: N): DateTupleParamBuilder<N, T>
  default(value: T): DateParamConfig<T> & { defaultValue: T }
}

interface DateArrayParamBuilder<T = Date> extends DateArrayParamConfig<T> {
  default(value: T[]): DateArrayParamConfig<T> & { defaultValue: T[] }
}

interface DateTupleParamBuilder<N extends number, T = Date>
  extends Omit<DateTupleParamConfig<N, T>, 'defaultValue'> {
  default(value: T[]): DateTupleParamConfig<N, T> & { defaultValue: T[] }
}

// Improved helper type for parameter extraction that handles defaults correctly
type ExtractParamType<T extends ParamConfig> =
  T extends DateTupleParamConfig<infer N, infer DT>
    ? DateTuple<N, DT>
    : T extends DateArrayParamConfig<infer DT>
      ? DT[]
      : T extends DateParamConfig<infer DT>
        ? T['defaultValue'] extends DT
          ? DT
          : DT | undefined
        : T extends TupleParamConfig<infer N>
          ? NumberTuple<N>
          : T extends NumberArrayParamConfig
            ? number[]
            : T extends ArrayParamConfig
              ? string[]
              : T extends NumberParamConfig
                ? T['defaultValue'] extends number
                  ? number
                  : number | undefined
                : T extends StringParamConfig
                  ? T['defaultValue'] extends string
                    ? string
                    : string | undefined
                  : never

// Define result type based on schema
type QueryStateResult<T extends Record<string, ParamConfig>> = {
  [K in keyof T]: ExtractParamType<T[K]>
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: T[K] extends DateTupleParamConfig<
    infer N,
    infer DT
  >
    ? (value: DateTuple<N, DT> | undefined) => void
    : T[K] extends DateArrayParamConfig<infer DT>
      ? (value: DT[] | undefined) => void
      : T[K] extends DateParamConfig<infer DT>
        ? (value: DT | undefined) => void
        : T[K] extends TupleParamConfig<infer N>
          ? (value: NumberTuple<N> | undefined) => void
          : T[K] extends NumberArrayParamConfig
            ? (value: number[] | undefined) => void
            : T[K] extends ArrayParamConfig
              ? (value: string[] | undefined) => void
              : T[K] extends NumberParamConfig
                ? (value: number | undefined) => void
                : (value: string | undefined) => void
}

function parseUrlNumber(value: string | null): number | undefined {
  if (value === null) return undefined
  const parsed = Number(value)
  return !isNaN(parsed) && isFinite(parsed) ? parsed : undefined
}

function createDateParam<T = Date>(config?: {
  parse?: (str: string) => T
  serialize?: (date: T) => string
}): DateParamBuilder<T> {
  const dateConfig: DateParamConfig<T> = {
    type: 'date',
    parse: config?.parse || ((str: string) => new Date(str) as unknown as T),
    serialize: config?.serialize || ((date: T) => (date as unknown as Date).toISOString()),
  }

  return {
    ...dateConfig,
    array(): DateArrayParamBuilder<T> {
      const arrayConfig: DateArrayParamConfig<T> = {
        type: 'dateArray',
        parse: dateConfig.parse,
        serialize: dateConfig.serialize,
      }

      return {
        ...arrayConfig,
        default(value: T[]): DateArrayParamConfig<T> & { defaultValue: T[] } {
          return { ...arrayConfig, defaultValue: value }
        },
      }
    },
    tuple<N extends number>(size: N): DateTupleParamBuilder<N, T> {
      if (size < 2 || !Number.isInteger(size)) {
        throw new Error('Tuple size must be an integer >= 2')
      }

      const tupleConfig: DateTupleParamConfig<N, T> = {
        type: 'dateTuple',
        size,
        parse: dateConfig.parse,
        serialize: dateConfig.serialize,
      }

      return {
        ...tupleConfig,
        default(value: T[]): DateTupleParamConfig<N, T> & { defaultValue: T[] } {
          if (value.length !== size) {
            throw new Error(`Default value must be a tuple of exactly ${size} dates`)
          }
          return { ...tupleConfig, defaultValue: value }
        },
      }
    },
    default(value: T): DateParamConfig<T> & { defaultValue: T } {
      return { ...dateConfig, defaultValue: value }
    },
  }
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
  date<T = Date>(config?: {
    parse?: (str: string) => T
    serialize?: (date: T) => string
  }): DateParamBuilder<T> {
    return createDateParam<T>(config)
  },

  dateJs(): DateParamBuilder {
    return createDateParam<Date>()
  },

  dateDayjs(): DateParamBuilder<Dayjs> {
    return createDateParam<Dayjs>({
      parse: (str) => dayjs(str),
      serialize: (date) => date.toISOString(),
    })
  },
}

/**
 * A custom hook for managing URL query parameters with support for string values,
 * number values, arrays, fixed-length tuples, and dates with chainable configuration.
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
          updatedParams.set(key, config.defaultValue.toString())
        } else if (config.type === 'date') {
          needsUpdate = true
          const dateConfig = config as DateParamConfig<any>
          const serialized = dateConfig.serialize
            ? dateConfig.serialize(dateConfig.defaultValue)
            : (dateConfig.defaultValue as unknown as Date).toISOString()
          updatedParams.set(key, serialized)
        } else if (config.type === 'dateArray') {
          const dateArrayConfig = config as DateArrayParamConfig<any>
          const arrayDefaults = dateArrayConfig.defaultValue || []
          if (arrayDefaults.length > 0) {
            needsUpdate = true
            arrayDefaults.forEach((date) => {
              const serialized = dateArrayConfig.serialize
                ? dateArrayConfig.serialize(date)
                : (date as unknown as Date).toISOString()
              updatedParams.append(key, serialized)
            })
          }
        } else if (config.type === 'dateTuple') {
          const dateTupleConfig = config as DateTupleParamConfig<number, any>
          const tupleDefaults = dateTupleConfig.defaultValue || []
          if (tupleDefaults.length > 0) {
            needsUpdate = true
            tupleDefaults.forEach((date) => {
              const serialized = dateTupleConfig.serialize
                ? dateTupleConfig.serialize(date)
                : (date as unknown as Date).toISOString()
              updatedParams.append(key, serialized)
            })
          }
        } else {
          needsUpdate = true
          updatedParams.set(key, config.defaultValue)
        }
      } else if (config.type === 'tuple' && !searchParams.has(key)) {
        // Special case for tuples without explicit defaults
        // For tuples with no values and no default, use zeros (tuples should never be undefined)
        const size = config.size
        needsUpdate = true
        Array(size)
          .fill(0)
          .forEach((val) => {
            updatedParams.append(key, val.toString())
          })
      } else if (config.type === 'dateTuple' && !searchParams.has(key)) {
        // Special case for date tuples without explicit defaults
        // For date tuples with no values and no default, use current date
        const dateTupleConfig = config as DateTupleParamConfig<number, any>
        const size = dateTupleConfig.size
        needsUpdate = true
        Array(size)
          .fill(null)
          .forEach(() => {
            const now = new Date()
            const serialized = dateTupleConfig.serialize
              ? dateTupleConfig.serialize(now as unknown as any)
              : now.toISOString()
            updatedParams.append(key, serialized)
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
      } else if (config.type === 'date') {
        // Handle single date parameter
        const dateConfig = config as DateParamConfig<any>
        const paramValue = searchParams.get(key)

        // Fix: Use the correct type based on the generic parameter
        let dateValue: typeof dateConfig.defaultValue | undefined = undefined

        if (paramValue !== null) {
          dateValue = dateConfig.parse ? dateConfig.parse(paramValue) : new Date(paramValue)
        } else if (dateConfig.defaultValue !== undefined) {
          dateValue = dateConfig.defaultValue
        }

        const setDateValue = (newValue: typeof dateConfig.defaultValue | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)

          if (newValue !== undefined) {
            const serialized = dateConfig.serialize
              ? dateConfig.serialize(newValue)
              : (newValue as unknown as Date).toISOString()
            updatedParams.set(key, serialized)
          } else if (dateConfig.defaultValue !== undefined) {
            const serialized = dateConfig.serialize
              ? dateConfig.serialize(dateConfig.defaultValue)
              : (dateConfig.defaultValue as unknown as Date).toISOString()
            updatedParams.set(key, serialized)
          } else {
            updatedParams.delete(key)
          }

          setSearchParams(updatedParams)
        }

        Object.defineProperty(result, key, {
          value: dateValue,
          enumerable: true,
        })

        Object.defineProperty(result, `set${capitalizedKey}`, {
          value: setDateValue,
          enumerable: true,
        })
      } else if (config.type === 'dateArray') {
        // Handle date array parameter
        const dateArrayConfig = config as DateArrayParamConfig<any>
        const stringValues = searchParams.getAll(key)

        // Fix: Use the correct type for the array elements
        const dateValues = stringValues.map((val) =>
          dateArrayConfig.parse ? dateArrayConfig.parse(val) : new Date(val),
        )

        const setDateArrayValue = (newValue: any[] | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)
          updatedParams.delete(key)

          if (newValue && newValue.length > 0) {
            newValue.forEach((date) => {
              const serialized = dateArrayConfig.serialize
                ? dateArrayConfig.serialize(date)
                : (date as unknown as Date).toISOString()
              updatedParams.append(key, serialized)
            })
          } else if (dateArrayConfig.defaultValue && dateArrayConfig.defaultValue.length > 0) {
            dateArrayConfig.defaultValue.forEach((date) => {
              const serialized = dateArrayConfig.serialize
                ? dateArrayConfig.serialize(date)
                : (date as unknown as Date).toISOString()
              updatedParams.append(key, serialized)
            })
          }

          setSearchParams(updatedParams)
        }

        Object.defineProperty(result, key, {
          value: dateValues,
          enumerable: true,
        })

        Object.defineProperty(result, `set${capitalizedKey}`, {
          value: setDateArrayValue,
          enumerable: true,
        })
      } else if (config.type === 'dateTuple') {
        // Handle date tuple parameter
        const dateTupleConfig = config as DateTupleParamConfig<number, any>
        const size = dateTupleConfig.size
        const stringValues = searchParams.getAll(key)

        // Fix: Use the correct type for the parsed values
        const parsedValues = stringValues.map((val) =>
          dateTupleConfig.parse ? dateTupleConfig.parse(val) : new Date(val),
        )

        // Create the tuple, ensuring it's always the correct length
        // Fix: Use the appropriate type based on the generic parameter
        let tupleValue: any[]

        if (parsedValues.length !== size) {
          // Wrong size in URL - use default or current dates
          tupleValue = dateTupleConfig.defaultValue
            ? [...dateTupleConfig.defaultValue]
            : Array(size)
                .fill(null)
                .map(() =>
                  dateTupleConfig.parse
                    ? dateTupleConfig.parse(new Date().toISOString())
                    : new Date(),
                )
        } else {
          tupleValue = parsedValues
        }

        // Create setter that maintains tuple structure
        const setTupleValue = (newValue: any[] | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)
          updatedParams.delete(key)

          // Use either the new value, default, or current dates - always maintaining tuple size
          let valueToSet: any[]

          if (newValue && newValue.length === size) {
            valueToSet = newValue
          } else if (dateTupleConfig.defaultValue) {
            valueToSet = [...dateTupleConfig.defaultValue]
          } else {
            valueToSet = Array(size)
              .fill(null)
              .map(() =>
                dateTupleConfig.parse
                  ? dateTupleConfig.parse(new Date().toISOString())
                  : new Date(),
              )
          }

          // Always set exactly 'size' values
          valueToSet.forEach((date) => {
            const serialized = dateTupleConfig.serialize
              ? dateTupleConfig.serialize(date)
              : (date as unknown as Date).toISOString()
            updatedParams.append(key, serialized)
          })

          setSearchParams(updatedParams)
        }

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

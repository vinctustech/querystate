// useQueryState.ts
import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'

// Define our schema type
type ParamSchema = {
  [key: string]: {
    type: 'single' | 'array'
  }
}

// Define the return type based on the schema
type QueryStateResult<T extends ParamSchema> = {
  [K in keyof T]: T[K]['type'] extends 'array' ? string[] : string | undefined
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: T[K]['type'] extends 'array'
    ? (value: string[] | undefined) => void
    : (value: string | undefined) => void
}

// Helper type for capitalizing the first letter of a string
type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S

/**
 * A custom hook for managing URL query parameters with support for both
 * single string values and string arrays.
 *
 * Returns values and setters directly with a flattened API:
 * const { param, setParam, arrayParam, setArrayParam } = useQueryState({...})
 *
 * @param schema An object defining the parameters and their types
 * @returns An object with values and setters for each parameter
 */
export function useQueryState<T extends ParamSchema>(schema: T): QueryStateResult<T> {
  const [searchParams, setSearchParams] = useSearchParams()

  // Create the result object
  const result = useMemo(() => {
    const output = {} as QueryStateResult<T>

    // For each parameter in the schema
    Object.entries(schema).forEach(([key, config]) => {
      const capitalizedKey = (key.charAt(0).toUpperCase() + key.slice(1)) as Capitalize<typeof key>

      if (config.type === 'array') {
        // Handle array parameters
        const values = searchParams.getAll(key)
        const value = values.length > 0 ? values : []

        const setValue = (newValue: string[] | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)
          // Remove all instances of this key
          updatedParams.delete(key)

          // Add each value as a separate parameter if newValue exists and has items
          if (newValue && newValue.length > 0) {
            newValue.forEach((val) => {
              updatedParams.append(key, val)
            })
          }

          setSearchParams(updatedParams)
        }

        // Set the value and setter directly on the result object
        output[key as keyof T] = value as any
        output[`set${capitalizedKey}` as keyof QueryStateResult<T>] = setValue as any
      } else {
        // Handle single parameters
        // Return undefined instead of empty string if param doesn't exist
        const paramValue = searchParams.get(key)
        const value = paramValue !== null ? paramValue : undefined

        const setValue = (newValue: string | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)

          if (newValue !== undefined && newValue !== '') {
            updatedParams.set(key, newValue)
          } else {
            updatedParams.delete(key)
          }

          setSearchParams(updatedParams)
        }

        // Set the value and setter directly on the result object
        output[key as keyof T] = value as any
        output[`set${capitalizedKey}` as keyof QueryStateResult<T>] = setValue as any
      }
    })

    return output
  }, [searchParams, setSearchParams, schema])

  return result
}

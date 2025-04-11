// useQueryState.ts
import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'

// Define type literals
type ParamType = 'single' | 'array'
type ParamSchema = {
  [key: string]: ParamType
}

// Helper type for capitalizing the first letter of a string
type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S

// Define the return type based on the schema
type QueryStateResult<T extends ParamSchema> = {
  [K in keyof T]: T[K] extends 'array' ? string[] : string | undefined
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: T[K] extends 'array'
    ? (value: string[] | undefined) => void
    : (value: string | undefined) => void
}

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
  return useMemo(() => {
    // Initialize the result object with explicit typecasting
    const result = {} as QueryStateResult<T>

    // Process each entry in the schema
    Object.entries(schema).forEach(([key, paramType]) => {
      const capitalizedKey = (key.charAt(0).toUpperCase() + key.slice(1)) as Capitalize<
        string & keyof T
      >

      if (paramType === 'array') {
        // Handle array parameters
        const values = searchParams.getAll(key)

        // Create typed value and setter for array type
        const arrayValue = values.length > 0 ? values : []
        const setArrayValue = (newValue: string[] | undefined) => {
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

        // Type-safe assignment using explicit property access
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

        // Create typed value and setter for single type
        const singleValue = paramValue !== null ? paramValue : undefined
        const setSingleValue = (newValue: string | undefined) => {
          const updatedParams = new URLSearchParams(searchParams)

          if (newValue !== undefined && newValue !== '') {
            updatedParams.set(key, newValue)
          } else {
            updatedParams.delete(key)
          }

          setSearchParams(updatedParams)
        }

        // Type-safe assignment using explicit property access
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
  }, [searchParams, setSearchParams, schema])
}

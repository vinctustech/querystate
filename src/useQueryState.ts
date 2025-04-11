// useQueryState.ts
import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

// Define our schema type
type ParamSchema = {
  [key: string]: {
    type: 'single' | 'array'
  }
}

// Define the return type based on the schema
type QueryStateResult<T extends ParamSchema> = {
  [K in keyof T]: T[K]['type'] extends 'array'
    ? {
        value: string[]
        setValue: (value: string[]) => void
      }
    : {
        value: string
        setValue: (value: string) => void
      }
}

/**
 * A custom hook for managing URL query parameters with support for both
 * single string values and string arrays.
 *
 * @param schema An object defining the parameters and their types
 * @returns An object with getters and setters for each parameter
 */
export function useQueryState<T extends ParamSchema>(schema: T): QueryStateResult<T> {
  const [searchParams, setSearchParams] = useSearchParams()

  // Create the result object
  const result = useMemo(() => {
    const output = {} as QueryStateResult<T>

    // For each parameter in the schema
    Object.entries(schema).forEach(([key, config]) => {
      if (config.type === 'array') {
        // Handle array parameters
        const value = searchParams.getAll(key)

        const setValue = (newValue: string[]) => {
          const updatedParams = new URLSearchParams(searchParams)
          // Remove all instances of this key
          updatedParams.delete(key)
          // Add each value as a separate parameter
          newValue.forEach((val) => {
            updatedParams.append(key, val)
          })
          setSearchParams(updatedParams)
        }

        output[key as keyof T] = { value, setValue } as any
      } else {
        // Handle single parameters
        const value = searchParams.get(key) || ''

        const setValue = (newValue: string) => {
          const updatedParams = new URLSearchParams(searchParams)
          if (newValue) {
            updatedParams.set(key, newValue)
          } else {
            updatedParams.delete(key)
          }
          setSearchParams(updatedParams)
        }

        output[key as keyof T] = { value, setValue } as any
      }
    })

    return output
  }, [searchParams, setSearchParams, schema])

  return result
}

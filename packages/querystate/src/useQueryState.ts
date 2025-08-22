import { useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import type { ParamConfig, QueryStateResult } from './types'
import { createHandler } from './handlers'

// Helper type for capitalizing first letter
type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S

/**
 * A custom hook for managing URL query parameters with type-safe builders
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
        const handler = createHandler(config)
        const currentValue = handler.parse(searchParams, key)
        
        // If parsed value is different from expected default, we need to update
        if (JSON.stringify(currentValue) !== JSON.stringify(config.defaultValue)) {
          needsUpdate = true
          handler.serialize(config.defaultValue, updatedParams, key)
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
      const handler = createHandler(config)
      
      // Get current value
      const value = handler.parse(searchParams, key)
      
      // Create setter function
      const setter = handler.createSetter(key, searchParams, setSearchParams)
      
      // Add to result object
      Object.defineProperty(result, key, {
        value,
        enumerable: true,
      })
      
      Object.defineProperty(result, `set${capitalizedKey}`, {
        value: setter,
        enumerable: true,
      })
    })
    
    return result
  }, [searchParams, setSearchParams, schema])
}
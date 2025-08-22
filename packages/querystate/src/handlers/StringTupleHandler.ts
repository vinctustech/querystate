import { ParamHandler } from './base'
import type { StringTupleConfig, StringTuple } from '../types'
import { applyStringConstraints } from '../utils/constraints'
import { parseStringFromUrl, serializeStringToUrl } from '../utils/parsing'

export class StringTupleHandler<N extends number> extends ParamHandler<StringTupleConfig<N>, StringTuple<N>> {
  parse(params: URLSearchParams, key: string): StringTuple<N> {
    const strings = this.getAllFromParams(params, key)
    const size = this.config.size
    
    // Process each string with constraints
    let processedStrings = strings
      .map(str => parseStringFromUrl(str))
      .map(str => applyStringConstraints(str, this.config))
      .filter((str): str is string => str !== undefined)
    
    // Ensure correct tuple size
    if (processedStrings.length !== size) {
      // Use default if available and correct size
      if (this.config.defaultValue && this.config.defaultValue.length === size) {
        return this.config.defaultValue as StringTuple<N>
      }
      
      // Pad or truncate to correct size
      if (processedStrings.length < size) {
        // Pad with empty strings
        while (processedStrings.length < size) {
          processedStrings.push('')
        }
      } else {
        // Truncate to correct size
        processedStrings = processedStrings.slice(0, size)
      }
    }
    
    return processedStrings as StringTuple<N>
  }
  
  serialize(values: StringTuple<N> | undefined, params: URLSearchParams, key: string): void {
    this.deleteFromParams(params, key)
    
    const valuesToSet = values ?? this.config.defaultValue ?? Array(this.config.size).fill('')
    
    // Ensure correct size (shouldn't happen with proper typing, but defensive)
    const constrainedArray = (valuesToSet as string[]).slice(0, this.config.size)
    while (constrainedArray.length < this.config.size) {
      constrainedArray.push('')
    }
    
    constrainedArray.forEach(val => {
      const processed = applyStringConstraints(val, this.config) ?? ''
      this.appendToParams(params, key, serializeStringToUrl(processed))
    })
  }
}
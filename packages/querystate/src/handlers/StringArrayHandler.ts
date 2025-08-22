import { ParamHandler } from './base'
import type { StringArrayConfig } from '../types'
import { applyStringConstraints, applyArrayConstraints } from '../utils/constraints'
import { parseStringFromUrl, serializeStringToUrl } from '../utils/parsing'

export class StringArrayHandler extends ParamHandler<StringArrayConfig, string[]> {
  parse(params: URLSearchParams, key: string): string[] {
    const strings = this.getAllFromParams(params, key)
    
    // Process each string with constraints
    let processedStrings = strings
      .map(str => parseStringFromUrl(str))
      .map(str => applyStringConstraints(str, this.config))
      .filter((str): str is string => str !== undefined)
    
    // Apply array constraints
    return applyArrayConstraints(processedStrings, this.config)
  }
  
  serialize(values: string[] | undefined, params: URLSearchParams, key: string): void {
    this.deleteFromParams(params, key)
    
    const valuesToSet = values ?? this.config.defaultValue ?? []
    const constrainedArray = applyArrayConstraints(valuesToSet, this.config)
    
    constrainedArray.forEach(val => {
      const processed = applyStringConstraints(val, this.config)
      if (processed !== undefined) {
        this.appendToParams(params, key, serializeStringToUrl(processed))
      }
    })
  }
}
import { ParamHandler } from './base'
import type { StringSetConfig } from '../types'
import { applyStringConstraints, applySetConstraints } from '../utils/constraints'
import { parseStringFromUrl, serializeStringToUrl } from '../utils/parsing'

export class StringSetHandler extends ParamHandler<StringSetConfig, string[]> {
  parse(params: URLSearchParams, key: string): string[] {
    const strings = this.getAllFromParams(params, key)
    
    // Process each string with constraints
    let processedStrings = strings
      .map(str => parseStringFromUrl(str))
      .map(str => applyStringConstraints(str, this.config))
      .filter((str): str is string => str !== undefined)
    
    // Apply set constraints (includes deduplication)
    return applySetConstraints(processedStrings, this.config)
  }
  
  serialize(values: string[] | undefined, params: URLSearchParams, key: string): void {
    this.deleteFromParams(params, key)
    
    const valuesToSet = values ?? this.config.defaultValue ?? []
    const constrainedSet = applySetConstraints(valuesToSet, this.config)
    
    constrainedSet.forEach(val => {
      const processed = applyStringConstraints(val, this.config)
      if (processed !== undefined) {
        this.appendToParams(params, key, serializeStringToUrl(processed))
      }
    })
  }
}
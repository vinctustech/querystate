import { ParamHandler } from './base'
import type { StringConfig } from '../types'
import { applyStringConstraints } from '../utils/constraints'
import { parseStringFromUrl, serializeStringToUrl } from '../utils/parsing'

export class StringHandler extends ParamHandler<StringConfig, string | undefined> {
  parse(params: URLSearchParams, key: string): string | undefined {
    const str = this.getFromParams(params, key)
    if (!str) return this.config.defaultValue
    
    const decoded = parseStringFromUrl(str)
    return applyStringConstraints(decoded, this.config)
  }
  
  serialize(value: string | undefined, params: URLSearchParams, key: string): void {
    this.deleteFromParams(params, key)
    
    if (value !== undefined) {
      const processed = applyStringConstraints(value, this.config)
      if (processed !== undefined) {
        this.setInParams(params, key, serializeStringToUrl(processed))
      } else if (this.config.defaultValue !== undefined) {
        this.setInParams(params, key, serializeStringToUrl(this.config.defaultValue))
      }
    } else if (this.config.defaultValue !== undefined) {
      this.setInParams(params, key, serializeStringToUrl(this.config.defaultValue))
    }
  }
}
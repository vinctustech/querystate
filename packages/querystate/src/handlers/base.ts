import type { ParamConfig } from '../types'

// Abstract base handler class
export abstract class ParamHandler<TConfig extends ParamConfig, TValue> {
  constructor(protected config: TConfig) {}
  
  // Common URL parameter access methods
  protected getFromParams(params: URLSearchParams, key: string): string | null {
    return params.get(key)
  }
  
  protected getAllFromParams(params: URLSearchParams, key: string): string[] {
    return params.getAll(key)
  }
  
  protected setInParams(params: URLSearchParams, key: string, value: string): void {
    params.set(key, value)
  }
  
  protected appendToParams(params: URLSearchParams, key: string, value: string): void {
    params.append(key, value)
  }
  
  protected deleteFromParams(params: URLSearchParams, key: string): void {
    params.delete(key)
  }
  
  // Abstract methods that subclasses must implement
  abstract parse(params: URLSearchParams, key: string): TValue
  abstract serialize(value: TValue | undefined, params: URLSearchParams, key: string): void
  
  // Create setter function for this parameter
  createSetter(
    key: string,
    searchParams: URLSearchParams,
    setSearchParams: (params: URLSearchParams) => void
  ): (value: TValue | undefined) => void {
    // Capture 'this' reference to avoid context loss
    const handler = this
    return (value: TValue | undefined) => {
      const updatedParams = new URLSearchParams(searchParams)
      handler.serialize(value, updatedParams, key)
      setSearchParams(updatedParams)
    }
  }
}
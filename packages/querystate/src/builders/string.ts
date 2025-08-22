import type { 
  StringConfig, 
  StringArrayConfig, 
  StringTupleConfig, 
  StringSetConfig,
  StringParamBuilder,
  StringArrayParamBuilder,
  StringTupleParamBuilder,
  StringSetParamBuilder,
  StringTuple
} from '../types'

// Simple approach: builders ARE configs with additional methods
export function createStringBuilder(): StringParamBuilder {
  const createBuilder = (config: StringConfig): StringParamBuilder => {
    return {
      // Config properties
      type: config.type,
      minLength: config.minLength,
      maxLength: config.maxLength,
      lowercase: config.lowercase,
      uppercase: config.uppercase,
      email: config.email,
      url: config.url,
      uuid: config.uuid,
      defaultValue: config.defaultValue,
      
      // Builder methods
      min(length: number): StringParamBuilder {
        return createBuilder({ ...config, minLength: length })
      },
      
      max(length: number): StringParamBuilder {
        return createBuilder({ ...config, maxLength: length })
      },
      
      lowercase(): StringParamBuilder {
        return createBuilder({ ...config, lowercase: true })
      },
      
      uppercase(): StringParamBuilder {
        return createBuilder({ ...config, uppercase: true })
      },
      
      email(): StringParamBuilder {
        return createBuilder({ ...config, email: true })
      },
      
      url(): StringParamBuilder {
        return createBuilder({ ...config, url: true })
      },
      
      uuid(): StringParamBuilder {
        return createBuilder({ ...config, uuid: true })
      },
      
      array(): StringArrayParamBuilder {
        const arrayConfig: StringArrayConfig = {
          type: 'array',
          minLength: config.minLength,
          maxLength: config.maxLength,
          lowercase: config.lowercase,
          uppercase: config.uppercase,
          email: config.email,
          url: config.url,
          uuid: config.uuid,
        }
        return createStringArrayBuilder(arrayConfig)
      },
      
      tuple<N extends number>(size: N): StringTupleParamBuilder<N> {
        const tupleConfig: StringTupleConfig<N> = {
          type: 'stringTuple',
          size,
          minLength: config.minLength,
          maxLength: config.maxLength,
          lowercase: config.lowercase,
          uppercase: config.uppercase,
          email: config.email,
          url: config.url,
          uuid: config.uuid,
        }
        return createStringTupleBuilder(tupleConfig)
      },
      
      set(): StringSetParamBuilder {
        const setConfig: StringSetConfig = {
          type: 'stringSet',
          minLength: config.minLength,
          maxLength: config.maxLength,
          lowercase: config.lowercase,
          uppercase: config.uppercase,
          email: config.email,
          url: config.url,
          uuid: config.uuid,
        }
        return createStringSetBuilder(setConfig)
      },
      
      default(value: string): StringConfig & { defaultValue: string } {
        return createBuilder({ ...config, defaultValue: value }) as StringConfig & { defaultValue: string }
      }
    }
  }
  
  return createBuilder({ type: 'single' })
}

// String array builder
function createStringArrayBuilder(config: StringArrayConfig): StringArrayParamBuilder {
  const createBuilder = (config: StringArrayConfig): StringArrayParamBuilder => {
    return {
      // Config properties
      type: config.type,
      minLength: config.minLength,
      maxLength: config.maxLength,
      lowercase: config.lowercase,
      uppercase: config.uppercase,
      email: config.email,
      url: config.url,
      uuid: config.uuid,
      defaultValue: config.defaultValue,
      min: config.min,
      max: config.max,
      
      // Builder methods
      min(constraint: number): StringArrayParamBuilder {
        return createBuilder({ ...config, min: constraint })
      },
      
      max(constraint: number): StringArrayParamBuilder {
        return createBuilder({ ...config, max: constraint })
      },
      
      lowercase(): StringArrayParamBuilder {
        return createBuilder({ ...config, lowercase: true })
      },
      
      uppercase(): StringArrayParamBuilder {
        return createBuilder({ ...config, uppercase: true })
      },
      
      email(): StringArrayParamBuilder {
        return createBuilder({ ...config, email: true })
      },
      
      url(): StringArrayParamBuilder {
        return createBuilder({ ...config, url: true })
      },
      
      uuid(): StringArrayParamBuilder {
        return createBuilder({ ...config, uuid: true })
      },
      
      default(value: string[]): StringArrayConfig & { defaultValue: string[] } {
        return createBuilder({ ...config, defaultValue: value }) as StringArrayConfig & { defaultValue: string[] }
      }
    }
  }
  
  return createBuilder(config)
}

// String tuple builder
function createStringTupleBuilder<N extends number>(config: StringTupleConfig<N>): StringTupleParamBuilder<N> {
  const createBuilder = (config: StringTupleConfig<N>): StringTupleParamBuilder<N> => {
    return {
      // Config properties  
      type: config.type,
      size: config.size,
      minLength: config.minLength,
      maxLength: config.maxLength,
      lowercase: config.lowercase,
      uppercase: config.uppercase,
      email: config.email,
      url: config.url,
      uuid: config.uuid,
      defaultValue: config.defaultValue,
      
      // Builder methods
      min(length: number): StringTupleParamBuilder<N> {
        return createBuilder({ ...config, minLength: length })
      },
      
      max(length: number): StringTupleParamBuilder<N> {
        return createBuilder({ ...config, maxLength: length })
      },
      
      lowercase(): StringTupleParamBuilder<N> {
        return createBuilder({ ...config, lowercase: true })
      },
      
      uppercase(): StringTupleParamBuilder<N> {
        return createBuilder({ ...config, uppercase: true })
      },
      
      email(): StringTupleParamBuilder<N> {
        return createBuilder({ ...config, email: true })
      },
      
      url(): StringTupleParamBuilder<N> {
        return createBuilder({ ...config, url: true })
      },
      
      uuid(): StringTupleParamBuilder<N> {
        return createBuilder({ ...config, uuid: true })
      },
      
      default(value: StringTuple<N>): StringTupleConfig<N> & { defaultValue: StringTuple<N> } {
        return createBuilder({ ...config, defaultValue: value }) as StringTupleConfig<N> & { defaultValue: StringTuple<N> }
      }
    }
  }
  
  return createBuilder(config)
}

// String set builder
function createStringSetBuilder(config: StringSetConfig): StringSetParamBuilder {
  const createBuilder = (config: StringSetConfig): StringSetParamBuilder => {
    return {
      // Config properties
      type: config.type,
      minLength: config.minLength,
      maxLength: config.maxLength,
      lowercase: config.lowercase,
      uppercase: config.uppercase,
      email: config.email,
      url: config.url,
      uuid: config.uuid,
      defaultValue: config.defaultValue,
      min: config.min,
      max: config.max,
      
      // Builder methods
      min(constraint: number): StringSetParamBuilder {
        return createBuilder({ ...config, min: constraint })
      },
      
      max(constraint: number): StringSetParamBuilder {
        return createBuilder({ ...config, max: constraint })
      },
      
      lowercase(): StringSetParamBuilder {
        return createBuilder({ ...config, lowercase: true })
      },
      
      uppercase(): StringSetParamBuilder {
        return createBuilder({ ...config, uppercase: true })
      },
      
      email(): StringSetParamBuilder {
        return createBuilder({ ...config, email: true })
      },
      
      url(): StringSetParamBuilder {
        return createBuilder({ ...config, url: true })
      },
      
      uuid(): StringSetParamBuilder {
        return createBuilder({ ...config, uuid: true })
      },
      
      default(value: string[]): StringSetConfig & { defaultValue: string[] } {
        const unique = [...new Set(value)]
        return createBuilder({ ...config, defaultValue: unique }) as StringSetConfig & { defaultValue: string[] }
      }
    }
  }
  
  return createBuilder(config)
}
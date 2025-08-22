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

// String parameter builder implementation
export function createStringBuilder(): StringParamBuilder {
  const config: StringConfig = { type: 'single' }
  
  const builder: StringParamBuilder = {
    type: 'single',
    
    min(length: number): StringParamBuilder {
      const newConfig = { ...config, minLength: length }
      return createStringBuilderWithConfig(newConfig)
    },
    
    max(length: number): StringParamBuilder {
      const newConfig = { ...config, maxLength: length }
      return createStringBuilderWithConfig(newConfig)
    },
    
    lowercase(): StringParamBuilder {
      const newConfig = { ...config, lowercase: true }
      return createStringBuilderWithConfig(newConfig)
    },
    
    uppercase(): StringParamBuilder {
      const newConfig = { ...config, uppercase: true }
      return createStringBuilderWithConfig(newConfig)
    },
    
    email(): StringParamBuilder {
      const newConfig = { ...config, email: true }
      return createStringBuilderWithConfig(newConfig)
    },
    
    url(): StringParamBuilder {
      const newConfig = { ...config, url: true }
      return createStringBuilderWithConfig(newConfig)
    },
    
    uuid(): StringParamBuilder {
      const newConfig = { ...config, uuid: true }
      return createStringBuilderWithConfig(newConfig)
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
      if (size < 1 || !Number.isInteger(size)) {
        throw new Error('Tuple size must be a positive integer')
      }
      
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
      // Validate default against constraints
      if (config.minLength && value.length < config.minLength) {
        throw new Error(`Default value "${value}" violates minLength(${config.minLength}) constraint`)
      }
      if (config.maxLength && value.length > config.maxLength) {
        throw new Error(`Default value "${value}" violates maxLength(${config.maxLength}) constraint`)
      }
      
      return { ...config, defaultValue: value }
    }
  }
  
  return builder
}

// Helper to create builder with existing config
function createStringBuilderWithConfig(existingConfig: StringConfig): StringParamBuilder {
  const builder = createStringBuilder()
  // Copy config properties to the builder (but don't overwrite methods)
  builder.type = existingConfig.type
  if (existingConfig.minLength !== undefined) (builder as any).minLength = existingConfig.minLength
  if (existingConfig.maxLength !== undefined) (builder as any).maxLength = existingConfig.maxLength
  if (existingConfig.lowercase !== undefined) (builder as any).lowercase_value = existingConfig.lowercase
  if (existingConfig.uppercase !== undefined) (builder as any).uppercase_value = existingConfig.uppercase
  if (existingConfig.email !== undefined) (builder as any).email_value = existingConfig.email
  if (existingConfig.url !== undefined) (builder as any).url_value = existingConfig.url
  if (existingConfig.uuid !== undefined) (builder as any).uuid_value = existingConfig.uuid
  if (existingConfig.defaultValue !== undefined) (builder as any).defaultValue = existingConfig.defaultValue
  return builder
}

// String array builder
function createStringArrayBuilder(config: StringArrayConfig): StringArrayParamBuilder {
  return {
    type: 'array',
    
    min(constraint: number): StringArrayParamBuilder {
      // Since we're already in array context, this should be array length
      const newConfig = { ...config, min: constraint }
      return createStringArrayBuilder(newConfig)
    },
    
    max(constraint: number): StringArrayParamBuilder {
      const newConfig = { ...config, max: constraint }
      return createStringArrayBuilder(newConfig)
    },
    
    lowercase(): StringArrayParamBuilder {
      const newConfig = { ...config, lowercase: true }
      return createStringArrayBuilder(newConfig)
    },
    
    uppercase(): StringArrayParamBuilder {
      const newConfig = { ...config, uppercase: true }
      return createStringArrayBuilder(newConfig)
    },
    
    email(): StringArrayParamBuilder {
      const newConfig = { ...config, email: true }
      return createStringArrayBuilder(newConfig)
    },
    
    url(): StringArrayParamBuilder {
      const newConfig = { ...config, url: true }
      return createStringArrayBuilder(newConfig)
    },
    
    uuid(): StringArrayParamBuilder {
      const newConfig = { ...config, uuid: true }
      return createStringArrayBuilder(newConfig)
    },
    
    default(value: string[]): StringArrayConfig & { defaultValue: string[] } {
      // Validate default against constraints
      if (config.min && value.length < config.min) {
        throw new Error(`Default array length ${value.length} violates min(${config.min}) constraint`)
      }
      if (config.max && value.length > config.max) {
        throw new Error(`Default array length ${value.length} violates max(${config.max}) constraint`)
      }
      
      return { ...config, defaultValue: value }
    }
  }
}

// String tuple builder
function createStringTupleBuilder<N extends number>(config: StringTupleConfig<N>): StringTupleParamBuilder<N> {
  return {
    type: 'stringTuple',
    size: config.size,
    
    min(length: number): StringTupleParamBuilder<N> {
      // For tuples, min/max always refers to string length, not tuple size
      const newConfig = { ...config, minLength: length }
      return createStringTupleBuilder(newConfig)
    },
    
    max(length: number): StringTupleParamBuilder<N> {
      const newConfig = { ...config, maxLength: length }
      return createStringTupleBuilder(newConfig)
    },
    
    lowercase(): StringTupleParamBuilder<N> {
      const newConfig = { ...config, lowercase: true }
      return createStringTupleBuilder(newConfig)
    },
    
    uppercase(): StringTupleParamBuilder<N> {
      const newConfig = { ...config, uppercase: true }
      return createStringTupleBuilder(newConfig)
    },
    
    email(): StringTupleParamBuilder<N> {
      const newConfig = { ...config, email: true }
      return createStringTupleBuilder(newConfig)
    },
    
    url(): StringTupleParamBuilder<N> {
      const newConfig = { ...config, url: true }
      return createStringTupleBuilder(newConfig)
    },
    
    uuid(): StringTupleParamBuilder<N> {
      const newConfig = { ...config, uuid: true }
      return createStringTupleBuilder(newConfig)
    },
    
    default(value: StringTuple<N>): StringTupleConfig<N> & { defaultValue: StringTuple<N> } {
      // Validate tuple size
      if ((value as string[]).length !== config.size) {
        throw new Error(`Default tuple must have exactly ${config.size} elements, got ${(value as string[]).length}`)
      }
      
      return { ...config, defaultValue: value }
    }
  }
}

// String set builder
function createStringSetBuilder(config: StringSetConfig): StringSetParamBuilder {
  return {
    type: 'stringSet',
    
    min(constraint: number): StringSetParamBuilder {
      // For sets, min/max refers to set size, not string length
      const newConfig = { ...config, min: constraint }
      return createStringSetBuilder(newConfig)
    },
    
    max(constraint: number): StringSetParamBuilder {
      const newConfig = { ...config, max: constraint }
      return createStringSetBuilder(newConfig)
    },
    
    lowercase(): StringSetParamBuilder {
      const newConfig = { ...config, lowercase: true }
      return createStringSetBuilder(newConfig)
    },
    
    uppercase(): StringSetParamBuilder {
      const newConfig = { ...config, uppercase: true }
      return createStringSetBuilder(newConfig)
    },
    
    email(): StringSetParamBuilder {
      const newConfig = { ...config, email: true }
      return createStringSetBuilder(newConfig)
    },
    
    url(): StringSetParamBuilder {
      const newConfig = { ...config, url: true }
      return createStringSetBuilder(newConfig)
    },
    
    uuid(): StringSetParamBuilder {
      const newConfig = { ...config, uuid: true }
      return createStringSetBuilder(newConfig)
    },
    
    default(value: string[]): StringSetConfig & { defaultValue: string[] } {
      // Remove duplicates from default
      const unique = [...new Set(value)]
      
      // Validate set size
      if (config.min && unique.length < config.min) {
        throw new Error(`Default set size ${unique.length} violates min(${config.min}) constraint`)
      }
      if (config.max && unique.length > config.max) {
        throw new Error(`Default set size ${unique.length} violates max(${config.max}) constraint`)
      }
      
      return { ...config, defaultValue: unique }
    }
  }
}
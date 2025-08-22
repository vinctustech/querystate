// Parameter configuration types
export interface BaseConfig {
  defaultValue?: any
}

export interface StringConfig extends BaseConfig {
  type: 'single'
  minLength?: number
  maxLength?: number
  lowercase?: boolean
  uppercase?: boolean
  email?: boolean
  url?: boolean
  uuid?: boolean
  defaultValue?: string
}

export interface StringArrayConfig extends BaseConfig {
  type: 'array'
  minLength?: number  // Each string's character length constraints
  maxLength?: number
  lowercase?: boolean
  uppercase?: boolean
  email?: boolean
  url?: boolean
  uuid?: boolean
  min?: number        // Array length constraints
  max?: number
  defaultValue?: string[]
}

export interface StringTupleConfig<N extends number> extends BaseConfig {
  type: 'stringTuple'
  size: N
  minLength?: number  // Each string's character length constraints
  maxLength?: number
  lowercase?: boolean
  uppercase?: boolean
  email?: boolean
  url?: boolean
  uuid?: boolean
  defaultValue?: string[]
}

export interface StringSetConfig extends BaseConfig {
  type: 'stringSet'
  minLength?: number  // Each string's character length constraints
  maxLength?: number
  lowercase?: boolean
  uppercase?: boolean
  email?: boolean
  url?: boolean
  uuid?: boolean
  min?: number        // Set size constraints
  max?: number
  defaultValue?: string[]
}

// Union of all parameter configs (will expand as we add more types)
export type ParamConfig = 
  | StringConfig
  | StringArrayConfig
  | StringTupleConfig<number>
  | StringSetConfig
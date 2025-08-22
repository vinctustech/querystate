import type { StringConfig, StringArrayConfig, StringTupleConfig, StringSetConfig } from './configs'
import type { StringTuple } from './tuples'

// String parameter builder interfaces
export interface StringParamBuilder extends StringConfig {
  min(length: number): StringParamBuilder
  max(length: number): StringParamBuilder
  lowercase(): StringParamBuilder
  uppercase(): StringParamBuilder
  email(): StringParamBuilder
  url(): StringParamBuilder
  uuid(): StringParamBuilder
  array(): StringArrayParamBuilder
  tuple<N extends number>(size: N): StringTupleParamBuilder<N>
  set(): StringSetParamBuilder
  default(value: string): StringConfig & { defaultValue: string }
}

export interface StringArrayParamBuilder extends StringArrayConfig {
  min(constraint: number): StringArrayParamBuilder  // Overloaded - could be length or item count
  max(constraint: number): StringArrayParamBuilder  // Overloaded - could be length or item count
  lowercase(): StringArrayParamBuilder
  uppercase(): StringArrayParamBuilder
  email(): StringArrayParamBuilder
  url(): StringArrayParamBuilder
  uuid(): StringArrayParamBuilder
  default(value: string[]): StringArrayConfig & { defaultValue: string[] }
}

export interface StringTupleParamBuilder<N extends number> extends StringTupleConfig<N> {
  min(length: number): StringTupleParamBuilder<N>   // String character length only
  max(length: number): StringTupleParamBuilder<N>   // String character length only
  lowercase(): StringTupleParamBuilder<N>
  uppercase(): StringTupleParamBuilder<N>
  email(): StringTupleParamBuilder<N>
  url(): StringTupleParamBuilder<N>
  uuid(): StringTupleParamBuilder<N>
  default(value: StringTuple<N>): StringTupleConfig<N> & { defaultValue: StringTuple<N> }
}

export interface StringSetParamBuilder extends StringSetConfig {
  min(constraint: number): StringSetParamBuilder    // Overloaded - could be length or item count
  max(constraint: number): StringSetParamBuilder    // Overloaded - could be length or item count
  lowercase(): StringSetParamBuilder
  uppercase(): StringSetParamBuilder
  email(): StringSetParamBuilder
  url(): StringSetParamBuilder
  uuid(): StringSetParamBuilder
  default(value: string[]): StringSetConfig & { defaultValue: string[] }
}
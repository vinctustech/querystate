import type { ParamConfig, StringConfig, StringArrayConfig, StringTupleConfig, StringSetConfig } from './configs'
import type { StringTuple } from './tuples'

// Helper type for capitalizing first letter
type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S

// Helper type for parameter extraction
type ExtractParamType<T extends ParamConfig> =
  T extends StringSetConfig
    ? string[]  // Sets are represented as arrays to components
    : T extends StringTupleConfig<infer N>
      ? StringTuple<N>
      : T extends StringArrayConfig
        ? string[]
        : T extends StringConfig
          ? T['defaultValue'] extends string
            ? string
            : string | undefined
          : never

// Define result type based on schema
export type QueryStateResult<T extends Record<string, ParamConfig>> = {
  [K in keyof T]: ExtractParamType<T[K]>
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: T[K] extends StringSetConfig
    ? (value: string[] | undefined) => void
    : T[K] extends StringTupleConfig<infer N>
      ? (value: StringTuple<N> | undefined) => void
      : T[K] extends StringArrayConfig
        ? (value: string[] | undefined) => void
        : (value: string | undefined) => void
}
// Helper type to create string tuples of specific length
export type StringTuple<N extends number, T extends string[] = []> = T['length'] extends N
  ? T
  : StringTuple<N, [...T, string]>
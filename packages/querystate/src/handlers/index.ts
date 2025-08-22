// Handler registry
import { StringHandler } from './StringHandler'
import { StringArrayHandler } from './StringArrayHandler'
import { StringTupleHandler } from './StringTupleHandler'
import { StringSetHandler } from './StringSetHandler'
import type { ParamConfig } from '../types'
import { ParamHandler } from './base'

export function createHandler(config: ParamConfig): ParamHandler<any, any> {
  switch (config.type) {
    case 'single':
      return new StringHandler(config)
    case 'array':
      return new StringArrayHandler(config)
    case 'stringTuple':
      return new StringTupleHandler(config)
    case 'stringSet':
      return new StringSetHandler(config)
    default:
      // @ts-ignore - exhaustiveness check
      throw new Error(`Unknown parameter type: ${config.type}`)
  }
}
import { createStringBuilder } from './string'
import type { StringParamBuilder } from '../types'

// Main queryState API object
export const queryState = {
  string(): StringParamBuilder {
    return createStringBuilder()
  }
}
import { row, validateType } from '../types'

export interface product extends row {
  id?: string
  name: string
  price: number
  category?: string
}

// According to this check body.
export const productTemplate: validateType = {
  name: {
    type: 'string'
  },
  price: {
    type: 'number',
    max: 1000,
    min: 1
  },
  category: {
    type: 'string',
    optional: true
  }
}

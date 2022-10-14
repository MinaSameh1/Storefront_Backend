import { validateType } from '../types'

export const userTemplate: validateType = {
  username: {
    type: 'string'
  },
  firstname: {
    type: 'string'
  },
  lastname: {
    type: 'string'
  },
  pass: {
    type: 'string',
    min: 6,
    max: 16
  }
}

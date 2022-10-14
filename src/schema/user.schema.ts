import { validateType } from '../types'

export const userLoginTemplate: validateType = {
  username: {
    type: 'string'
  },
  pass: {
    type: 'string',
    min: 6,
    max: 16
  }
}

export const userTemplate: validateType = {
  ...userLoginTemplate,
  firstname: {
    type: 'string'
  },
  lastname: {
    type: 'string'
  }
}

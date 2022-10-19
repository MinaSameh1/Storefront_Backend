import { validateType } from '../types'

export const orderTemplate: validateType = {
  user_id: { type: 'string' },
  order_status: {
    type: 'boolean',
    default: false
  }
}

export const orderItemTemplate: validateType = {
  product_id: { type: 'string' },
  quantity: { type: 'number', default: 1 }
}

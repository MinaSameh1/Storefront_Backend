import { Order, StoreUser } from '../../types'

export function generateOrder(
  user_id: Required<StoreUser['id']>,
  order_status = false
): Order {
  return {
    user_id: user_id ?? '',
    order_status
  }
}

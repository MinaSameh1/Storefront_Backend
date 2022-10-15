import { Order, OrderItem } from '../types'
import { query } from '../utils'

export class orderItemModel {
  showById(id: Required<Pick<Order, 'id'>>) {
    return query('SELECT * FROM order_item WHERE order_id = $1', [id])
  }

  async create(orderItem: OrderItem) {
    const result = await query('SELECT * FROM insert_order_item($1, $2, $3)', [
      orderItem.orderId,
      orderItem.productId,
      orderItem.quantity
    ])
    return result.rows[0]
  }

  async update({
    quantity,
    orderId
  }: Required<Pick<OrderItem, 'quantity' | 'orderId'>>) {
    // Only update quantity!
    const result = await query(
      'UPDATE order_item SET quantity = $1 WHERE order_id = $2 RETURNING *',
      [quantity, orderId]
    )
    return result.rows[0]
  }
}

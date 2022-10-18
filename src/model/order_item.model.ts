import { QueryResult } from 'pg'
import { Order, OrderItem } from '../types'
import { query } from '../utils'

export class orderItemModel {
  async indexByOrderId(
    id: Required<NonNullable<Order['id']>>
  ): Promise<QueryResult<OrderItem>['rows']> {
    const result = await query('SELECT * FROM order_item WHERE order_id = $1', [
      id
    ])
    return result.rows
  }

  async create(
    orderItem: OrderItem
  ): Promise<QueryResult<OrderItem>['rows'][0]> {
    const result = await query('SELECT * FROM insert_order_item($1, $2, $3)', [
      orderItem.order_id,
      orderItem.product_id,
      orderItem.quantity
    ])
    return result.rows[0]
  }

  async showByOrderIdAndProductId(
    orderItem: Omit<OrderItem, 'quantity'>
  ): Promise<QueryResult<OrderItem>['rows'][0]> {
    const result = await query(
      'SELECT * FROM order_item WHERE order_id = $1 AND product_id = $2',
      [orderItem.order_id, orderItem.product_id]
    )
    return result.rows[0]
  }

  async update({
    quantity,
    order_id,
    product_id
  }: Required<NonNullable<OrderItem>>): Promise<
    QueryResult<OrderItem>['rows'][0]
  > {
    // Only update quantity!
    const result = await query(
      'UPDATE order_item SET quantity = $1 WHERE order_id = $2 AND product_id = $3 RETURNING *',
      [quantity, order_id, product_id]
    )
    return result.rows[0]
  }
}

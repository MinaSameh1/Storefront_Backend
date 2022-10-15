import {
  Order,
  StoreUser,
  UpdateOrderParams,
  UpdateOrderStatusPraram,
  UpdateOrderAmountParam
} from '../types'
import { query } from '../utils'
import { QueryResult } from 'pg'

export class orderModel {
  // TODO: Maybe move the return type to types file, used it a lot.
  async create(order: Order): Promise<QueryResult<Order>['rows'][0]> {
    const result = await query('SELECT * FROM insert_order($1, $2, $3)', [
      order.user_id,
      order.amount_of_unique_items,
      order.order_status
    ])
    return result.rows[0]
  }

  async showById(id: Required<Pick<Order, 'id'>>) {
    const result = await query('SELECT * FROM orders WHERE id = $1', [id])
    return result.rows[0]
  }

  private async getOrdersByUserAndStatus(
    id: Required<Pick<StoreUser, 'id'>>,
    status: Required<Order['order_status']>
  ): Promise<QueryResult<StoreUser>['rows'][0]> {
    const result = await query(
      'SELECT * FROM orders WHERE user_id = $1 AND order_status=$2',
      [id, status]
    )
    return result.rows[0]
  }

  getActiveOrderByUser(
    id: Required<Pick<StoreUser, 'id'>>
  ): Promise<QueryResult<StoreUser>['rows'][0]> {
    return this.getOrdersByUserAndStatus(id, false)
  }

  getInactiveOrderByUser(
    id: Required<Pick<StoreUser, 'id'>>
  ): Promise<QueryResult<StoreUser>['rows'][0]> {
    return this.getOrdersByUserAndStatus(id, true)
  }

  index(limit = 20, offset = 0): Promise<QueryResult<Order>> {
    return query('SELECT * FROM products orders $1 OFFSET $2', [limit, offset])
  }

  //// Method overloads
  /**
   * @description Represents a book
   * @constructor
   * @param {string} user_id - Id of the user in the order we want to update
   * @param {string} order_status - status of the order
   */
  async update({
    // eslint-disable-next-line no-unused-vars
    user_id,
    // eslint-disable-next-line no-unused-vars
    order_status
  }: UpdateOrderStatusPraram): Promise<QueryResult<Order>['rows'][0]>
  async update({
    // eslint-disable-next-line no-unused-vars
    user_id,
    // eslint-disable-next-line no-unused-vars
    amount_of_unique_items
  }: UpdateOrderAmountParam): Promise<QueryResult<Order>['rows'][0]>

  async update({
    // order_id, NOTE: Do we need the OrderId? we will only have one active order per user anyways
    user_id,
    amount_of_unique_items,
    order_status
  }: UpdateOrderParams): Promise<QueryResult<Order>['rows'][0]> {
    if (amount_of_unique_items) {
      // Branch A
      const result = await query(
        'UPDATE orders SET amount_of_unique_items = $1 WHERE user_id = $2 AND order_status = TRUE RETURNING *',
        [amount_of_unique_items, user_id]
      )

      return result.rows[0]
    }
    if (order_status) {
      // Branch B
      const result = await query(
        'UPDATE orders SET order_status = $1 WHERE user_id = $2 AND order_status = TRUE RETURNING *',
        [order_status, user_id]
      )

      return result.rows[0]
    }
    throw Error('Wrong params passed to updateOrder!')
  }

  updateOrderStatus(
    orderInfoToUpdate: UpdateOrderStatusPraram
  ): Promise<QueryResult<Order>['rows'][0]> {
    return this.update(orderInfoToUpdate)
  }
}

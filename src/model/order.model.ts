import {
  Order,
  StoreUser,
  UpdateOrderRequireId,
  UpdateOrderRequireUserid,
  UpdateOrderStatusParams
} from '../types'
import { query } from '../utils'
import { QueryResult } from 'pg'

export class orderModel {
  async create(order: Order): Promise<QueryResult<Order>['rows'][0]> {
    const result = await query('SELECT * FROM insert_order($1, $2)', [
      order.user_id,
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
   * @description Updates order's order_Status (MUST supply user_id)
   * @param {string} user_id - Id of the user in the order we want to update
   */
  async update({
    // eslint-disable-next-line no-unused-vars
    user_id
  }: UpdateOrderRequireUserid): Promise<QueryResult<Order>['rows'][0]>

  /**
   * @description Updates order's order_Status (MUST supply id)
   * @param {string} id - Id of the order we want to update
   */
  async update({
    // eslint-disable-next-line no-unused-vars
    id
  }: UpdateOrderRequireId): Promise<QueryResult<Order>['rows'][0]>

  async update({
    id,
    user_id
  }: UpdateOrderStatusParams): Promise<QueryResult<Order>['rows'][0]> {
    let where = 'id'
    if (user_id) {
      where = 'user_id'
    }
    const result = await query(
      `UPDATE orders SET order_status = TRUE WHERE ${where} = $2 AND order_status = FALSE RETURNING *`,
      [id ?? user_id]
    )

    return result.rows[0]
  }

  updateOrderStatusUsingUserId(
    userId: UpdateOrderRequireUserid
  ): Promise<QueryResult<Order>['rows'][0]> {
    return this.update(userId)
  }

  updateOrderStatusUsingOrderId(
    id: UpdateOrderRequireId
  ): Promise<QueryResult<Order>['rows'][0]> {
    return this.update(id)
  }
}

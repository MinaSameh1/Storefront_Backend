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

  async showById(
    id: Required<NonNullable<Order['id']>>
  ): Promise<QueryResult<Order>['rows'][0]> {
    const result = await query('SELECT * FROM orders WHERE id = $1', [id])
    return result.rows[0]
  }

  private async getOrdersByUserAndStatus(
    user_id: Required<StoreUser['id']>,
    status: Required<Order['order_status']>
  ): Promise<QueryResult<Order>['rows']> {
    const result = await query(
      'SELECT * FROM orders WHERE user_id = $1 AND order_status = $2',
      [user_id, status]
    )
    return result.rows
  }

  async getActiveOrderByUser(
    id: Required<NonNullable<StoreUser['id']>>
  ): Promise<QueryResult<Order>['rows'][0]> {
    const result = await this.getOrdersByUserAndStatus(id, false)
    return result[0]
  }

  getCompletedOrdersByUser(
    id: Required<StoreUser['id']>
  ): Promise<QueryResult<Order>['rows']> {
    return this.getOrdersByUserAndStatus(id, true)
  }

  async index(): Promise<QueryResult<Order>['rows']> {
    const result = await query('SELECT * FROM orders', [])
    return result.rows
  }

  //// Method overloads
  /**
   * @description Updates order's order_Status (MUST supply user_id)
   * @param {string} user_id - Id of the user in the order we want to update
   */
  private async update({
    // eslint-disable-next-line no-unused-vars
    user_id
  }: UpdateOrderRequireUserid): Promise<QueryResult<Order>['rows'][0]>

  /**
   * @description Updates order's order_Status (MUST supply id)
   * @param {string} id - Id of the order we want to update
   */
  private async update({
    // eslint-disable-next-line no-unused-vars
    id
  }: UpdateOrderRequireId): Promise<QueryResult<Order>['rows'][0]>

  private async update({
    id,
    user_id
  }: UpdateOrderStatusParams): Promise<QueryResult<Order>['rows'][0]> {
    let where = 'id'
    if (user_id) {
      where = 'user_id'
    }
    const result = await query(
      `UPDATE orders SET order_status = TRUE WHERE ${where} = $1 AND order_status = FALSE RETURNING *`,
      [id ?? user_id]
    )

    return result.rows[0]
  }

  updateOrderStatusUsingUserId(
    user_id: UpdateOrderRequireUserid
  ): Promise<QueryResult<Order>['rows'][0]> {
    return this.update(user_id)
  }

  updateOrderStatusUsingOrderId(
    id: UpdateOrderRequireId
  ): Promise<QueryResult<Order>['rows'][0]> {
    return this.update(id)
  }
}

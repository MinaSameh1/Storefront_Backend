import { row } from './'

export interface Order extends row {
  id?: string
  user_id: string
  order_status: boolean
}

export type UpdateOrderRequireId = Required<Pick<Order, 'id'>> & {
  user_id?: never
}

export type UpdateOrderRequireUserid = Required<Pick<Order, 'user_id'>> & {
  id?: never
}

/*
 * @description The goal of this is to prevent us from updating the order
 * in both the status and amount at THE SAME *TIME*, I believe that you should
 * only update the order status OR amount not both at the same time!
 */

export type UpdateOrderStatusParams =
  | UpdateOrderRequireId
  | UpdateOrderRequireUserid

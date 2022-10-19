import { Item, row } from './'

export interface Order extends row {
  id?: string
  user_id: string
  order_status: boolean
}

export interface OrderAndItems extends Order {
  items: Array<Item>
}

export type UpdateOrderRequireId = Required<Pick<Order, 'id'>> & {
  user_id?: never
}

export type UpdateOrderRequireUserid = Required<Pick<Order, 'user_id'>> & {
  id?: never
}

/*
 * @description Only allow us to update using userId or OrderId, but not both at the same time.
 */
export type UpdateOrderStatusParams =
  | UpdateOrderRequireId
  | UpdateOrderRequireUserid

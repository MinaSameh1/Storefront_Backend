import { row } from './'

export interface Order extends row {
  id?: string
  user_id: string
  amount_of_unique_items: number
  order_status: boolean
}

// Only update the amount or status but not both.
type UpdateOrderRequireParams<
  T extends keyof Order,
  K extends keyof Order
> = Required<Pick<Order, 'user_id' | T>> & {
  // eslint-disable-next-line no-unused-vars
  [P in keyof Pick<Order, K>]?: never
}

export type UpdateOrderAmountParam = UpdateOrderRequireParams<
  'amount_of_unique_items', // Required
  'order_status' // Never
>
export type UpdateOrderStatusPraram = UpdateOrderRequireParams<
  'order_status',
  'amount_of_unique_items'
>

export type UpdateOrderParams = UpdateOrderAmountParam | UpdateOrderStatusPraram

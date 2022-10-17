import { Order, Product, row } from './'

export interface OrderItem extends row {
  order_id: Order['id']
  product_id: Product['id']
  quantity: number
}

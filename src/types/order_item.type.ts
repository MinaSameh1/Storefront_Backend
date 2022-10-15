import { Order, Product, row } from './'

export interface OrderItem extends row {
  orderId: Order['id']
  productId: Product['id']
  quantity: number
}

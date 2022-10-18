import {
  orderItemModel as OrderItemModel,
  orderModel as OrderModel
} from '../model'
import { Order, OrderItem } from '../types'
import { validationError } from '../utils'

const orderModel = new OrderModel()
const orderItemModel = new OrderItemModel()

export async function createOrder(order: Order) {
  // First check if the user has an active order.
  const userOrder = await orderModel.getActiveOrderByUser(order.user_id)
  if (userOrder) {
    throw new validationError(
      'User Already has an active Order! complete it first or add items.'
    )
  }
  // else create it.
  return orderModel.create(order)
}

export function getActiveOrderForUser(id: string) {
  return orderModel.getActiveOrderByUser(id)
}

export async function getAllOrdersForUser(id: string) {
  return {
    completedOrders: await orderModel.getCompletedOrdersByUser(id),
    active: await orderModel.getActiveOrderByUser(id)
  }
}

export async function getOrderByOrderId(id: string) {
  return orderModel.showById(id)
}

export async function getAllOrders() {
  return orderModel.index()
}

export function completeOrderUsingUserId(user_id: string) {
  return orderModel.updateOrderStatusUsingUserId({ user_id })
}

export function completeOrderUsingOrderId(orderId: string) {
  return orderModel.updateOrderStatusUsingOrderId({ id: orderId })
}

export async function addOrderItem(orderItem: OrderItem) {
  // First check if it exists or not
  const item = await orderItemModel.showByOrderIdAndProductId(orderItem)
  if (item) {
    // Update it.
    return orderItemModel.update({
      ...orderItem,
      quantity: item.quantity + orderItem.quantity
    })
  }
  // else add it
  return orderItemModel.create(orderItem)
}

export async function updateQuantity(orderItem: OrderItem) {
  const item = await orderItemModel.showByOrderIdAndProductId(orderItem)
  if (item) {
    return orderItemModel.update({
      ...orderItem,
      quantity: orderItem.quantity
    })
  }
  throw new validationError('Item doesnt Exist!', 404)
}

export function getItemsByOrderId(id: NonNullable<Order['id']>) {
  return orderItemModel.indexByOrderId(id)
}

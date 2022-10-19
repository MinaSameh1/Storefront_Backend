import { Router } from 'express'
import {
  completeOrderController,
  completeUserOrderController,
  createOrderItemController,
  getOrdersController,
  getUserActiveOrderController,
  getUserOrdersController
} from '../controller'
import { requireUser, validateBody } from '../middleware'
import { orderItemTemplate } from '../schema'
import { ORDER_ENDPOINT } from '../utils'

export const orderRouter = Router()

// Gets active order for user
orderRouter.get(
  `${ORDER_ENDPOINT}/active`,
  requireUser,
  getUserActiveOrderController
)

// Gets orders by current user
orderRouter.get(`${ORDER_ENDPOINT}/user`, requireUser, getUserOrdersController)
// Gets order by userId
orderRouter.get(
  `${ORDER_ENDPOINT}/user/:userId`,
  requireUser,
  getUserOrdersController
)

// Gets order by id
orderRouter.get(`${ORDER_ENDPOINT}/:id`, requireUser, getOrdersController)

// Adds item to order
orderRouter.post(
  ORDER_ENDPOINT,
  requireUser,
  validateBody(orderItemTemplate),
  createOrderItemController
)

//// Completes item
// by current user
orderRouter.put(ORDER_ENDPOINT, requireUser, completeUserOrderController)
// By userId
orderRouter.put(
  `${ORDER_ENDPOINT}/user/:userId`,
  requireUser,
  completeOrderController
)
// by id
orderRouter.put(`${ORDER_ENDPOINT}/:id`, requireUser, completeOrderController)

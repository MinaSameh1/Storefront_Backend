import { NextFunction, Request, Response } from 'express'
import { DatabaseError } from 'pg'
import * as orderService from '../service/order.service'
import { OrderAndItems, OrderItem } from '../types'
import { uuidValidate, validationError } from '../utils'

export async function createOrderItemController(
  req: Request<unknown, unknown, OrderItem>,
  res: Response,
  next: NextFunction
) {
  try {
    if (!uuidValidate(req.body.product_id ?? ''))
      return res.status(400).json({ message: 'project id isnt a uuid!' })
    // first get order
    const order = await orderService.getActiveOrderForUser(res.locals.user.id)
    if (order) {
      // if it exists then add the item
      return res
        .status(200)
        .json(
          await orderService.addOrderItem({ ...req.body, order_id: order.id })
        )
    }
    // if not create the order for user
    const newOrder = await orderService.createOrder({
      user_id: String(res.locals.user.id),
      order_status: false
    })
    // and then add the time.
    return res.status(200).json(
      await orderService.addOrderItem({
        ...req.body,
        order_id: newOrder.id
      })
    )
  } catch (err) {
    if (err instanceof validationError) {
      return res.status(err.status).json({ message: err.message })
    }
    // Error code for foregin key doesnt exist error, from postgres server itself.
    if (err instanceof DatabaseError && err.code === '23503') {
      return res.status(400).json({ message: 'Project Doesnt exist!' })
    }
    return next(err)
  }
}

export async function completeUserOrderController(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json(await orderService.completeOrderUsingUserId(res.locals.user.id))
  } catch (err) {
    next(err)
  }
}

export async function completeOrderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (uuidValidate(req.params.id))
      return res
        .status(200)
        .json(await orderService.completeOrderUsingUserId(res.locals.user.id))
    if (uuidValidate(req.params.userId))
      return res
        .status(200)
        .json(await orderService.completeOrderUsingUserId(req.params.userId))
    return res
      .status(400)
      .json({ message: 'Missing id param! `endpoint/:id||userId/complete`' })
  } catch (err) {
    return next(err)
  }
}

export async function getUserActiveOrderController(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await orderService.getActiveOrderForUser(res.locals.user.id)
    if (result)
      return res.status(200).json({
        order: result,
        items: await orderService.getItemsByOrderId(String(result.id))
      })
    return res
      .status(404)
      .json({ message: 'User doesnt have any active order' })
  } catch (err) {
    return next(err)
  }
}

export async function getOrdersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.params.id && uuidValidate(req.params.id)) {
      const order = await orderService.getOrderByOrderId(req.params.id)
      const orderItems = await orderService.getItemsByOrderId(String(order.id))
      return res.status(200).json({ order: order, items: orderItems })
    }
    return res.status(200).json(await orderService.getAllOrders())
  } catch (err) {
    return next(err)
  }
}

export async function getUserOrdersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let userId: string = res.locals.user.id
    if (req.params.userId) {
      userId = String(req.params.userId)
    }

    let active: OrderAndItems | undefined = undefined
    // First get user orders.
    const userOrders = await orderService.getAllOrdersForUser(userId)
    const ordersCompleted: Array<OrderAndItems> = []
    // Then mold the data into a good shape for use.
    for (const order of userOrders.completedOrders) {
      const items = await orderService.getItemsByOrderId(String(order.id))
      const orderAndItems: OrderAndItems = {
        ...order,
        items
      }
      ordersCompleted.push(orderAndItems)
    }
    // if the user has active order then add it to the response.
    if (userOrders.active) {
      const activeOrderId = String(userOrders.active.id)
      active = {
        ...userOrders.active,
        items: await orderService.getItemsByOrderId(activeOrderId)
      }
    }
    return res.status(200).json({
      active: active ?? {},
      completed: ordersCompleted
    })
  } catch (err) {
    next(err)
  }
}

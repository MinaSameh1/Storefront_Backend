import { Order, StoreUser } from '../../types'
import { userModel as UserModel, orderModel } from '../../model'
import { beforeHelper, generateOrder, generateUser } from '../helpers'

describe('Order Model', () => {
  let model: orderModel
  let userModel: UserModel
  let user: Omit<StoreUser, 'pass'>
  let userId: string
  let order: Order

  beforeAll(async () => {
    beforeHelper()
    // We need a userId to create the order.
    userModel = new UserModel()
    model = new orderModel()
    user = await userModel.create(generateUser())
    user.id = String(user.id)
    userId = typeof user.id === 'string' ? user.id : ''
  })

  it('Should create order', async () => {
    const result = await model.create(generateOrder(userId))
    expect(result.id).toBeDefined()
    expect(result.order_status).toBeFalse()
    order = result
  })

  it('Should return order', async () => {
    const result = await model.showById(order.id ?? '')
    expect(result).toEqual(order)
  })

  it('Should ActiveOrder by UserId', async () => {
    const result = await model.getActiveOrderByUser(userId)
    expect(result.id).toEqual(order.id)
    expect(result.user_id).toEqual(userId)
    expect(result.order_status).toBeFalse()
  })

  it('Should get completed orders', async () => {
    let i = 5
    while (i > 0) {
      await model.create(generateOrder(userId, true))
      i--
    }
    const result = await model.getCompletedOrdersByUser(userId)
    expect(result.length).toBeGreaterThanOrEqual(4)
    for (const order of result) {
      expect(order.user_id).toEqual(userId)
      expect(order.order_status).toBeTrue()
    }
  })

  it('Should get all orders', async () => {
    const result = await model.index()
    expect(result.length).toBeGreaterThanOrEqual(4)
  })

  it('Should update order_status to completed using userId', async () => {
    const orderToBeUpdated = await model.create(generateOrder(userId))
    expect(orderToBeUpdated.id).toBeDefined()
    expect(orderToBeUpdated.user_id).toBeDefined()
    const result = await model.updateOrderStatusUsingUserId({
      user_id: userId
    })
    expect(result.order_status).toBeTrue()
    expect(result.user_id).toEqual(userId)
  })

  it('Should update order_status to completed using orderId', async () => {
    const orderToBeUpdated = await model.create(generateOrder(userId))
    expect(orderToBeUpdated.id).toBeDefined()
    expect(orderToBeUpdated.user_id).toBeDefined()
    const result = await model.updateOrderStatusUsingOrderId({
      id: orderToBeUpdated.id ?? ''
    })
    expect(result.order_status).toBeTrue()
    expect(result.id).toEqual(orderToBeUpdated.id)
  })
})

import {
  productModel as ProductModel,
  userModel as UserModel
} from '../../model'
import { createProduct } from '../../service'
import * as orderService from '../../service/order.service'
import { Order, Product, StoreUser } from '../../types'
import { validationError } from '../../utils'
import {
  beforeHelper,
  generateOrder,
  generateProduct,
  generateUser
} from '../helpers'

describe('Order service', () => {
  let productModel: ProductModel
  let userModel: UserModel

  beforeAll(async () => {
    beforeHelper()
    productModel = new ProductModel()
    userModel = new UserModel()
  })

  describe('Order function', () => {
    let product: Product
    let user: Omit<StoreUser, 'pass'>
    let order: Order

    beforeAll(async () => {
      // Create mock data.
      user = await userModel.create(generateUser())
      product = await productModel.create(generateProduct())
      expect(product.id).toBeDefined()
    })

    it('Should create order', async () => {
      const result = await orderService.createOrder({
        user_id: String(user.id),
        order_status: false
      })

      expect(result.id).toBeDefined()
      order = result
    })

    it('Should throw validation error on creating another active order', async () => {
      await expectAsync(
        orderService.createOrder({
          user_id: String(user.id),
          order_status: false
        })
      ).toBeRejectedWithError(validationError)
    })

    it('Should return active order for user', async () => {
      const result = await orderService.getActiveOrderForUser(String(user.id))
      expect(result).toEqual(order)
    })

    it('Should get all orders for user', async () => {
      // First complete the order
      await orderService.completeOrderUsingOrderId(String(order.id))
      // Then create another one.
      const unCompletedOrder = await orderService.createOrder({
        user_id: String(user.id),
        order_status: false
      })
      order.id = unCompletedOrder.id
      const result = await orderService.getAllOrdersForUser(String(user.id))
      expect(result.active).toEqual(order)
      expect(result.completedOrders.length).toBeGreaterThanOrEqual(1)
    })

    it('Should return order by id', async () => {
      const result = await orderService.getOrderByOrderId(String(order.id))
      expect(result).toEqual(order)
    })

    it('Should return all orders', async () => {
      const result = await orderService.getAllOrders()
      expect(result.length).toBeGreaterThanOrEqual(2)
    })

    it('Should complete order using userId', async () => {
      const result = await orderService.completeOrderUsingUserId(
        String(order.user_id)
      )

      expect(result.order_status).toBeTrue()
    })

    it('Should complete order using orderId', async () => {
      const orderToBeCompleted = await orderService.createOrder(
        generateOrder(String(user.id))
      )

      expect(orderToBeCompleted.order_status).toBeFalse()

      const result = await orderService.completeOrderUsingOrderId(
        String(orderToBeCompleted.id)
      )

      expect(result.order_status).toBeTrue()
    })
  })

  describe('OrderItem functions', () => {
    let order: Order
    const products: Array<Product> = []

    beforeAll(async () => {
      const userToOrder = await userModel.create(generateUser())
      order = await orderService.createOrder(
        generateOrder(String(userToOrder.id))
      )
      for (let i = 0; i < 5; i++) {
        products.push(await createProduct(generateProduct()))
      }
    })

    it('Should add item to order', async () => {
      const productId = String(products[0].id)
      const orderId = String(order.id)
      const result = await orderService.addOrderItem({
        order_id: orderId,
        product_id: productId,
        quantity: 1
      })

      expect(result.order_id).toEqual(orderId)
      expect(result.product_id).toEqual(productId)
      expect(result.quantity).toEqual(1)
    })

    it('Should increase quantity of item not create a new one', async () => {
      const productId = String(products[0].id)
      const orderId = String(order.id)
      const result = await orderService.addOrderItem({
        order_id: orderId,
        product_id: productId,
        quantity: 2
      })

      expect(result.order_id).toEqual(orderId)
      expect(result.product_id).toEqual(productId)
      expect(result.quantity).toEqual(3)
    })

    it('Should update quantity of the item', async () => {
      const productId = String(products[0].id)
      const orderId = String(order.id)
      const result = await orderService.updateQuantity({
        order_id: orderId,
        product_id: productId,
        quantity: 2
      })
      expect(result.quantity).toEqual(2)
    })

    it('Should updateQuantity throw error on 404', async () => {
      await expectAsync(
        orderService.updateQuantity({
          order_id: String(order.id),
          product_id: String(products[1].id),
          quantity: 2
        })
      ).toBeRejectedWithError(validationError)
    })

    it('Should return items by order id', async () => {
      const orderId = String(order.id)
      // Add some items to order.
      for (const product of products)
        await orderService.addOrderItem({
          order_id: orderId,
          product_id: String(product.id),
          quantity: 2
        })
      const result = await orderService.getItemsByOrderId(orderId)
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThanOrEqual(4)
    })
  })
})

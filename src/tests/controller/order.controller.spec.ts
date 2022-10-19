import { Application } from 'express'
import { Product, StoreUser } from 'src/types'
import request from 'supertest'
import {
  // orderItemModel as OrderItemModel,
  orderModel as OrderModel,
  productModel as ProductModel,
  userModel as UserModel
} from '../../model'
import { ORDER_ENDPOINT, signJwt } from '../../utils'
import { beforeHelper, generateProduct, generateUser } from '../helpers'

describe('Order Controller', () => {
  let app: Application
  let user: Omit<StoreUser, 'pass'>
  let userModel: UserModel
  let orderModel: OrderModel
  let productModel: ProductModel
  // let orderItemModel: OrderItemModel
  let token: string

  beforeAll(async () => {
    app = beforeHelper(true)
    userModel = new UserModel()
    productModel = new ProductModel()
    orderModel = new OrderModel()
    // orderItemModel = new OrderItemModel()
    user = await userModel.create(generateUser())
    expect(user.id).toBeInstanceOf(String)
    token = signJwt(user)
  })

  describe('GET', () => {
    it('should return 404 on no active order', async () => {
      const result = await request(app)
        .get(`${ORDER_ENDPOINT}/active`)
        .set('authorization', 'Bearer ' + token)
      expect(result.statusCode).toEqual(404)
      expect(result.body.message).toBeDefined()
    })

    it('should return 200 on active order', async () => {
      const order = await orderModel.create({
        user_id: String(user.id),
        order_status: false
      })
      const result = await request(app)
        .get(`${ORDER_ENDPOINT}/active`)
        .set('authorization', 'Bearer ' + token)
      expect(result.statusCode).toEqual(200)
      expect(result.body).toEqual(order)
    })

    it('should return order using orderid', async () => {
      const order = await orderModel.create({
        user_id: String(user.id),
        order_status: true
      })
      const result = await request(app)
        .get(`${ORDER_ENDPOINT}/${order.id}`)
        .set('authorization', 'Bearer ' + token)
      expect(result.statusCode).toEqual(200)
      expect(result.body.order).toEqual(order)
    })

    it('Should return all user orders with items', async () => {
      const result = await request(app)
        .get(`${ORDER_ENDPOINT}/user/${user.id}`)
        .set('authorization', 'Bearer ' + token)
      expect(result.statusCode).toEqual(200)
      expect(result.body.active).toBeDefined()
      expect(result.body.completed).toBeDefined()
    })
  })

  describe('POST', () => {
    let product: Product

    beforeAll(async () => {
      product = await productModel.create(generateProduct())
    })

    it('should return 400 on no existing product', async () => {
      const nonExistingProduct = '66666666-1111-4444-2222-111111111111'
      const result = await request(app)
        .post(ORDER_ENDPOINT)
        .set('authorization', 'Bearer ' + token)
        .send({ product_id: nonExistingProduct })
      expect(result.statusCode).toEqual(400)
    })

    it('should return 400 on bad product uuid', async () => {
      const result = await request(app)
        .post(ORDER_ENDPOINT)
        .set('authorization', 'Bearer ' + token)
        .send({ product_id: '1231231' })
      expect(result.statusCode).toEqual(400)
    })

    it('should create order and add item on no active order', async () => {
      if (await orderModel.getActiveOrderByUser(String(user.id))) {
        await orderModel.updateOrderStatusUsingUserId({
          user_id: String(user.id)
        })
      }
      const result = await request(app)
        .post(ORDER_ENDPOINT)
        .set('authorization', 'Bearer ' + token)
        .send({ product_id: product.id })
      expect(result.statusCode).toEqual(200)
      const order = await orderModel.getActiveOrderByUser(String(user.id))
      expect(order.user_id).toEqual(String(user.id))
      expect(order.order_status).toBeFalse()
    })

    it('Should on adding the same product increment', async () => {
      const result = await request(app)
        .post(ORDER_ENDPOINT)
        .set('authorization', 'Bearer ' + token)
        .send({ product_id: product.id, quantity: 3 })
      expect(result.statusCode).toEqual(200)
      expect(result.body.quantity).toEqual(4)
    })
  })

  describe('PUT', () => {
    let user: Omit<StoreUser, 'pass'>
    let orderItemToken: string

    beforeAll(async () => {
      user = await userModel.create(generateUser())
      orderItemToken = signJwt(user)
    })

    it('Should update order using current user', async () => {
      const order = await orderModel.create({
        user_id: String(user.id),
        order_status: false
      })
      const result = await request(app)
        .put(ORDER_ENDPOINT)
        .set('authorization', 'Bearer ' + orderItemToken)
      expect(result.statusCode).toEqual(200)
      expect(result.body.order_status).toBeTrue()
      expect(result.body.id).toEqual(String(order.id))
    })

    it('Should update order using current user', async () => {
      const order = await orderModel.create({
        user_id: String(user.id),
        order_status: false
      })
      const result = await request(app)
        .put(`${ORDER_ENDPOINT}/${order.id}`)
        .set('authorization', 'Bearer ' + orderItemToken)
      expect(result.statusCode).toEqual(200)
      expect(result.body.order_status).toBeTrue()
      expect(result.body.id).toEqual(String(order.id))
    })

    it('Should update order using userId', async () => {
      const order = await orderModel.create({
        user_id: String(user.id),
        order_status: false
      })
      const result = await request(app)
        .put(`${ORDER_ENDPOINT}/user/${String(user.id)}`)
        .set('authorization', 'Bearer ' + orderItemToken)
      expect(result.statusCode).toEqual(200)
      expect(result.body.order_status).toBeTrue()
      expect(result.body.id).toEqual(String(order.id))
    })
  })
})

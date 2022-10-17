import {
  orderItemModel as OrderItemModel,
  orderModel as OrderModel,
  productModel as ProductModel,
  userModel as UserModel
} from '../../model'
import { Order, Product, StoreUser } from '../../types'
import {
  beforeHelper,
  generateOrder,
  generateProduct,
  generateUser
} from '../helpers'

describe('Order Item Model', () => {
  let order: Order
  let orderModel: OrderModel
  let product: Product
  let productModel: ProductModel
  let user: Omit<StoreUser, 'pass'>
  let userModel: UserModel
  let model: OrderItemModel

  beforeAll(async () => {
    beforeHelper()
    // Create mock data.
    orderModel = new OrderModel()
    productModel = new ProductModel()
    userModel = new UserModel()
    user = await userModel.create(generateUser())
    product = await productModel.create(generateProduct())
    order = await orderModel.create(generateOrder(String(user.id)))
    // We need these two in our tests.
    expect(order.id).toBeDefined()
    expect(product.id).toBeDefined()
    model = new OrderItemModel()
  })

  it('Should create Order item', async () => {
    const result = await model.create({
      order_id: order.id,
      product_id: product.id,
      quantity: 2
    })
    expect(result).toEqual({
      order_id: order.id,
      product_id: product.id,
      quantity: 2
    })
  })

  it('Should get orderItems by order id', async () => {
    const anotherOrderItem = await model.create({
      order_id: order.id,
      product_id: product.id,
      quantity: 1
    })
    expect(anotherOrderItem).toEqual({
      order_id: order.id,
      product_id: product.id,
      quantity: 1
    })

    const result = await model.indexByOrderId(
      typeof order.id === 'string' ? order.id : ''
    )
    expect(result.length).toBeGreaterThanOrEqual(2)
    expect(result[0].order_id).toBeDefined()
    expect(result[0].product_id).toBeDefined()
  })

  it('Should get orderItems by product id', async () => {
    const anotherProduct = await productModel.create(generateProduct())
    const anotherOrderItem = await model.create({
      order_id: order.id,
      product_id: anotherProduct.id,
      quantity: 1
    })
    expect(anotherOrderItem).toEqual({
      order_id: order.id,
      product_id: anotherProduct.id,
      quantity: 1
    })

    const result = await model.indexByProductId(
      typeof product.id === 'string' ? product.id : ''
    )
    expect(result.length).toBeGreaterThanOrEqual(2)
    expect(result[0].order_id).toBeDefined()
    expect(result[0].product_id).toBeDefined()
  })

  it('Should update the orderItem quantity', async () => {
    const anotherProduct = await productModel.create(generateProduct())
    const orderItem = await model.create({
      order_id: order.id,
      product_id: anotherProduct.id,
      quantity: 1
    })
    expect(orderItem).toEqual({
      order_id: order.id,
      product_id: anotherProduct.id,
      quantity: 1
    })

    const result = await model.update({ ...orderItem, quantity: 4 })
    expect(result.quantity).toEqual(4)
    expect(result.order_id).toEqual(order.id)
    expect(result.product_id).toEqual(anotherProduct.id)
  })
})

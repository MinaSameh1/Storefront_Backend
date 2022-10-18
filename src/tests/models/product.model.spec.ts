import { Product } from 'src/types'
import { productModel } from '../../model/product.model'
import { beforeHelper, generateProduct } from '../helpers'

describe('Product Model', () => {
  let model: productModel
  let id: Product['id']

  beforeAll(async () => {
    // Connect to db
    beforeHelper()
    model = new productModel()
    // Create 5 products to test out the iteration.
    for (let i = 0; i < 5; i++) await model.create(generateProduct('testModel'))
  })

  it('Should create product', async () => {
    const product = generateProduct()
    const result = await model.create(product)
    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    id = result.id
    expect(result.name).toEqual(product.name)
    expect(String(result.price)).toEqual(
      product.price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    )
  })

  it('Should show the product by id', async () => {
    const result = await model.showById(id)
    expect(result.rows).toBeDefined()
    expect(result.rows[0].id).toBeDefined()
    id = result.rows[0].id
    expect(result.rows[0].name).toBeDefined()
    expect(result.rows[0].price).toBeDefined()
    expect(result.rows[0].category).toBeDefined()
  })

  it('Should return products paginated.', async () => {
    const result = await model.index(2, 2)
    expect(result.rows).toBeDefined()
    expect(result.rows.length).toBeGreaterThan(1)
    expect(result.rows[0].id).toBeDefined()
    id = result.rows[0].id
    expect(result.rows[0].name).toBeDefined()
    expect(result.rows[0].price).toBeDefined()
    expect(result.rows[0].category).toBeDefined()
  })

  it('Should return products in page 2.', async () => {
    const result = await model.index(1, 2)
    expect(result.rows).toBeDefined()
    expect(result.rows[0].id).toBeDefined()
    id = result.rows[0].id
    expect(result.rows[0].name).toBeDefined()
    expect(result.rows[0].price).toBeDefined()
    expect(result.rows[0].category).toBeDefined()
  })

  it('Should return products category.', async () => {
    await model.create(generateProduct('testModel'))
    const result = await model.indexByCategory('testModel')
    expect(result.rows.length).toBeGreaterThanOrEqual(1)
    expect(result.rows.length).toBeDefined()
    expect(result.rows[0].id).toBeDefined()
    id = result.rows[0].id
    expect(result.rows[0].name).toBeDefined()
    expect(result.rows[0].price).toBeDefined()
    expect(result.rows[0].category).toBeDefined()
  })

  it('Should return products category page 2.', async () => {
    const result = await model.indexByCategory('testModel', 2, 2)
    expect(result.rows).toBeDefined()
    expect(result.rows.length).toBeGreaterThan(1)
    expect(result.rows[0].id).toBeDefined()
    id = result.rows[0].id
    expect(result.rows[0].name).toBeDefined()
    expect(result.rows[0].price).toBeDefined()
    expect(result.rows[0].category).toBeDefined()
  })
})

import { createProduct, getProducts } from '../../service'
import { productModel } from '../../model'
import { beforeHelper, generateProduct } from '../helpers'

describe('Product service', () => {
  const testProduct = generateProduct()

  beforeAll(async () => {
    beforeHelper()
    const model = new productModel()
    let i = 5
    while (i > 0) {
      i--
      await model.create(generateProduct('testService'))
    }
  })

  it('Should create product', async () => {
    const result = await createProduct(generateProduct('testService'))
    expect(result.id).toBeDefined()
    testProduct.id = result.id
    expect(result.name).toBeDefined()
  })

  it('Should get products without params', async () => {
    const result = await getProducts({})
    expect(result.results).toBeDefined()
    expect(result.results.length).toBeGreaterThanOrEqual(1)
    expect(result.results[0].id).toBeDefined()
  })

  it('Should get one product by Id', async () => {
    const result = await getProducts({ id: testProduct.id })
    expect(result.results).toBeDefined()
    expect(result.results.length).toEqual(1)
  })

  it('Should get products by category', async () => {
    const result = await getProducts({ category: 'testService' })
    expect(result.results).toBeDefined()
    expect(result.results.length).toBeGreaterThanOrEqual(1)
    expect(result.total).toBeGreaterThan(2) // we created 5 products :eyes:
    expect(result.currentPage).toEqual(1)
  })

  it('Should get products by category and limit', async () => {
    const result = await getProducts({ category: 'testService' })
    expect(result.results).toBeDefined()
    expect(result.results.length).toBeGreaterThanOrEqual(2)
    expect(result.total).toBeGreaterThan(2) // we created 5 products :eyes:
  })

  it('Should get products by category and limit, page', async () => {
    const limit = 2
    const result = await getProducts({ category: 'testService' }, limit, 2)
    expect(result.results).toBeDefined()
    expect(result.results.length).toBeGreaterThanOrEqual(2)
    expect(result.currentPage).toEqual(2)
    expect(result.totalPages).toEqual(Math.ceil(result.total / limit))
  })
})

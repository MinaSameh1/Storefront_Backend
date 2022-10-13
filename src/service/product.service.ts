import { logger, getPaginationInfo } from '../utils'
import { Product, ProductResponseQuery } from '../types'
import { productModel } from '../model'

const model = new productModel()

export function createProduct(product: Product) {
  return model.create(product)
}

export async function getProducts(
  limit = 20,
  page = 1,
  {
    id = undefined,
    category = undefined
  }: {
    id?: Product['id']
    category?: Product['category']
  }
): Promise<ProductResponseQuery> {
  let select = 'SELECT * FROM products'

  if (id) {
    const result = await model.showById(id)

    return {
      results: result.rows,
      total: 1,
      totalPages: 1,
      currentPage: 1
    }
  }
  const offset = (page - 1) * limit
  const params: Array<string | number> = [limit, offset]

  if (category) {
    logger.debug(`Recieved Category ${category}`)
    params.unshift(category)
    select = select + ' WHERE category = $1'
  }

  const { totalPages, total } = await getPaginationInfo({
    select,
    limit,
    params: params.length >= 3 ? [params[0]] : []
  })

  const result = category
    ? await model.indexByCategory(category, limit, offset)
    : await model.index(limit, offset)

  return {
    results: result.rows,
    total,
    totalPages,
    currentPage: page
  }
}

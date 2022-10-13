import { logger, getPaginationInfo } from '../utils'
import { Product, ProductResponseQuery } from '../types'
import { productModel } from '../model'

const model = new productModel()

/**
 * @description Creates product.
 * @param {Product} product, must have name and price
 * @returns {Promise<QueryResult>} QueryResult.
 */
export function createProduct(product: Product) {
  return model.create(product)
}

//// Function Overloading
/**
 * @description Gets product by id
 * @param {{ string }} { id } suppling Id returns only that product id.
 * @returns {Promise<ProductResponseQuery>} Structured Response.
 */
export async function getProducts({
  // eslint-disable-next-line no-unused-vars
  id
}: {
  id: Product['id']
}): Promise<ProductResponseQuery>

/**
 * @description Gets product by category, supports pagination by default
 * @description Gets products supports pagination by default, can filter using id and category.
 * @param {{ string }} {category} category we want to filter with.
 * @returns {Promise<ProductResponseQuery>} Structured Response.
 */
export async function getProducts({
  // eslint-disable-next-line no-unused-vars
  category
}: {
  category: Product['category']
}): Promise<ProductResponseQuery>

/**
 * @description Gets product by category, supports pagination by default
 * @description Gets products supports pagination by default, can filter using id and category.
 * @param {{ string }} {category} category we want to filter with.
 * @param {number} limit the limit of products of want, default 20
 * @returns {Promise<ProductResponseQuery>} Structured Response.
 */
export async function getProducts(
  {
    // eslint-disable-next-line no-unused-vars
    category
  }: {
    category: Product['category']
  },
  // eslint-disable-next-line no-unused-vars
  limit?: number
): Promise<ProductResponseQuery>

/**
 * @description Gets product by category, supports pagination by default
 * @description Gets products supports pagination by default, can filter using id and category.
 * @param {{ string }} {category} category we want to filter with.
 * @param {number} limit the limit of products of want, default 20.
 * @param {number} page default 1
 * @returns {Promise<ProductResponseQuery>} Structured Response.
 */
export async function getProducts(
  {
    // eslint-disable-next-line no-unused-vars
    category
  }: {
    category: Product['category']
  },
  // eslint-disable-next-line no-unused-vars
  limit?: number,
  // eslint-disable-next-line no-unused-vars
  page?: number
): Promise<ProductResponseQuery>

/**
 * @description Gets products supports pagination by default, can filter using id and category.
 * @param {{ string, string}} {id, category} If you supply ID it will ignore the rest of params
 * @param {number} limit Default 20 limit that will be used for the pages.
 * @param {number} page default 1 page number, accepts any number above 1 !
 * @returns {Promise<ProductResponseQuery>} Structured Response.
 */
export async function getProducts(
  {
    // eslint-disable-next-line no-unused-vars
    id,
    // eslint-disable-next-line no-unused-vars
    category
  }: {
    id?: Product['id']
    category?: Product['category']
  },
  // eslint-disable-next-line no-unused-vars
  limit: number,
  // eslint-disable-next-line no-unused-vars
  page: number
): Promise<ProductResponseQuery>

export async function getProducts(
  {
    id = undefined,
    category = undefined
  }: {
    id?: Product['id']
    category?: Product['category']
  },
  limit = 20,
  page = 1
): Promise<ProductResponseQuery> {
  if (id) {
    const result = await model.showById(id)

    return {
      results: result.rows,
      total: 1,
      totalPages: 1,
      currentPage: 1
    }
  }

  let select = 'SELECT * FROM products'
  if (page <= 0) {
    throw Error('Page must be positive number!')
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

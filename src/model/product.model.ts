import { QueryResult } from 'pg'
import { Product } from '../types'
import { query } from '../utils'

// NOTE: Error handling is done through the handler, as postgresql has great error codes
// postgresql error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html

export class productModel {
  async create(product: Product): Promise<QueryResult<Product>['rows'][0]> {
    const result = await query('SELECT * from insert_product($1, $2, $3);', [
      product.name,
      product.price,
      product.category
    ])
    return result.rows[0]
  }

  async showById(id: Product['id']) {
    return query('SELECT * FROM products WHERE id = $1', [id])
  }

  index(limit = 20, offset = 0): Promise<QueryResult<Product>> {
    return query('SELECT * FROM products LIMIT $1 OFFSET $2', [limit, offset])
  }

  indexByCategory(
    category: Product['category'],
    limit = 20,
    offset = 0
  ): Promise<QueryResult<Product>> {
    return query(
      'SELECT * FROM products WHERE category = $1 LIMIT $2 OFFSET $3',
      [category, limit, offset]
    )
  }
}

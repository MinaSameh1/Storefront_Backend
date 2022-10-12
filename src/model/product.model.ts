import { product } from '../schema'
import { query } from '../utils'

// NOTE: Error handling is done through the handler, as postgresql has great error codes
// postgresql error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html

export async function createProduct(product: product) {
  const result = await query('SELECT * from insert_product($1, $2, $3);', [
    product.name,
    product.price,
    product.category
  ])
  return result.rows[0]
}

export async function showProduct(
  limit: number,
  id?: string,
  category?: string
): Promise<Array<product>> {
  const select = 'SELECT * FROM products'

  if (category) {
    const result = await query(select + ' WHERE category=$1', [category])
    return result.rows
  }
  if (id) {
    const result = await query(select + ' WHERE id =$1', [id])
    return result.rows
  }
  const result = await query(select)
  return result.rows
}

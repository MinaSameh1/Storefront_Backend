import { NextFunction, Request, Response } from 'express'
import { DatabaseError } from 'pg'
import { product } from 'src/schema'
import { createProduct } from '../model'

/*
 *  Index
 *  Show
 *  [OPTIONAL] Top 5 most popular products
 *  [OPTIONAL] Products by category (args: product category)
 *
 */
export function showProductsHandler(req: Request, res: Response) {
  return res.send(200)
}

/**
 * @description Handler for createProduct
 * Returns 400 if couldn't create due to duplicate name
 */
export async function createProductHandler(
  // Since we already validated the body, we know its of type product.
  req: Request<unknown, unknown, product>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await createProduct(req.body)
    if (result) return res.status(200).json(result)
    return res.status(500).json({ message: "Product wasn't created!" })
  } catch (err: unknown) {
    req.log.error(err)
    if (err instanceof DatabaseError) {
      // Error by database
      if (err.code === '23505')
        return res.status(400).json({ message: 'Product name already taken!' })
    }
    next(err)
  }
}

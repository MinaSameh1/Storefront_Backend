import { NextFunction, Request, Response } from 'express'
import { createProduct, getProducts } from '../service'
import { Product } from '../types'
import { uuidValidate } from '../utils'

/**
 * @description Get products and shows them
 * Can search by id, filter by category
 * Supports pagination
 */
export async function showProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = parseInt(
      typeof req.query.limit === 'string' ? req.query.limit : '20'
    )

    const page = parseInt(
      typeof req.query.page === 'string' ? req.query.page : '1'
    )

    if (page < 1) {
      return res.status(400).json({
        message: 'Page must be positive number!'
      })
    }

    if (req.params.id && !uuidValidate(req.params.id)) {
      return res.status(400).json({
        message: 'Bad uuid!'
      })
    }
    const result = await getProducts(
      {
        id: req.params.id ?? undefined,
        category: req.query.category ? String(req.query.category) : undefined
      },
      limit,
      page
    )

    if (result) {
      if (result.currentPage - 1 > result.totalPages) {
        return res.status(404).json({
          message: 'This page or item doesnt exist!',
          totalPages: result.totalPages
        })
      }
      if (result.results.length === 0)
        return res.status(404).json({ message: 'Item/category doesnt exist!' })
      return res.status(200).json(result)
    }
    return res.status(400).json({ message: 'Item doesnt exist!' })
  } catch (err) {
    next(err)
  }
}

/**
 * @description Handler for createProduct
 * Returns 400 if couldn't create due to duplicate name
 */
export async function createProductHandler(
  // Since we already validated the body, we know its of type product.
  req: Request<unknown, unknown, Product>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await createProduct(req.body)
    if (result) return res.status(200).json(result)
    return res.status(500).json({ message: "Product wasn't created!" })
  } catch (err: unknown) {
    next(err)
  }
}

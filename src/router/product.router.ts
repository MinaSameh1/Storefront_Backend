import { Router } from 'express'
import { requireUser, validateBody } from '../middleware'
import { createProductHandler, showProductsHandler } from '../controller'
import { PRODUCT_ENDPOINT } from '../utils'
import { productTemplate } from '../schema'

export const productRouter = Router()

productRouter.get(PRODUCT_ENDPOINT, showProductsHandler)

productRouter.get(`${PRODUCT_ENDPOINT}/:id`, showProductsHandler)

productRouter.post(
  PRODUCT_ENDPOINT,
  requireUser,
  validateBody(productTemplate),
  createProductHandler
)

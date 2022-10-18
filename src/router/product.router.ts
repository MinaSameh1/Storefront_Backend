import { Router } from 'express'
import { createProductHandler, showProductsHandler } from '../controller'
import { requireUser, validateBody } from '../middleware'
import { productTemplate } from '../schema'
import { PRODUCT_ENDPOINT } from '../utils'

export const productRouter = Router()

productRouter.get(PRODUCT_ENDPOINT, showProductsHandler)

productRouter.get(`${PRODUCT_ENDPOINT}/:id`, showProductsHandler)

productRouter.post(
  PRODUCT_ENDPOINT,
  requireUser,
  validateBody(productTemplate),
  createProductHandler
)

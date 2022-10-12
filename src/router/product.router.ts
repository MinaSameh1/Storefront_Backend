import { Router } from 'express'
import { validateBody } from '../middleware'
import { createProductHandler, showProductsHandler } from '../controller'
import { PRODUCT_ENDPOINT } from '../utils'
import { productTemplate } from '../schema'

export const productRouter = Router()

productRouter.get(PRODUCT_ENDPOINT, showProductsHandler)

productRouter.get(`${PRODUCT_ENDPOINT}/:id`, showProductsHandler)

productRouter.post(
  PRODUCT_ENDPOINT,
  validateBody(productTemplate),
  createProductHandler
)

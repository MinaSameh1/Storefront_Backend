import { faker } from '@faker-js/faker'
import { Product } from '../../types'

export const generateProduct = (category?: string): Product => {
  return {
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()),
    category: category ?? faker.commerce.productMaterial()
  }
}

import { faker } from '@faker-js/faker'
import { product } from '../../types'

export const generateProduct = (category?: string): product => {
  return {
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()),
    category: category ?? faker.commerce.productMaterial()
  }
}

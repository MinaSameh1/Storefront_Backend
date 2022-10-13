import { row, ReturnResponseQuery } from './'

export interface Product extends row {
  id?: string
  name: string
  price: number
  category?: string
}

export type ProductResponseQuery = ReturnResponseQuery<Product>

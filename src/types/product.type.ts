import { QueryResultRow } from 'pg'
import { row } from './'

export interface product extends row {
  id?: string
  name: string
  price: number
  category?: string
}

export interface ReturnProductQuery {
  results: Array<QueryResultRow>
  total: number
  totalPages: number
  currentPage: number
}

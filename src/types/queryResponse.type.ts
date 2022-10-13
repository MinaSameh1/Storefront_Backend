import { QueryResult } from 'pg'
import { row } from './row.type'

export interface ReturnResponseQuery<T extends row> {
  results: Array<QueryResult<T>>
  total: number
  totalPages: number
  currentPage: number
}

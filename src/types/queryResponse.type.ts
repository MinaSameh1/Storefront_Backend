import { QueryResult } from 'pg'
import { row } from './row.type'

export interface ReturnResponseQuery<T extends row> {
  results: QueryResult<T>['rows']
  total: number
  totalPages: number
  currentPage: number
}

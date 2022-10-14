import { ReturnResponseQuery, row } from './'

export interface StoreUser extends row {
  id?: string
  username: string
  firstname: string
  lastname: string
  pass?: string
}

export type UserResponseQuery = ReturnResponseQuery<Omit<StoreUser, 'pass'>>

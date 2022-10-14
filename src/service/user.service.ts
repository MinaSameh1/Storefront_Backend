import { hashSync } from 'bcrypt'
import { userModel } from '../model'
import { StoreUser, UserResponseQuery } from '../types'
import { getPaginationInfo } from '../utils'

const model = new userModel()

export function createUser(user: StoreUser) {
  const pepper = process.env.BCRYPT_PASS ?? 'pass'
  const saltRounds: number = process.env.SALT_ROUNDS
    ? parseInt(process.env.SALT_ROUNDS)
    : 20
  const hash = hashSync(user.pass + pepper, saltRounds)
  return model.create({ ...user, pass: hash })
}

//// Function overloading

/**
 * @description Returns user, without pass!
 * @param {string} { id } to search with, if supplied only returns one row in results.
 * @returns {Promise<UserResponseQuery>} { results: [], total: number, totalPages: number, currentPage: number}
 */
export async function getUsers({
  // eslint-disable-next-line no-unused-vars
  id
}: {
  id: string
}): Promise<UserResponseQuery>

/**
 * @description Returns users, without pass!
 * @param {id} If supplied only returns one row
 * @returns {Promise<UserResponseQuery>} { results: [], total: number, totalPages: number, currentPage: number}
 */
export async function getUsers({
  // eslint-disable-next-line no-unused-vars
  id,
  // eslint-disable-next-line no-unused-vars
  limit,
  // eslint-disable-next-line no-unused-vars
  page
}: {
  id?: string
  limit: number
  page: number
}): Promise<UserResponseQuery>

export async function getUsers({
  id = undefined,
  limit = 20,
  page = 1
}: {
  id?: string
  limit?: number
  page?: number
}): Promise<UserResponseQuery> {
  if (id) {
    const result = await model.showById(id)

    return {
      results: [result],
      total: 1,
      totalPages: 1,
      currentPage: 1
    }
  }

  const select = 'SELECT * FROM store_users'
  if (page <= 0) {
    throw Error('Page must be positive number!')
  }
  const offset = (page - 1) * limit
  const params: Array<string | number> = [limit, offset]

  const { totalPages, total } = await getPaginationInfo({
    select,
    limit,
    params: params.length >= 3 ? [params[0]] : []
  })

  const result = await model.index(limit, offset)

  return {
    results: result.rows,
    total,
    totalPages,
    currentPage: page
  }
}

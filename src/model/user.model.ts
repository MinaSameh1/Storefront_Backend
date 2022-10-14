import { QueryResult } from 'pg'
import { StoreUser } from '../types'
import { query } from '../utils'

export class userModel {
  async showById(
    id: StoreUser['id']
  ): Promise<Omit<QueryResult<StoreUser>['rows'][0], 'pass'>> {
    const result = await query(
      'SELECT id, username, firstname, lastname FROM store_users WHERE id = $1',
      [id]
    )
    return result.rows[0]
  }

  showByUsername(
    username: StoreUser['username']
  ): Promise<QueryResult<StoreUser>> {
    return query('SELECT * FROM store_users WHERE username = $1', [username])
  }

  index(limit = 20, offset = 0): Promise<QueryResult<StoreUser>> {
    return query(
      'SELECT id,username, firstname, lastname FROM store_users LIMIT $1 OFFSET $2',
      [limit, offset]
    )
  }

  async create(
    user: StoreUser
  ): Promise<Omit<QueryResult<StoreUser>['rows'][0], 'pass'>> {
    // NOTE: The service encrypts the pass
    const result = await query(
      'SELECT id, username, firstname, lastname FROM insert_user($1, $2, $3, $4)',
      [user.username, user.firstname, user.lastname, user.pass]
    )
    return result.rows[0]
  }
}

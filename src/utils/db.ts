/**
 * @description This file is responsible for db connections.
 */
import { Pool, QueryResult } from 'pg'
import { logger } from './.'

/*
 * Pool connects and handles
 * From: https://node-postgres.com/features/connecting
 * NOTE: These are the vars it uses with examples:
 * PGUSER=dbuser
 * PGHOST=database.server.com
 * PGPASSWORD=secretpassword
 * PGDATABASE=mydb
 * PGPORT=3211
 */

let pool: Pool
let database: string

if (process.env['NODE_ENV'] === 'production') {
  database = String(process.env.POSTGRES_DB_PROD)
} else if (process.env['NODE_ENV'] === 'test') {
  database = String(process.env.POSTGRES_DB_TEST)
} else {
  database = String(process.env.POSTGRES_DB)
}
/*
 * @description responsible for connecting to the database.
 */
export function connect() {
  // As recommended by official docs to use pooling for web apps: https://node-postgres.com/features/pooling
  pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.PGHOST,
    database: database
  })
}

/*
 * @description responsible for disconnecting the database.
 */
export function disconnect() {
  pool.end()
}

/*
 * @description use the client for more than one sql Query
 * Do not forget to release the client!
 * EXAMPLE:
 * const client = await getClient()
 * const res = await client.query(query)
 * client.release()
 */
export function getClient() {
  return pool.connect()
}

/*
 * @description This will be used to run any single sql query,
 * Taken from the official Docs: https://node-postgres.com/guides/async-express
 * @param {String} sqlQuery: the SQL query
 * @param {Array<unknown>} params: Array of parameters for prepared statements, defaults to []
 */
export async function query(
  sqlQuery: string,
  params: Array<unknown> = []
): Promise<QueryResult> {
  const start = Date.now()
  const res = await pool.query(sqlQuery, params)
  // NOTE: Set pino logging level to info in prod!
  logger.debug(
    `Executed Query, ${sqlQuery} , Took ${Date.now() - start} with ${
      res.rowCount ?? 0
    }`
  )
  return res
}

export default query

import { query, connect, disconnect, getClient } from '../../utils'

describe('Database test', () => {
  beforeAll(async () => {
    connect()
  })

  afterAll(async () => {
    disconnect()
  })

  it('Should run query', async () => {
    const res = await query('SELECT NOW()')
    expect(res.rows).toBeDefined()
  })

  it('Should create client and run queries', async () => {
    // The client is used for multiple queries, should work.
    const client = await getClient()
    try {
      const res = await client.query('SELECT NOW()')
      expect(res.rows).toBeDefined()
      const res2 = await client.query('SELECT NOW()')
      expect(res2.rows).toBeDefined()
    } finally {
      client.release()
    }
  })
})

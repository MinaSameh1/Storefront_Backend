import request from 'supertest'
import express from 'express'
import { beforeHelper } from '../helpers'

describe('Server ping endpoint', () => {
  let app: express.Application

  beforeAll(() => {
    app = beforeHelper(true)
  })

  it('should ping back', async () => {
    const data = await request(app).get('/api/ping')
    expect(data.statusCode).toEqual(200)
    expect(data.body.message).toBeDefined()
  })
})

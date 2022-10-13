import request from 'supertest'
import express from 'express'
import { afterHelper, beforeHelper } from '../helpers'

describe('Server ping endpoint', () => {
  let app: express.Application

  beforeAll(() => {
    app = beforeHelper(true)
    process.env.LOG_LEVEL = 'silent' // Turn off pino
  })

  afterAll(() => {
    afterHelper()
  })

  it('should ping back', async () => {
    const data = await request(app).get('/api/ping')
    expect(data.statusCode).toEqual(200)
    expect(data.body.message).toBeDefined()
  })
})

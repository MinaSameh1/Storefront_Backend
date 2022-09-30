import request from 'supertest'
import express from 'express'
import { createExpressApp } from '../../server'

describe('Server ping endpoint', () => {
  let app: express.Application

  beforeAll(() => {
    app = createExpressApp()
    process.env.LOG_LEVEL = 'silent' // Turn off pino
  })

  it('should ping back', async () => {
    const data = await request(app).get('/api/ping')
    expect(data.statusCode).toEqual(200)
    expect(data.body.message).toBeDefined()
  })
})

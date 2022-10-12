import request from 'supertest'
import express from 'express'
import { faker } from '@faker-js/faker'
import { createExpressApp } from '../../server'
import { product } from 'src/schema'
import { connect, disconnect } from '../../utils'

describe('Product endpoint', () => {
  let app: express.Application

  const generateProduct = (): product => {
    return {
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      category: faker.commerce.productMaterial()
    }
  }

  const testProduct = generateProduct()

  beforeAll(() => {
    app = createExpressApp()
    connect()
    process.env.LOG_LEVEL = 'silent' // Turn off pino
  })

  afterAll(() => {
    disconnect()
  })

  describe('Create Route', () => {
    it('should not create on missing name', async () => {
      const res = await request(app)
        .post('/api/product')
        .send({})
        .set('Accept', 'application/json')
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      expect(res.body.error).toBeTrue()
    })

    it('should not create on missing price', async () => {
      const res = await request(app)
        .post('/api/product')
        .send({ name: 'test' })
        .set('Accept', 'application/json')
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      expect(res.body.error).toBeTrue()
    })

    it('should only accept category string', async () => {
      const product = generateProduct()
      const res = await request(app)
        .post('/api/product')
        .send({
          ...product,
          category: 1
        })
        .set('Accept', 'application/json')
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      expect(res.body.error).toBeTrue()
    })

    it('should disallow prices above 1000', async () => {
      const product = generateProduct()
      const res = await request(app)
        .post('/api/product')
        .send({
          ...product,
          price: 10000
        })
        .set('Accept', 'application/json')
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      expect(res.body.error).toBeTrue()
    })

    it('should disallow prices below 1', async () => {
      const product = generateProduct()
      const res = await request(app)
        .post('/api/product')
        .send({
          ...product,
          price: 0
        })
        .set('Accept', 'application/json')
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      expect(res.body.error).toBeTrue()
    })

    it('should create the product', async () => {
      const res = await request(app).post('/api/product').send(testProduct)
      expect(res.statusCode).toEqual(200)
      expect(res.body.id).toBeDefined()
      expect(res.body.name).toBeDefined()
      expect(res.body.price).toBeDefined()
    })

    it('should not create on using the same product name', async () => {
      const res = await request(app).post('/api/product').send(testProduct)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
    })

    it('should create the product without category', async () => {
      const product = generateProduct()
      product.category = undefined
      const res = await request(app).post('/api/product').send(product)
      expect(res.statusCode).toEqual(200)
      expect(res.body.id).toBeDefined()
      expect(res.body.name).toBeDefined()
      expect(res.body.price).toBeDefined()
    })
  })
})

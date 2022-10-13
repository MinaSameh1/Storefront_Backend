import request from 'supertest'
import express from 'express'
import { faker } from '@faker-js/faker'
import { createExpressApp } from '../../server'
import { product } from '../../types'
import { connect, disconnect } from '../../utils'

describe('Product endpoint', () => {
  let app: express.Application

  const generateProduct = (category?: string): product => {
    return {
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      category: category ?? faker.commerce.productMaterial()
    }
  }

  const testProduct = generateProduct('test')

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
      testProduct.id = res.body.id
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

  describe('Get route', () => {
    it('Should get products', async () => {
      const res = await request(app).get('/api/product')
      expect(res.statusCode).toEqual(200)
      expect(res.body.results).toBeDefined()
      expect(res.body.total).toBeGreaterThan(1)
      expect(res.body.totalPages).toBeGreaterThanOrEqual(1)
      expect(res.body.currentPage).toBeGreaterThanOrEqual(1)
    })

    it('Should return 404 for missing page', async () => {
      const res = await request(app).get('/api/product?page=100')
      expect(res.statusCode).toEqual(404)
      expect(res.body.message).toBeDefined()
      expect(res.body.totalPages).toBeGreaterThanOrEqual(1)
      expect(res.body.results).toBeUndefined()
      expect(res.body.total).toBeUndefined()
      expect(res.body.currentPage).toBeUndefined()
    })

    it('Should return 404 for non existing category', async () => {
      const res = await request(app).get('/api/product?category=doesnot')
      expect(res.statusCode).toEqual(404)
      expect(res.body.message).toBeDefined()
      expect(res.body.totalPages).toBeUndefined()
      expect(res.body.results).toBeUndefined()
      expect(res.body.total).toBeUndefined()
      expect(res.body.currentPage).toBeUndefined()
    })

    it('Should return 404 for non existing category', async () => {
      const res = await request(app).get('/api/product?category=doesnot')
      expect(res.statusCode).toEqual(404)
      expect(res.body.message).toBeDefined()
      expect(res.body.totalPages).toBeUndefined()
      expect(res.body.results).toBeUndefined()
      expect(res.body.total).toBeUndefined()
      expect(res.body.currentPage).toBeUndefined()
    })

    it('Should get products with category', async () => {
      const res = await request(app).get('/api/product?category=test')
      expect(res.statusCode).toEqual(200)
      expect(res.body.results).toBeDefined()
      expect(res.body.total).toBeGreaterThan(1)
      expect(res.body.totalPages).toBeGreaterThanOrEqual(1)
      expect(res.body.currentPage).toBeGreaterThanOrEqual(1)
    })

    it('Should get products with limit', async () => {
      const res = await request(app).get('/api/product?limit=10')
      expect(res.statusCode).toEqual(200)
      expect(res.body.results).toBeDefined()
      expect(res.body.total).toBeGreaterThan(1)
      expect(res.body.totalPages).toBeGreaterThanOrEqual(1)
      expect(res.body.currentPage).toBeGreaterThanOrEqual(1)
    })

    it('Should get products with page', async () => {
      const res = await request(app).get('/api/product?page=1')
      expect(res.statusCode).toEqual(200)
      expect(res.body.results).toBeDefined()
      expect(res.body.total).toBeGreaterThan(1)
      expect(res.body.totalPages).toBeGreaterThanOrEqual(1)
      expect(res.body.currentPage).toBeGreaterThanOrEqual(1)
    })

    it('Should get products with page and limit', async () => {
      const res = await request(app).get('/api/product?limit=2&page=1')
      expect(res.statusCode).toEqual(200)
      expect(res.body.results).toBeDefined()
      expect(res.body.total).toBeGreaterThan(1)
      expect(res.body.totalPages).toBeGreaterThanOrEqual(1)
      expect(res.body.currentPage).toBeGreaterThanOrEqual(1)
    })
  })
})

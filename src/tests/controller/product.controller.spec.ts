import express from 'express'
import request from 'supertest'
import { Product } from '../../types'
import { beforeHelper, generateProduct } from '../helpers'
import { createUser } from '../../service'
import { signJwt } from '../../utils'
import { generateUser } from '../helpers/generateUser'

describe('Product endpoint', () => {
  let app: express.Application
  let testProduct: Product

  beforeAll(async () => {
    // Generate fake products
    testProduct = generateProduct('test')

    // Create express app and connect to db.
    app = beforeHelper(true)
  })

  describe('Create Route', () => {
    let token: string

    beforeAll(async () => {
      // Create a user to create products with.
      const userData = generateUser()
      const result = await createUser(userData)
      expect(result.id).toBeInstanceOf(String)
      userData.id = String(result.id)
      token = signJwt(userData)
    })

    it('should not create on missing name', async () => {
      const res = await request(app)
        .post('/api/product')
        .send({})
        .set('Accept', 'application/json')
        .set('authorization', 'Bearer ' + token)

      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      expect(res.body.error).toBeTrue()
    })

    it('should not create on missing price', async () => {
      const res = await request(app)
        .post('/api/product')
        .send({ name: 'test' })
        .set('Accept', 'application/json')
        .set('authorization', 'Bearer ' + token)

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
        .set('authorization', 'Bearer ' + token)

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
        .set('authorization', 'Bearer ' + token)

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
        .set('authorization', 'Bearer ' + token)

      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      expect(res.body.error).toBeTrue()
    })

    it('should create the product', async () => {
      const res = await request(app)
        .post('/api/product')
        .send(testProduct)
        .set('authorization', 'Bearer ' + token)

      expect(res.statusCode).toEqual(200)
      expect(res.body.id).toBeDefined()
      testProduct.id = res.body.id
      expect(res.body.name).toBeDefined()
      expect(res.body.price).toBeDefined()
    })

    it('should not create on using the same product name', async () => {
      const res = await request(app)
        .post('/api/product')
        .send(testProduct)
        .set('authorization', 'Bearer ' + token)

      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
    })

    it('should create the product without category', async () => {
      const product = generateProduct()
      product.category = undefined
      const res = await request(app)
        .post('/api/product')
        .send(product)
        .set('authorization', 'Bearer ' + token)

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

    it('Should return 400 for bad uuid', async () => {
      const res = await request(app).get('/api/product/baduuid')
      expect(res.statusCode).toEqual(400)
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
      expect(res.body.total).toBeGreaterThanOrEqual(1)
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

    it('Should get product with uuid', async () => {
      const res = await request(app).get(`/api/product/${testProduct.id}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results).toBeDefined()
      expect(res.body.results.length).toEqual(1)
      // NOTE: This is done to change price to money format, ex: 70 to $70.00
      expect(res.body.results[0]).toEqual({
        ...testProduct,
        price: testProduct.price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
      })
      expect(res.body.total).toEqual(1)
      expect(res.body.totalPages).toEqual(1)
      expect(res.body.currentPage).toEqual(1)
    })
  })
})

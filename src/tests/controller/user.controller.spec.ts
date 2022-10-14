import { beforeHelper } from '../helpers'
import { generateUser } from '../helpers/generateUser'
import request from 'supertest'
import { Application } from 'express'
import { USER_ENDPOINT } from '../../utils'
import { createUser } from '../../service'

describe('User Route', () => {
  let app: Application

  beforeAll(() => {
    app = beforeHelper(true)
  })

  describe('Post ', () => {
    const user = generateUser()

    it('Should not create and warn on missing username', async () => {
      const badUser = generateUser()
      const result = await request(app)
        .post(USER_ENDPOINT)
        .send({ ...badUser, username: undefined })
      expect(result.statusCode).toEqual(400)
      expect(result.body.message).toBeDefined()
      expect(result.body.error).toBeTrue()
      expect(result.body.id).toBeUndefined()
    })

    it('Should not create and warn on missing password', async () => {
      const badUser = generateUser()
      const result = await request(app)
        .post(USER_ENDPOINT)
        .send({ ...badUser, pass: undefined })
      expect(result.statusCode).toEqual(400)
      expect(result.body.message).toBeDefined()
      expect(result.body.error).toBeTrue()
      expect(result.body.id).toBeUndefined()
    })

    it('Should not create and warn on wrong size pass', async () => {
      // Min
      const badUser = generateUser()
      let result = await request(app)
        .post(USER_ENDPOINT)
        .send({ ...badUser, pass: '1234' })
      expect(result.statusCode).toEqual(400)
      expect(result.body.message).toBeDefined()
      expect(result.body.error).toBeTrue()
      expect(result.body.id).toBeUndefined()
      // Max
      result = await request(app)
        .post(USER_ENDPOINT)
        .send({ ...badUser, pass: '1234567891011123451' })
      expect(result.statusCode).toEqual(400)
      expect(result.body.message).toBeDefined()
      expect(result.body.error).toBeTrue()
      expect(result.body.id).toBeUndefined()
    })

    it('Should create user', async () => {
      const result = await request(app).post(USER_ENDPOINT).send(user)
      expect(result.statusCode).toEqual(200)
      expect(result.body.username).toBeDefined()
      expect(result.body.firstname).toBeDefined()
      expect(result.body.lastname).toBeDefined()
      expect(result.body.pass).toBeUndefined()
    })

    it('Should fail on creating same username', async () => {
      const result = await request(app).post(USER_ENDPOINT).send(user)
      expect(result.statusCode).toEqual(400)
      expect(result.body.message).toBeDefined()
      expect(result.body.id).toBeUndefined()
    })
  })

  describe('Get ', () => {
    const userGet = generateUser()

    beforeAll(async () => {
      const result = await createUser(userGet)
      expect(result.id).toBeDefined()
      expect(result.id).toBeInstanceOf(String)
      userGet.id = String(result.id)
      let i = 4
      while (i > 0) {
        i--
        await createUser(generateUser())
      }
    })

    it('Should get products', async () => {
      const result = await request(app).get(USER_ENDPOINT)
      expect(result.statusCode).toEqual(200)
      expect(result.body.results).toBeDefined()
      expect(result.body.results.length).toBeGreaterThanOrEqual(1)
      expect(result.body.total).toBeGreaterThanOrEqual(1)
      expect(result.body.totalPages).toEqual(1)
      expect(result.body.currentPage).toEqual(1)
    })

    it('Should get one product by id', async () => {
      const result = await request(app).get(`${USER_ENDPOINT}/${userGet.id}`)
      expect(result.statusCode).toEqual(200)
      expect(result.body.results).toBeDefined()
      expect(result.body.results.length).toEqual(1)
      expect(result.body.total).toEqual(1)
      expect(result.body.totalPages).toEqual(1)
      expect(result.body.currentPage).toEqual(1)
    })

    it('Should get products limit and page query', async () => {
      const page = 2
      const limit = 2
      const result = await request(app).get(
        `${USER_ENDPOINT}?limit=${limit}&page=${page}`
      )
      expect(result.statusCode).toEqual(200)
      expect(result.body.results).toBeDefined()
      expect(result.body.results.length).toEqual(limit)
      expect(result.body.total).toBeGreaterThanOrEqual(4)
      expect(result.body.totalPages).toEqual(
        Math.ceil(result.body.total / limit)
      )
      expect(result.body.currentPage).toEqual(page)
    })
  })
})

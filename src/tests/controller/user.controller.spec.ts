import { beforeHelper, generateUser } from '../helpers'
import request from 'supertest'
import { Application } from 'express'
import { signJwt, USER_ENDPOINT } from '../../utils'
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
      expect(result.body.token).toBeDefined()
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
    let token: string

    beforeAll(async () => {
      const result = await createUser(userGet)
      expect(result.id).toBeDefined()
      expect(result.id).toBeInstanceOf(String)
      userGet.id = String(result.id)
      token = signJwt(userGet)

      for (let i = 0; i < 5; i++) await createUser(generateUser())
    })

    it(' Protected Should get users', async () => {
      const result = await request(app)
        .get(USER_ENDPOINT)
        .set('authorization', 'Bearer ' + token)

      expect(result.statusCode).toEqual(200)
      expect(result.body.results).toBeDefined()
      expect(result.body.results.length).toBeGreaterThanOrEqual(1)
      expect(result.body.total).toBeGreaterThanOrEqual(1)
      expect(result.body.totalPages).toEqual(1)
      expect(result.body.currentPage).toEqual(1)
    })

    it(' Protected Should get current user', async () => {
      const result = await request(app)
        .get(`${USER_ENDPOINT}/me`)
        .set('authorization', 'Bearer ' + token)

      expect(result.statusCode).toEqual(200)
      expect(result.body.id).toEqual(userGet.id)
      expect(result.body.username).toEqual(userGet.username)
      expect(result.body.firstname).toEqual(userGet.firstname)
      expect(result.body.lastname).toEqual(userGet.lastname)
    })

    it(' Protected Should get one user by id', async () => {
      const result = await request(app)
        .get(`${USER_ENDPOINT}/${userGet.id}`)
        .set('authorization', 'Bearer ' + token)
      expect(result.statusCode).toEqual(200)
      expect(result.body.results).toBeDefined()
      expect(result.body.results.length).toEqual(1)
      expect(result.body.total).toEqual(1)
      expect(result.body.totalPages).toEqual(1)
      expect(result.body.currentPage).toEqual(1)
    })

    it(' Protected Should get users limit and page query', async () => {
      const page = 2
      const limit = 2
      const result = await request(app)
        .get(`${USER_ENDPOINT}?limit=${limit}&page=${page}`)
        .set('authorization', 'Bearer ' + token)
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

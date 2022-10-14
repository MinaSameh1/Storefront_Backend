import { getUsers, createUser, loginUser } from '../../service'
import { beforeHelper } from '../helpers'
import { userModel } from '../../model'
import { generateUser } from '../helpers/generateUser'
import { StoreUser } from '../../types'
import { verifyJwt } from '../../utils'

describe('User Service', () => {
  const model = new userModel()
  const user: StoreUser = generateUser()

  beforeAll(async () => {
    beforeHelper()
    let i = 4
    while (i > 0) {
      i--
      await model.create(generateUser())
    }
  })

  it('Should create user', async () => {
    const result = await createUser(user)
    expect(result.id).toBeDefined()
    user.id = String(result.id)
    expect(result.username).toBeDefined()
    expect(result.pass).toBeUndefined()
  })

  it('Should get user by id', async () => {
    const result = await getUsers({ id: user.id ?? '' })
    expect(result.results[0].id).toBeDefined()
    expect(result.results[0].username).toBeDefined()
    expect(result.results[0].pass).toBeUndefined()
    expect(result.results[0].firstname).toBeDefined()
    expect(result.results[0].lastname).toBeDefined()
    expect(result.total).toEqual(1)
    expect(result.totalPages).toEqual(1)
    expect(result.currentPage).toEqual(1)
  })

  it('Should get users', async () => {
    const result = await getUsers({ id: undefined, limit: 20, page: 1 })
    expect(result.results[0].id).toBeDefined()
    expect(result.results[0].username).toBeDefined()
    expect(result.results[0].pass).toBeUndefined()
    expect(result.results[0].firstname).toBeDefined()
    expect(result.results[0].lastname).toBeDefined()
    expect(result.total).toBeGreaterThanOrEqual(4)
    expect(result.totalPages).toBeGreaterThanOrEqual(1)
    expect(result.currentPage).toEqual(1)
  })

  it('Should get users limit and page', async () => {
    const result = await getUsers({ id: undefined, limit: 2, page: 2 })
    expect(result.results[0].id).toBeDefined()
    expect(result.results[0].username).toBeDefined()
    expect(result.results[0].pass).toBeUndefined()
    expect(result.results[0].firstname).toBeDefined()
    expect(result.results[0].lastname).toBeDefined()
    expect(result.total).toBeGreaterThanOrEqual(4)
    expect(result.totalPages).toBeGreaterThanOrEqual(1)
    expect(result.currentPage).toEqual(2)
  })

  // Consider this a test for signJwt and verify as well.
  it('Should login in', async () => {
    const userLogin = generateUser()
    await createUser(userLogin)
    const token = await loginUser(userLogin)
    expect(token).toBeInstanceOf(String)
    const { expired } = verifyJwt(token ?? '')
    expect(expired).toBeFalse()
  })
})

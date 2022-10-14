import { userModel } from '../../model'
import { beforeHelper } from '../helpers'
import { generateUser } from '../helpers/generateUser'

describe('User model', () => {
  let model: userModel
  const user = generateUser()

  beforeAll(() => {
    model = new userModel()
    beforeHelper()
  })

  it('Should create user and pass be undefined', async () => {
    const result = await model.create(user)
    expect(result.id).toBeDefined()
    user.id = String(result.id)
    expect(result.username).toBeDefined()
    expect(result.pass).toBeUndefined()
  })

  it('Should get user by username', async () => {
    const result = await model.showByUsername(user.username)
    expect(result.rows.length).toEqual(1)
    expect(result.rows[0].id).toBeDefined()
    expect(result.rows[0].username).toEqual(user.username)
    expect(result.rows[0].firstname).toEqual(user.firstname)
    expect(result.rows[0].lastname).toEqual(user.lastname)
    expect(result.rows[0].pass).toBeDefined()
  })

  it('Should get user by id', async () => {
    const result = await model.showById(user.id)
    expect(result.id).toBeDefined()
    expect(result.username).toBeDefined()
    expect(result.pass).toBeUndefined()
  })

  it('Should get users without pass', async () => {
    const result = await model.index()
    expect(result.rows.length).toBeGreaterThanOrEqual(1)
    expect(result.rows[0].id).toBeDefined()
    expect(result.rows[0].username).toBeDefined()
    expect(result.rows[0].pass).toBeUndefined()
  })

  it('Should get users with limit and offset', async () => {
    let i = 5
    while (i > 0) {
      i--
      await model.create(generateUser())
    }
    const result = await model.index(2, 2)
    expect(result.rows.length).toBeGreaterThanOrEqual(1)
    expect(result.rows[0].id).toBeDefined()
    expect(result.rows[0].username).toBeDefined()
    expect(result.rows[0].pass).toBeUndefined()
  })
})

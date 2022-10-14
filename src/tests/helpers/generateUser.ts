import { faker } from '@faker-js/faker'
import { StoreUser } from '../../types'

export function generateUser(): StoreUser {
  const firstname = faker.name.firstName()
  const lastname = faker.name.lastName()

  return {
    username: faker.internet.userName(firstname, lastname),
    firstname,
    lastname,
    pass: faker.internet.password()
  }
}

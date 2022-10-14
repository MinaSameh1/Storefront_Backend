export const API_MAIN = '/api'

export const SERVER_ENDPOINT = `${API_MAIN}`

export const PRODUCT_ENDPOINT = `${API_MAIN}/product`

export const USER_ENDPOINT = `${API_MAIN}/user`

export const PEPPER = process.env.BCRYPT_PASS ?? 'pass'

export const SALT_ROUNDS: number = process.env.SALT_ROUNDS
  ? parseInt(process.env.SALT_ROUNDS)
  : 10

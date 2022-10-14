import jwt from 'jsonwebtoken'

// From the official docs: https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
export function signJwt(
  object: Record<string, unknown>, // object
  options?: jwt.SignOptions | undefined
) {
  return jwt.sign(object, process.env.TOKEN_SECRET ?? 'secret', {
    ...(options ?? undefined)
  })
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET ?? 'secret')
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (e) {
    return {
      valid: false,
      expired: e instanceof Error && e.message === 'jwt expired',
      decoded: null
    }
  }
}

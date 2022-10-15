import { NextFunction, Request, Response } from 'express'
import { verifyJwt } from '../utils'

/**
 * @description Verifys token, always continues next even if token not found.
 * The job of requireing user is left to another middleware.
 */
export async function deseralizeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers['authorization']?.replace(/Bearer/, '').trim()

    if (token) {
      const { decoded, expired } = verifyJwt(token)
      if (expired)
        return res.status(400).json({ message: 'Your token expired, relogin.' })

      if (decoded) res.locals.user = decoded
    }

    return next()
  } catch (err) {
    return next(err)
  }
}

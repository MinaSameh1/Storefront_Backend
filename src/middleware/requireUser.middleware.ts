import { NextFunction, Request, Response } from 'express'

/**
 * @description Makes sure we have the user before going next.
 */
export function requireUser(_: Request, res: Response, next: NextFunction) {
  if (res.locals.user) return next()

  return res.status(401).json({
    message: 'This requires login, using a bearer authorization token'
  })
}

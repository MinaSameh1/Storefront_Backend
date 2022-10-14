import { NextFunction, Request, Response } from 'express'

export function requireUser(req: Request, res: Response, next: NextFunction) {
  if (res.locals.user) return next()

  return res.status(401).json({
    message: 'This requires login, using a bearer authorization token'
  })
}

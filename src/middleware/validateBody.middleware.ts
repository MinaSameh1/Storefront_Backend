import { NextFunction, Request, Response } from 'express'
import { validateType } from '../types'

// Created this to make sure the body is good
export const validateBody =
  (body: validateType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // loop through the req.body
      for (const key of Object.keys(body)) {
        if (req.body[key] === undefined) {
          if (!body[key].optional) throw Error(`Missing ${key}!`)
        } else if (typeof req.body[key] !== body[key].type)
          throw Error(
            `Wrong type of ${key}, should be ${
              body[key].type
            } recieved ${typeof req.body[key]}!`
          )
      }
      next()
    } catch (err) {
      if (err instanceof Error)
        return res.status(400).json({ message: err.message, error: true })
    }
  }

export default validateBody

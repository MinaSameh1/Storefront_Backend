import { NextFunction, Request, Response } from 'express'
import { validateType } from '../types'

/**
 * @description Validates Body to be according to template
 * @param {validateType} body : Template of the body, see ValidateType.
 * Continues to next handler or returns 400 with message.
 */
export const validateBody =
  (body: validateType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // loop through the template keys
      for (const key of Object.keys(body)) {
        let max: number | undefined = undefined
        let min: number | undefined = undefined

        if (body[key].max) max = body[key].max
        if (body[key].min) min = body[key].min
        // If the value doesn't exist on body
        if (req.body[key] === undefined) {
          // Check if its optional or not
          if (!body[key].optional) throw Error(`Missing ${key}!`)
          // Check if the value is the same type as the template.
        } else if (typeof req.body[key] !== body[key].type)
          throw Error(
            `Wrong type of ${key}, should be ${
              body[key].type
            } recieved ${typeof req.body[key]}!`
          )
        // If there is min and max then check the value lays between them.
        else if ((max && max < req.body[key]) || (min && min > req.body[key])) {
          throw Error(
            `Number must be between ${min} and ${max} recieved ${req.body[key]}`
          )
        }
      }
      next()
    } catch (err) {
      if (err instanceof Error)
        // Returns 400 (Bad Request) with msg on why it happened.
        return res.status(400).json({ message: err.message, error: true })
    }
  }

export default validateBody

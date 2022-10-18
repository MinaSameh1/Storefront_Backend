import { NextFunction, Request, Response } from 'express'
import { validateType } from '../types'
import { lessThan, moreThan, validationError } from '../utils'

/**
 * @description Validates Body to be according to template
 * @param {validateType} template : Template of the body, see ValidateType.
 * Continues to next handler or returns 400 with message.
 */
export const validateBody =
  (template: validateType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // loop through the template keys
      for (const key of Object.keys(template)) {
        let max: number | undefined = undefined
        let min: number | undefined = undefined
        const element = req.body[key]

        if (template[key].max) max = template[key].max
        if (template[key].min) min = template[key].min
        // If the value doesn't exist on body
        if (element === undefined) {
          // Check if its optional or not
          if (!template[key].optional) {
            if (template[key].default) {
              req.body[key] = template[key].default
            } else throw new validationError(`Missing ${key}!`)
          }
          // Check if the value is the same type as the template.
        } else if (typeof element !== template[key].type)
          throw new validationError(
            `Wrong type of ${key}, should be ${
              template[key].type
            } recieved ${typeof element}!`
          )
        // If there is min and max then check the value lays between them.
        else if (
          (max && moreThan(element, max)) ||
          (min && lessThan(element, min))
        ) {
          throw new validationError(
            `${key} length must be between ${min} and ${max} recieved ${
              typeof element === 'string' ? element.length : element
            }`
          )
        }
      }
      next()
    } catch (err) {
      if (err instanceof validationError)
        // Returns 400 (Bad Request) with msg on why it happened.
        return res.status(400).json({ message: err.message, error: true })
      next(err)
    }
  }

export default validateBody

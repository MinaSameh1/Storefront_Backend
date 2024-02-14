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
        const element = req.body[key]
        const templateElement = template[key]

        // If the value doesn't exist on body
        if (element === undefined) {
          // Check if its optional or not
          if (!templateElement.optional) {
            if (templateElement.default) {
              req.body[key] = templateElement.default
            } else throw new validationError(`Missing ${key}!`)
          }
          // Check if the value is the same type as the template.
        } else if (typeof element !== templateElement.type)
          throw new validationError(
            `Wrong type of ${key}, should be ${
              templateElement.type
            } recieved ${typeof element}!`
          )
        // If there is min and max then check the value lays between them.
        else if (
          (templateElement.max && moreThan(element, max)) ||
          (templateElement.min && lessThan(element, min))
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

import { NextFunction, Request, Response } from 'express'
import { DatabaseError } from 'pg'
import { createUser, getUsers, loginUser } from '../service'
import { lessThan, signJwt, uuidValidate } from '../utils'
import { StoreUser } from '../types'

/**
 * @description Handles creating users.
 */
export async function createUserHandler(
  req: Request<unknown, unknown, StoreUser>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await createUser(req.body)
    result.token = signJwt(result)
    return res.status(200).json(result)
  } catch (err) {
    if (err instanceof DatabaseError) {
      // Error by database
      if (err.code === '23505')
        return res.status(400).json({ message: 'username already taken!' })
    }
    return next(err)
  }
}

/**
 * @description fetchs users, has pagination by default
 */
export async function getUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = parseInt(
      typeof req.query.limit === 'string' ? req.query.limit : '20'
    )

    const page = parseInt(
      typeof req.query.page === 'string' ? req.query.page : '1'
    )

    if (lessThan(page, 1)) {
      return res.status(400).json({
        message: 'Page must be positive number!'
      })
    }

    if (req.params.id && !uuidValidate(req.params.id)) {
      return res.status(400).json({
        message: 'Bad uuid!'
      })
    }

    const result = await getUsers({
      id: req.params.id ?? undefined,
      limit,
      page
    })

    if (result) {
      if (result.currentPage - 1 > result.totalPages) {
        return res.status(404).json({
          message: 'This page or user doesnt exist!',
          totalPages: result.totalPages
        })
      }
      if (result.results.length === 0) {
        return res.status(404).json({ message: 'user doesnt exist!' })
      }
      return res.status(200).json(result)
    }
    return res.status(400).json({ message: 'User doesnt exist!' })
  } catch (err) {
    return next(err)
  }
}

export async function loginUserHandler(
  req: Request<unknown, unknown, Pick<StoreUser, 'username' | 'pass'>>,
  res: Response,
  next: NextFunction
) {
  try {
    // Since we validated the body early in the route we can trust that it has username and pass
    // Deconstruct it and take those in the function loginUser.
    const token = await loginUser(req.body)
    if (token) {
      return res.status(200).json({ token: token })
    }
    return res.status(400).json({ message: 'Bad username/pass!' })
  } catch (err) {
    return next(err)
  }
}

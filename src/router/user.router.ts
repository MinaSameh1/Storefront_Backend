import { Router } from 'express'
import {
  createUserHandler,
  getUsersHandler,
  loginUserHandler
} from '../controller'
import { validateBody } from '../middleware'
import { userLoginTemplate, userTemplate } from '../schema'
import { USER_ENDPOINT } from '../utils'
import { requireUser } from '../middleware'

export const userRouter = Router()

userRouter.get(USER_ENDPOINT, requireUser, getUsersHandler)
userRouter.get(`${USER_ENDPOINT}/:id`, requireUser, getUsersHandler)

userRouter.post(
  `${USER_ENDPOINT}/login`,
  validateBody(userLoginTemplate),
  loginUserHandler
)
userRouter.post(USER_ENDPOINT, validateBody(userTemplate), createUserHandler)

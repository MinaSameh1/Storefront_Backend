import { Router } from 'express'
import { createUserHandler, getUsersHandler } from '../controller'
import { validateBody } from '../middleware'
import { userTemplate } from '../schema'
import { USER_ENDPOINT } from '../utils'

export const userRouter = Router()

userRouter.get(USER_ENDPOINT, getUsersHandler)
userRouter.get(`${USER_ENDPOINT}/:id`, getUsersHandler)
userRouter.post(USER_ENDPOINT, validateBody(userTemplate), createUserHandler)

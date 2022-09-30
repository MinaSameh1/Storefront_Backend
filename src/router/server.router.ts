import { Router } from 'express'
import { serverCheckhealthController } from '../controller'
import { SERVER_ENDPOINT } from '../utils'

export const serverRouter = Router()

serverRouter.get(`${SERVER_ENDPOINT}/ping`, serverCheckhealthController)

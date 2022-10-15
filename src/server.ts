import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import pinoExpress from 'express-pino-logger'
import helmet from 'helmet'
import { getLogger } from './utils'

import path from 'path'
import { deseralizeUser } from './middleware'
import { productRouter, serverRouter, userRouter } from './router'

/*
 * @description: Configures the express server, from json space to cors.
 */
function configureServer(app: express.Application) {
  dotenv.config({
    path: path.resolve(
      process.cwd(),
      `.env.${process.env.NODE_ENV ?? 'development'}`
    )
  })
  app.set('json spaces', 2) // I like the spaces to be 2.
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(helmet()) // Security
  app.use(cors())
  // Use pino to log requests, Note: Depends on ENV.LOG_LEVEL
  app.use(pinoExpress({ logger: getLogger() }))
}

/*
 * @description Adds middlewares to the app
 */
function addMiddleware(app: express.Application) {
  app.use(deseralizeUser)
}

/*
 * @description Adds the routes to the app, along with an error handler.
 */
function addRoutes(app: express.Application, Routes: Array<express.Router>) {
  for (const route of Routes) {
    app.use(route)
  }

  // Error handling, from express official docs: https://expressjs.com/en/guide/error-handling.html
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      // eslint-disable-next-line no-unused-vars
      _: express.NextFunction
    ) => {
      req.log.error({
        errorName: err.name,
        message: err.message,
        stack: err.stack || 'no stack defined!'
      })
      return res
        .status(500)
        .json({ message: 'Internal Server Error', Error: true })
    }
  )
}

/*
 * @description Creates Express App, and configures it.
 * @returns {express.Application} Express App.
 */
export function createExpressApp(): express.Application {
  const app = express()
  const Routes = [serverRouter, productRouter, userRouter]
  configureServer(app) // first config
  addMiddleware(app) // then global middleware
  addRoutes(app, Routes) // then routes :D
  return app
}

export default createExpressApp

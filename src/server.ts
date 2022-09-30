import express from 'express'
import 'dotenv/config'
import helmet from 'helmet'
import pinoExpress from 'express-pino-logger'
import cors from 'cors'
import { logger } from './utils'

import { serverRouter } from './router'
import { Router } from 'express-serve-static-core'

/*
 * @description: Configures the express server, from json space to cors.
 */
function configureServer(app: express.Application) {
  app.set('json spaces', 2) // I like the spaces to be 2.
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(helmet()) // Security
  app.use(cors())
  // Use pino to log requests, Note: Depends on ENV.LOG_LEVEL
  app.use(pinoExpress({ logger }))
}

/*
 * @description Adds the routes to the app, along with an error handler.
 */
function addRoutes(app: express.Application, Routes: Array<Router>) {
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
  const Routes = [serverRouter]
  configureServer(app)
  addRoutes(app, Routes)
  return app
}

export default createExpressApp

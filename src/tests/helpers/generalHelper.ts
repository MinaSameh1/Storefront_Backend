/* eslint-disable no-unused-vars */
import { Application } from 'express'
import createExpressApp from '../../server'
import { connect, disconnect } from '../../utils'
import * as dotenv from 'dotenv'
import path from 'path'

//// Function overload
/**
 * @description connects to db and set pino to silent, if supplied with true returns expressApplication
 * @param {boolean} startServer will generate express application
 * @returns {Application | undefined} ExpressApp if supplied true else nothing.
 */
export function beforeHelper(startServer: boolean): Application
export function beforeHelper(): undefined
export function beforeHelper(startServer = false): Application | undefined {
  // Load .env.test
  dotenv.config({
    path: path.resolve(
      process.cwd(),
      `.env.${process.env.NODE_ENV ?? 'development'}`
    )
  })
  // Connect to db.
  connect()
  process.env.LOG_LEVEL = 'silent' // Turn off pino

  // Create express app
  if (startServer) return createExpressApp()
}

/**
 * @description disconnects db.
 * @returns {void}
 */
export function afterHelper(): void {
  disconnect()
}

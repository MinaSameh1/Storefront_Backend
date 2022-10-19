/* eslint-disable no-unused-vars */
import { Application } from 'express'
import createExpressApp from '../../server'
import { connect, disconnect } from '../../utils'
import 'dotenv/config'

//// Function overload
/**
 * @description connects to db and set pino to silent, if supplied with true returns expressApplication
 * @param {boolean} startServer will generate express application
 * @returns {Application | undefined} ExpressApp if supplied true else nothing.
 */
export function beforeHelper(startServer: boolean): Application
export function beforeHelper(): undefined
export function beforeHelper(startServer = false): Application | undefined {
  // Connect to db.
  connect()

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

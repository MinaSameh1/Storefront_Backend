import { createExpressApp } from './server'
import { logger, connect, disconnect } from './utils'

/*
 * @description Starts the expressjs server
 */
function startServer() {
  const Port = process.env.PORT || 8000
  const app = createExpressApp() // Get our express instance
  connect() // Database
  return app.listen(Port, () => {
    logger.info(`API is listening to ${Port}`)
  })
}

/*
 * @description Gracefully shutdowns the server.
 * - Disconnects from db
 */
function shutdown(signal: string) {
  return async (err: unknown) => {
    logger.info(`Recieved ${signal}, shutting down gracefully`)
    if (err) {
      logger.error(err)
    }

    setTimeout(function () {
      logger.error('could not close gracefully, bailling.')
      process.exit(1)
    }, 10000)

    server.close(async () => {
      disconnect()
      logger.info('Server Shutdown gracefully')
      process.exit(err ? 1 : 0)
    })
  }
}

const server = startServer()

process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT', shutdown('SIGINT'))
  .on('uncaughtException', shutdown('uncaughtException'))

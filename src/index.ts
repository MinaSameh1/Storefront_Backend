import { createExpressApp } from './server'
import { logger } from './utils'

/*
 * @description Starts the expressjs server
 */
function startServer() {
  const Port = process.env.PORT || 8000
  const app = createExpressApp()
  app.listen(Port, () => {
    logger.info(`API is listening to ${Port}`)
  })
}

startServer()

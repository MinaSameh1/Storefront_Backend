/*
 * Config file for pino
 * From: https://github.com/pinojs/pino-pretty#programmatic-integration
 */

import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname',
      translateTime: 'SYS:standard'
    }
  }
})

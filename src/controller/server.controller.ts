import { Request, Response } from 'express'

export function serverCheckhealthController(_: Request, res: Response) {
  return res.status(200).json({ message: 'pong! Server is working.' })
}

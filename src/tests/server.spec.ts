import express from 'express'
import { createExpressApp } from '../server'

describe('Create Express App Should create the server', () => {
  let app: express.Application

  beforeAll(() => {
    app = createExpressApp()
  })

  it('Should create the app', () => {
    expect(typeof app === typeof express()).toBeTrue()
  })
})

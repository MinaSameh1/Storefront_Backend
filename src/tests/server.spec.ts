import express from 'express'
import { beforeHelper } from './helpers'

describe('Create Express App Should create the server', () => {
  let app: express.Application

  beforeAll(() => {
    app = beforeHelper(true)
  })

  it('Should create the app', () => {
    expect(typeof app === typeof express()).toBeTrue()
  })
})

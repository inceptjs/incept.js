const { expect } = require('chai')
const { EventEmitter } = require('@inceptjs/types')
const { Route, Request, Response } = require('../dist')

describe('Route', () => {
  it('Should handle', async () => {
    const emitter = new EventEmitter
    const route = new Route('foobar', emitter)
    const req = new Request
    const res = new Response

    req.params.foo = 'bar'

    let prepared = false
    emitter.on('request', req => {
      expect(emitter.event.event).to.equal('request')
      expect(req.params.foo).to.equal('bar')
      prepared = true
    })

    let dispatched = false
    emitter.on('response', () => {
      dispatched = true
    })

    let processed = false
    emitter.on('foobar', req => {
      expect(emitter.event.event).to.equal('foobar')
      expect(req.params.foo).to.equal('bar')
      processed = true
    })

    let errored = false
    emitter.on('error', error => {
      expect(error.message).to.equal('Not Found')
      errored = true
    })

    await route.handle(req, res)

    expect(prepared).to.equal(true)
    expect(processed).to.equal(true)
    expect(dispatched).to.equal(true)
    expect(errored).to.equal(true)

    errored = false
    emitter.on('foobar', (req, res) => {
      res.write({ foo: 'bar' })
    })

    await route.handle(req, res)
    expect(errored).to.equal(false)
    expect((await res.json()).foo).to.equal('bar')

    res.write({ foo: 'zoo' })
    emitter.on('request', () => {
      return false
    })

    await route.handle(req, res)
    expect((await res.json()).foo).to.equal('zoo')
  })
})
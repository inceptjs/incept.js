const { expect } = require('chai')
const { Router, Request, Response } = require('../dist')

describe('Router', () => {
  it('Should route', async () => {
    const router = new Router
    const route = router.route('foobar')
    const req = new Request
    const res = new Response

    req.params.set('foo', 'bar')

    let prepared = false
    router.on('request', req => {
      expect(router.event.event).to.equal('request')
      expect(req.params.get('foo')).to.equal('bar')
      prepared = true
    })

    let dispatched = false
    router.on('response', () => {
      dispatched = true
    })

    let processed = false
    router.on('foobar', () => {
      expect(router.event.event).to.equal('foobar')
      expect(req.params.get('foo')).to.equal('bar')
      processed = true
    })

    let errored = false
    router.on('error', error => {
      expect(error.message).to.equal('Not Found')
      errored = true
    })

    await route.handle(req, res)

    expect(prepared).to.equal(true)
    expect(processed).to.equal(true)
    expect(dispatched).to.equal(true)
    expect(errored).to.equal(true)
  })

  it('Should allow middleware', async() => {
    const router = new Router

    let prepared = false
    //this is for express innterface matching
    router.use((req, res, next) => {
      expect(req.foo).to.equal('bar')
      expect(res.bar).to.equal('foo')
      next()
      prepared = true
    })

    let dispatched = false
    router.on('response', () => {
      dispatched = true
    })

    let processed = false
    router.on('GET ', () => {
      processed = true
    })
    
    let errored = false
    router.on('error', error => {
      expect(error.message).to.equal('Not Found')
      errored = true
    })

    await router.handle({foo: 'bar'}, {bar: 'foo'})

    expect(prepared).to.equal(true)
    expect(processed).to.equal(true)
    expect(dispatched).to.equal(true)
    expect(errored).to.equal(true)
  })
})
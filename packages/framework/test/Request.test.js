const { expect } = require('chai')
const { Request } = require('../dist')

describe('Request', () => {
  it('Should set/get header', async() => {
    const request = new Request
    request.headers.set('Content-Type', 'text/html')
    expect(request.headers.get('Content-Type')).to.equal('text/html')
  })

  it('Should set/get body', async() => {
    const request = new Request(null, { method: 'POST' })
    request.write('hello')
    expect(await request.text()).to.equal('hello')
  })

  it('Should get the correct body type/name', async() => {
    const request = new Request(null, { method: 'POST' })
    expect(request.typeof).to.equal('undefined')
    expect(request.nameof).to.equal(null)
    request.write('hello')
    expect(request.typeof).to.equal('string')
    expect(request.nameof).to.equal('String')
    request.write(4)
    expect(request.typeof).to.equal('number')
    expect(request.nameof).to.equal('Number')
    request.write(() => {})
    expect(request.typeof).to.equal('function')
    expect(request.nameof).to.equal('Function')
    request.write(true)
    expect(request.typeof).to.equal('boolean')
    expect(request.nameof).to.equal('Boolean')
    request.write({})
    expect(request.typeof).to.equal('object')
    expect(request.nameof).to.equal('Object')
    request.write(new Request)
    expect(request.typeof).to.equal('object')
    expect(request.nameof).to.equal('Request')
  })

  it('Should set/get params', async() => {
    const request = new Request
  
    request.set('foo', 'bar')
    expect(request.get('foo')).to.equal('bar')
    expect(request.params.foo).to.equal('bar')

    request.params.bar = 'foo'
    expect(request.get('bar')).to.equal('foo')
    expect(request.params.bar).to.equal('foo')

    request.params = { foo: 'bar' }
    expect(request.get('foo')).to.equal('bar')
    expect(request.params.foo).to.equal('bar')
    expect(() => request.params = 'foo').to.throw()

    request.set({ zoo: 'bar' })
    expect(request.get('zoo')).to.equal('bar')
    expect(request.params.zoo).to.equal('bar')

    const request2 = new Request
    request2.params.foo = 'bar'
    request2.assign({ bar: 'foo' }, { zoo: 'bar' })
    expect(request2.params.foo).to.equal('bar')
    expect(request2.params.bar).to.equal('foo')
    expect(request2.params.zoo).to.equal('bar')
  })

  it('Should instantiate unknown host', async() => {
    const request = new Request('/about')
  
    expect(request.host).to.equal('unknownhost')
    expect(request.pathname).to.equal('/about')
  })

  it('Should get the right route params', async() => {
    const request = new Request('http://localhost/foo/bar')
    //stars
    const routeParams1 = request.routeParams('**')
    expect(routeParams1.args[0]).to.equal('')
    expect(routeParams1.args[1]).to.equal('foo')
    expect(routeParams1.args[2]).to.equal('bar')
    //slash stars
    const routeParams2 = request.routeParams('/**')
    expect(routeParams2.args[0]).to.equal('foo')
    expect(routeParams2.args[1]).to.equal('bar')
    //one star
    const routeParams3 = request.routeParams('/*/bar')
    expect(routeParams3.args[0]).to.equal('foo')
    //variable
    const routeParams4 = request.routeParams('/:foo/bar')
    expect(routeParams4.params.foo).to.equal('foo')
    //star variable
    const routeParams5 = request.routeParams('/*/:bar')
    expect(routeParams5.args[0]).to.equal('foo')
    expect(routeParams5.params.bar).to.equal('bar')
    //zoo doesn't match
    const routeParams6 = request.routeParams('/*/bar/zoo')
    expect(routeParams6.args.length).to.equal(0)
    expect(Object.keys(routeParams6.params).length).to.equal(0)
    //no soft match
    const routeParams7 = request.routeParams('/*')
    expect(routeParams7.args.length).to.equal(0)
  })

  it('Should get correct URL parameters', async() => {
    const request = new Request('http://127.0.0.1:3000/some/path?lets=dothis#yep')
    expect(request.hash).to.equal('#yep')
    expect(request.host).to.equal('127.0.0.1:3000')
    expect(request.hostname).to.equal('127.0.0.1')
    expect(request.url).to.equal('http://127.0.0.1:3000/some/path?lets=dothis#yep')
    expect(request.origin).to.equal('http://127.0.0.1:3000')
    expect(request.pathname).to.equal('/some/path')
    expect(request.port).to.equal('3000')
    expect(request.protocol).to.equal('http:')
    expect(request.search).to.equal('?lets=dothis')
  })
})

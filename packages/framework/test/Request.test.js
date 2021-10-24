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

  it('Should set/get params', async() => {
    const request = new Request
  
    request.params.set('foo', 'bar')
    expect(request.params.get('foo')).to.equal('bar')

    request.params = { foo: 'bar' }
    expect(request.params.get('foo')).to.equal('bar')
    expect(() => request.params = 'foo').to.throw()
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

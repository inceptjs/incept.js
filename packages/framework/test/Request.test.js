const { expect } = require('chai')
const { Request } = require('../dist')

describe('Request', () => {
  it('Should set/get header/body/status/param', () => {
    const request = new Request
    request.headers('Content-Type', 'text/html')
    expect(request.headers('Content-Type')).to.equal('text/html')
    expect(request.headers['Content-Type']).to.equal('text/html')
  
    request.body = 'hello'
    expect(request.body).to.equal('hello')
  
    request.status(200, 'OK')
    const status = request.status()
    expect(status.code).to.equal(200)
    expect(status.text).to.equal('OK')
  
    request.params.foo = 'bar'
    expect(request.params.foo).to.equal('bar')
  })
})

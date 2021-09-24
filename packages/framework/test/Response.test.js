const { expect } = require('chai')
const { Response } = require('../dist')

describe('Response', () => {
  it('Should set/get header/body/status', () => {
    const response = new Response
    response.headers('Content-Type', 'text/html')
    expect(response.headers('Content-Type')).to.equal('text/html')
    expect(response.headers['Content-Type']).to.equal('text/html')

    response.body = 'hello'
    expect(response.body).to.equal('hello')

    response.status(200, 'OK')
    const status = response.status()
    expect(status.code).to.equal(200)
    expect(status.text).to.equal('OK')
  })

  it('Should not allow setting header directly', () => {
    const response = new Response
    response.headers('Content-Type', 'text/html')
    response.headers['Content-Type'] = 'text/json'
    expect(response.headers['Content-Type']).to.equal('text/html')
  })
})

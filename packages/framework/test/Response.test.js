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

  it('Should parse body', () => {
    const response = new Response

    response.headers('Content-Type', 'text/json')
    response.write('{"foo":"bar"}')
    expect(response.parse().foo).to.equal('bar')
    
    response.headers('Content-Type', 'application/json')
    expect(response.parse().foo).to.equal('bar')

    response.headers('Content-Type', 'application/x-www-form-urlencoded')
    response.write('foo=bar')
    expect(response.parse().foo).to.equal('bar')

    response.headers('Content-Type', 'multipart/form-data')
    response.write(multipart)
    const parsed = response.parse()
    expect(parsed.foo).to.equal('bar')

    expect(parsed.uploads[0].name).to.equal('somebinary.dat')
    expect(parsed.uploads[0].type).to.equal('application/octet-stream')
    expect(parsed.uploads[0].data.toString()).to.equal('some binary data...maybe the bits of a image..')
    
    expect(parsed.uploads[1].name).to.equal('sometext.txt')
    expect(parsed.uploads[1].type).to.equal('text/plain')
    expect(parsed.uploads[1].data.toString()).to.equal('hello world')
  })
})

const multipart =
`------WebKitFormBoundaryDtbT5UpPj83kllfw
Content-Disposition: form-data; name="uploads[]"; filename="somebinary.dat"
Content-Type: application/octet-stream

some binary data...maybe the bits of a image..
------WebKitFormBoundaryDtbT5UpPj83kllfw
Content-Disposition: form-data; name="foo"

bar
------WebKitFormBoundaryDtbT5UpPj83kllfw
Content-Disposition: form-data; name="uploads[]"; filename="sometext.txt"
Content-Type: text/plain

hello world
------WebKitFormBoundaryDtbT5UpPj83kllfw--` 
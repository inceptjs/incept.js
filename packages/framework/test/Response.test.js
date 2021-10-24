const { expect } = require('chai')
const { Response } = require('../dist')

describe('Response', () => {
  it('Should set/get status', () => {
    const response = new Response

    response.setStatus(200, 'OK')
    expect(response.status).to.equal(200)
    expect(response.statusText).to.equal('OK')
  })

  it('Should read json', async() => {
    const res = new Response({foo: 'bar'})
    const actual = await res.json()
    expect(actual.foo).to.equal('bar')
  })

  it('Should read text', async() => {
    const res = new Response('foobar')
    const actual = await res.text()
    expect(actual).to.equal('foobar')
  })

  it('Should read blob', async() => {
    const res = new Response('foobar')
    const actual = await res.blob()
    expect(await actual.text()).to.equal('foobar')
  })

  it('Should read form data', async() => {
    const res = new Response('foobar')
    const actual = await res.blob()
    expect(await actual.text()).to.equal('foobar')
  })

  it('Should read array buffer', async() => {
    const res = new Response('foobar')
    const actual = await res.arrayBuffer()
    expect(actual.byteLength).to.equal(6)
  })

  it('Should read headers', async() => {
    const res = new Response({foo: 'bar'}, {
      headers: { 'content-type': 'application/json' }
    })
    expect(res.headers.get('content-type')).to.equal('application/json')

    res.headers.append('Accept', 'text/json')
    res.headers.append('Accept', 'application/json')
    expect(res.headers.get('accept')).to.equal('text/json, application/json')
  })

  it('Should parse body', async() => {
    const response = new Response

    expect(response.filled).to.equal(false)

    response.write('foo=bar')
    const queryParsed = await response.fromURLQuery()
    expect(queryParsed.foo).to.equal('bar')

    expect(response.filled).to.equal(true)

    response.write(multipart)
    const multipartParsed = await response.fromFormData()
    expect(multipartParsed.foo).to.equal('bar')

    expect(multipartParsed.uploads[0].name).to.equal('somebinary.dat')
    expect(multipartParsed.uploads[0].type).to.equal('application/octet-stream')
    expect(multipartParsed.uploads[0].data.toString()).to.equal('some binary data...maybe the bits of a image..')
    
    expect(multipartParsed.uploads[1].name).to.equal('sometext.txt')
    expect(multipartParsed.uploads[1].type).to.equal('text/plain')
    expect(multipartParsed.uploads[1].data.toString()).to.equal('hello world')
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
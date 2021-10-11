const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const VirtualFS = require('../dist/VirtualFS').default

describe('Base Tests', () => {
  beforeEach(() => {
    this.vfs = new VirtualFS
    this.vfs.patchFS()
  })
  afterEach(() => this.vfs.revertPatch())

  it('Should be able to throw errors', () => {
    const file = `/no/dir/error/static.js`
    expect(() => this.vfs.union.watch(file)).to.throw()
    expect(() => this.vfs.watch(file)).to.throw()
    this.vfs.revertPatch()
    expect(() => fs.watch(file)).to.throw()
  })

  it('Should read a file from an existing file', () => {
    const file = `${__dirname}/assets/number.json`
    const code = '{"number":1}'
    
    expect(fs.readFileSync(file).toString()).to.equal(code)
    expect(require(file).number).to.equal(1)
  })

  it('Should statically read from vfs using `fs` and `require`', () => {
    const file = `${__dirname}/assets/static.js`
    const code = 'module.exports = "Static"'
    this.vfs.mkdirSync(`${__dirname}/assets`, { recursive: true })
    this.vfs.writeFileSync(file, code)
    
    expect(fs.readFileSync(file).toString()).to.equal(code)
    expect(require(file)).to.equal('Static')
  })

  it('Should require a node module', () => {
    const dirname = path.dirname(__dirname)
    this.vfs.mkdirSync(
      path.join(dirname, 'node_modules'),
      { recursive: true }
    )
    this.vfs.writeFileSync(
      path.join(dirname, 'node_modules/foo.js'), 
      'module.exports = { foo: "foo" }'
    )

    const foo = require('foo')
    expect(foo.foo).to.equal('foo')
  })

  it('Should require from relative files', () => {
    const file = `${__dirname}/assets/static.js`
    const code = 'module.exports = "Static"'
    this.vfs.mkdirSync(`${__dirname}/assets`, { recursive: true })
    this.vfs.writeFileSync(file, code)
    
    expect(require('./assets/static')).to.equal('Static')
  })

  it('Should require from parent files', () => {
    const dirname = path.dirname(__dirname)
    const file = `${dirname}/assets/static.js`
    const code = 'module.exports = "Static"'
    this.vfs.mkdirSync(`${dirname}/assets`, { recursive: true })
    this.vfs.writeFileSync(file, code)
    
    expect(require('../assets/static')).to.equal('Static')
  })

  it('Should route and dynamically read from vfs using `fs` and `require`', () => {
    const route = `${__dirname}/assets/post/:id/info.json`
    this.vfs.route(route, (filename, res, vfs) => {
      res.body = vfs.routeParams(filename, route)
    })

    const test = `${__dirname}/assets/post/1/info.json`
    expect(fs.readFileSync(test).toString())
    expect(require(`./assets/post/1/info.json`).params.id).to.equal('1')
  })

  it('Virtual Files should be able to call each other', () => {
    this.vfs.mkdirSync('/my/assets', { recursive: true })
    this.vfs.writeFileSync(
      '/my/assets/source.js', 
      'module.exports = require("/your/assets/destination.js")'
    )

    this.vfs.mkdirSync('/your/assets', { recursive: true })
    this.vfs.writeFileSync(
      '/your/assets/destination.js', 
      'module.exports = 1'
    )

    expect(require('/my/assets/source')).to.equal(1)
  })

  it('Virtual Files should be able to relatively call each other', () => {
    this.vfs.mkdirSync('/my/assets', { recursive: true })
    this.vfs.writeFileSync(
      '/my/assets/source.js', 
      'module.exports = require("./destination.js")'
    )

    this.vfs.writeFileSync(
      '/my/assets/destination.js', 
      'module.exports = 1'
    )

    expect(require('/my/assets/source')).to.equal(1)
  })

  it('Virtual Files should be able to relatively call each other using a route', () => {
    this.vfs.route('/my/routes/**', (filename, res, vfs) => {
      const params = vfs.routeParams(filename, '/my/routes/**')
      const path = params.args.join('/')
      if (path === 'route/1.js') {
        res.body = 'module.exports = require("./2")'
      } else if (path === 'route/2.js') {
        res.body = 'module.exports = 1'
      }
    })

    expect(require('/my/routes/route/1')).to.equal(1)
  })
})


const { expect } = require('chai')
const VirtualFS = require('../dist/VirtualFS').default
const babel = require('@babel/core')
const ReactIs = require('react-is')

describe('Babel Tests', () => {
  beforeEach(() => {
    this.vfs = new VirtualFS
    this.vfs.patchFS()
  })
  afterEach(() => this.vfs.revertPatch())

  it('Should import module function', () => {
    this.vfs.addRule(/(?!node_modules)\.(js)$/, (file, code) => {
      return babel.transform(code, {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react'
        ]
      }).code
    })
    
    const route = `${__dirname}/node_modules/ghost/**`;
    this.vfs.route(route, function(filename, res, vfs) {
      const params = vfs.routeParams(filename, route)
      const path = params.args.join('/')
      if (path === 'no-transform.js') {
        //this automatically transforms because of the .js extension
        res.write([
          `import React from 'react'`,
          `export default (<h1>Hello</h1>)`
        ].join("\n"))
      } else if (path === 'components/Link') {
        res.write(vfs.transform('.js', [
          `import React from 'react'`,
          `import Header from './Header'`,
          `export default <Header><a href="/">Hello</a></Header>`
        ].join("\n")))
      } else if (path === 'components/Header') {
        res.write(vfs.transform('.js', [
          `import React from 'react'`,
          `export default ({children}) => (<h1>{children}</h1>)`
        ].join("\n")))
      }
    })

    const actual1 = require('ghost/no-transform').default
    expect(ReactIs.isElement(actual1)).to.equal(true)
    const actual2 = require('ghost/components/Link').default
    expect(ReactIs.isElement(actual2)).to.equal(true)
  })
})
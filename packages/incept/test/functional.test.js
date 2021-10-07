const path = require('path')
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../dist/babel/defaults').default
const Application = require('../dist/types/Application').default
const develop = require('../dist/plugin/develop').default
const terminal = require('../dist/plugin/terminal').default

const cwd = path.join(__dirname, 'sandbox')

describe('Functional Tests', async () => {
  const app = new Application({ cwd })
  before((done) => {
    require('@babel/register')(config)
    //from boot.ts
    app.bootstrap(terminal)
    app.bootstrap(develop)
    app.load()
    app.plugin('terminal').emit(cwd, ['npm', 'run', 'dev', '--port=8080'])
    app.on('dev-ready', () => done())
  })

  it('Should load home page', async () => {
    const response = await fetch('http://127.0.0.1:8080/')
    const body = await response.text()
    expect(body).to.contain('<h1>Welcome to Incept.js</h1>')
  })

  it('Should load about page', async () => {
    const response = await fetch('http://127.0.0.1:8080/about')
    const body = await response.text()
    expect(body).to.contain('<h1>About</h1>')
  })
})
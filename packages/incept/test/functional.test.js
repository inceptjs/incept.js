const path = require('path')
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../dist/babel/defaults').default
const Application = require('../dist/types/Application').default
const develop = require('../dist/terminal/plugin/develop').default
const terminal = require('../dist/terminal/plugin/terminal').default

const cwd = path.join(__dirname, 'sandbox')

describe('Functional Tests', async function() {
  this.timeout(10000); 
  const app = new Application({ cwd })
  before((done) => {
    require('@babel/register')(config)
    app.on('develop-ready', () => done())
    //from boot.ts
    app.bootstrap(terminal)
    app.bootstrap(develop)
    app.load()
    app.plugin('terminal').emit(cwd, ['npm', 'run', 'dev', '--host=127.0.0.1', '--port=8080'])
  })

  after(() => {
    app.plugin('server').close()
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
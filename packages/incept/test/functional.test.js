const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../dist/babel/defaults').default
const Application = require('../dist/types/Application').default
const PluginLoader = require('../dist/types/PluginLoader').default
const develop = require('../dist/terminal/plugin/develop').default
const terminal = require('../dist/terminal/plugin/terminal').default

const cwd = path.resolve(__dirname, '../../..')
const examples = path.resolve(__dirname, '../../../examples')

describe('Basic Tests', async function() {
  this.timeout(10000); 
  const example = path.join(examples, 'basic')
  const app = new Application({ cwd })
  
  before((done) => {
    require('@babel/register')(config)
    app.on('develop-ready', () => done())
    //from boot.ts
    app.bootstrap(terminal)
    app.bootstrap(develop)
    //app.load()
    //here instead of `app.load()` we are hijacking the plugin 
    //loader from Application
    const loader = new PluginLoader(example)
    loader.bootstrap(app)
    app.plugin('terminal').emit(app.cwd, ['npm', 'run', 'dev', '--host=127.0.0.1', '--port=8080'])
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

describe('Features Tests', async function() {
  this.timeout(10000); 
  const example = path.join(examples, 'features')
  const app = new Application({ cwd })
  
  before((done) => {
    require('@babel/register')(config)
    app.on('develop-ready', () => done())
    //from boot.ts
    app.bootstrap(terminal)
    app.bootstrap(develop)
    //app.load()
    //here instead of `app.load()` we are hijacking the plugin 
    //loader from Application
    const loader = new PluginLoader(example)
    loader.bootstrap(app)
    app.plugin('terminal').emit(app.cwd, ['npm', 'run', 'dev', '--host=127.0.0.1', '--port=8080'])
  })

  after(() => {
    app.plugin('server').close()
  })

  it('Should load home page', async () => {
    const response = await fetch('http://127.0.0.1:8080/')
    const body = await response.text()
    expect(body).to.contain('Welcome to Incept.js')
  })

  it('Should load about page', async () => {
    const response = await fetch('http://127.0.0.1:8080/about')
    const body = await response.text()
    expect(body).to.contain('About incept static')
  })
})
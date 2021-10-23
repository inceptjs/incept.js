import path from 'path'
import emitter from './events'

export default async function(app) {
  app.use(emitter)
  //make a public
  app.public(path.resolve(__dirname, '../../public'), '/')
  //react routes
  app.withReact.route('/', `${__dirname}/pages/Home`)
  app.withReact.route('/about', `${__dirname}/pages/About`)
}
import path from 'path'
//import router from './routes'

export default async function(app) {
  //app.use(router)
  //make a public
  app.public(path.resolve(__dirname, '../../public'), '/')
  //react routes
  app.withReact.route('/', `${__dirname}/pages/Home`)
  app.withReact.route('/about', `${__dirname}/pages/About`)
}
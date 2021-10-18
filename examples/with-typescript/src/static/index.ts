import path from 'path'
import { Application } from 'inceptjs'

export default async function(app: Application) {
  //make a public
  app.public(path.resolve(__dirname, '../../public'), '/')
  //react routes
  app.withReact.route('/', `${__dirname}/pages/Home.tsx`)
  app.withReact.route('/about', `${__dirname}/pages/About.tsx`)
}
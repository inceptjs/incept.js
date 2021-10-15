import path from 'path'

export default async function(app) {
  //make a public
  app.public(path.resolve(__dirname, '../../public'), '/')
  //react routes
  app.withReact.route('/', `${__dirname}/pages/Home`)
  app.withReact.route('/about', `${__dirname}/pages/About`, 'mui5')
}
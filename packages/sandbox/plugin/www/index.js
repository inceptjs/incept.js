import page from './page'

export default function(app) {
  //app.withReact.app = `${__dirname}/App`
  app.withReact.page = page(app.withReact)
  app.withReact.layout('default', `${__dirname}/Layout`)
}
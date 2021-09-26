export default function(app) {
  //app.withReact.layout('admin', `${__dirname}/Layout`)
  app.withReact.route(
    '/admin', 
    `${__dirname}/pages/Hello`
  )
}
export default function(app) {
  //app.withReact.layout('admin', `${__dirname}/Layout`)
  app.withReact.route(
    '/admin', 
    `${__dirname}/pages/Hello`
  )
  app.withVirtualFS.route(`${dirname}/icon/*`, (filename, res, vfs) => {
    //extract the params from the filename
    const params = vfs.routeParams(filename, `${dirname}/icon/*`)
    //set the response body as a string or object
    res.body = { id: params.params.id }
  })
}
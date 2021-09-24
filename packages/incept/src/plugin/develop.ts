import http from 'http';
import { Request, Response } from '@inceptjs/framework';

import webpack from '../develop/webpack';
import { logError, logRequest, logResponse } from '../develop/logs'
import Application from '../types/Application';

import dispatch from './dispatch';

function startDevServer(
  request: Request, 
  response: Response
): void {
  //user input
  const port = request.params.p || request.params.port || 3000;
  const host = request.params.h || request.params.host || 'localhost';
  //get the app
  const app = request.ctx as Application;
  //allow public access to the build folder 
  //TODO: should be a custom setting
  app.public(`${app.cwd}/build`, '/build')
  //load webpack
  const {dev, hot} = webpack(app);
  app.use(dev);
  app.use(hot);
  //this will transfer data from the response 
  //object to ServerResponse when the routes 
  //and events have been ran
  app.use(dispatch);
  //handle react
  app.get('/**', app.withReact.handle);
  //create the http server
  const server = http.createServer(app.handle.bind(app));
  //let others get the http server (like if they want to close it)
  app.plugin('http', server);
  //log all errors
  app.on('error', logError.bind(app));
  //log all requests
  app.on('request', logRequest.bind(app));
  //log all responses
  app.on('dispatch', logResponse.bind(app));
  //close server on kill
  app.on('kill', () => server.close());
  //if server returns an error
  server.on('error', (error: any) => {
    //pass the error to the app
    app.emit('error', error, request, response);
  })
  //now start listening to the server
  server.listen(port, host);
  //let the user know what just happened
  app.emit('log', `Server start @ ${host}:${port}`, 'success');
  app.emit('log', 'Press `CTRL+C` to exit');
}

export default function developPlugin(ctx: Application) {
  ctx.on('dev', startDevServer);
}
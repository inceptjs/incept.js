import http from 'http';
import path from 'path';
import { Request, Response } from '@inceptjs/framework';

import { StringRoute } from '../../react';
import Application from '../../types/Application';
import { logError, logRequest, logResponse } from '../logs';

import dispatch from './dispatch';

function startProductionServer(
  request: Request, 
  response: Response
): void {
  //user input
  const port = request.params.p || request.params.port || 3000;
  const host = request.params.h || request.params.host || 'localhost';
  //get the app
  const app = request.ctx as Application;
  const react = app.withReact;
  //log all errors
  app.on('error', logError.bind(app));
  //this will transfer data from the response 
  //object to ServerResponse when the routes 
  //and events have been ran
  app.use(dispatch);
  //handle react
  react.routes.forEach((route: StringRoute) => { 
    app.get(route.path, react.handle);
  });
  //open up the build path
  app.public(path.join(app.buildPath, 'static'), '/.build')
  //create the http server
  const server = http.createServer(app.handle.bind(app));
  //let others get the http server (like if they want to close it)
  app.plugin('http', server);
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
  app.plugin('server', server);
  app.emit('production-ready');
}


export default function startPlugin(ctx: Application) {
  ctx.on('start', startProductionServer);
}
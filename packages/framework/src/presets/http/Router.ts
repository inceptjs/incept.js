import fs from 'fs';
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';

import mime from 'mime';
import Pluggable from '../Pluggable'

import Exception from '../../Exception';

import Request from './Request';
import Response from './Response';

export default class HTTPRouter extends Pluggable {
  /**
   * Handles an incoming request
   */
  handle: Function = async (im: IncomingMessage, sr: ServerResponse) => {
    Exception.require(
      im instanceof IncomingMessage,
      'Argument 1 expecting IncomingMessage'
    );

    Exception.require(
      sr instanceof ServerResponse,
      'Argument 2 expecting Object'
    );

    //let middleware contribute before routing
    await this.emit('open', im, sr);

    //if it was already sent off 
    if (sr.headersSent) {
      //dont process
      return;
    }

    //create a new payload
    const request = this.makeRequest({}, im);
    const response = this.makeResponse({}, sr);

    //add context
    request.ctx = this;
    response.ctx = this;

    //handle the route
    const event = request.method + ' ' + request.pathname
    const route = this.route(event);
    await route.handle(request, response);

    //let middleware contribute to populating resources
    // NOTE: dispatchers should use this instead of close
    await this.emit('dispatch', request, response);
    //let middleware contribute after closing
    await this.emit('close', im, sr);
  }

  /**
   * Makes a new request object (IoC)
   */
  makeRequest(
    data: Record<string, any>, 
    resource: IncomingMessage
  ): Request {
    return new Request(data, resource);
  }

  /**
   * Makes a new response object (IoC)
   */
  makeResponse(
    data: Record<string, any>, 
    resource: ServerResponse
  ): Response {
    return new Response(data, resource);
  }

  /**
   * Opens up an entire folder
   */
  public(root: string, base: string = ''): HTTPRouter {
    Exception.require(
      typeof root === 'string', 
      'Argument 1 expected String'
    );
    Exception.require(
      typeof base === 'string', 
      'Argument 2 expected String'
    );
    const pattern = (base + '/**').replace(/\/\//g, '/');
    this.all(pattern, (request: Request, response: Response) => {
      if (response.body !== null) {
        return;
      }

      const pathname = request.pathname.substr(base.length);
      let file = path.join(root, pathname);

      //if it doesnt exist
      if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
        //add index.html
        file = path.join(file, '/index.html').replace(/\/\//g, '/');
        //and try again
        if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
          return;
        }
      }

      response.headers('Content-Type', mime.getType(file));
      response.body = fs.createReadStream(file);
    }, 10000);

    return this;
  }
}
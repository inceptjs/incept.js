import type { APIResponse } from '../types';
import type { RouteArgs, RouteAction } from './types';

import { EventEmitter } from '@inceptjs/types';

import Route from './Route';
import Request from './Request';
import Response from './Response';
import Exception from '../Exception';

/**
 * Allows requests to be routed to a callback to be processed
 */
export default class Router extends EventEmitter<RouteArgs> {
  /**
   * Route for any method
   */
  all(path: string, ...callbacks: (RouteAction|number)[]): Router {
    this.route(path).all(...callbacks);
    return this;
  }

  /**
   * Route for CONNECT method
   */
  connect(path: string, ...callbacks: (RouteAction|number)[]): Router {
    this.route(path).connect(...callbacks);
    return this;
  }

  /**
   * Route for DELETE method
   */
  delete(path: string, ...callbacks: (RouteAction|number)[]): Router {
    this.route(path).delete(...callbacks);
    return this;
  }

  /**
   * Route for HEAD method
   */
  head(path: string, ...callbacks: (RouteAction|number)[]): Router {
    this.route(path).head(...callbacks);
    return this;
  }

  /**
   * Route for GET method
   */
  get(path: string, ...callbacks: (RouteAction|number)[]): Router {
    this.route(path).get(...callbacks);
    return this;
  }

  /**
   * Route for OPTIONS method
   */
  options(path: string, ...callbacks: (RouteAction|number)[]): Router {
    this.route(path).options(...callbacks);
    return this;
  }

  /**
   * Route for PATCH method
   */
  patch(path: string, ...callbacks: (RouteAction|number)[]): Router {
    this.route(path).patch(...callbacks);
    return this;
  }

  /**
   * Route for POST method
   */
  post(path: string, ...callbacks: (RouteAction|number)[]): Router {
    this.route(path).post(...callbacks);
    return this;
  }

  /**
   * Route for PUT method
   */
  put(path: string, ...callbacks: (RouteAction|number)[]): Router {
    this.route(path).put(...callbacks);
    return this;
  }

  /**
   * Redirects to another place
   */
  redirect(path: string, response: Response): Router {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected String'
    );

    Exception.require(
      response instanceof Response, 
      'Argument 2 expected Request'
    );

    response.setStatus(307, 'Temporary Redirect')
    response.setHeader('Location', path)
    return this;
  }

  /**
   * Returns a route
   */
  route(event: string): Route {
    Exception.require(
      typeof event === 'string', 
      'Argument 1 expected String'
    );
    return new Route(event, this);
  }

  /**
   * Routes to another place
   */
  async routeTo(
    method: string, 
    path: string,
    request: Request,
    response: Response<APIResponse>
  ): Promise<boolean> {
    Exception.require(
      typeof method === 'string', 
      'Argument 1 expected String'
    );
    Exception.require(
      typeof path === 'string', 
      'Argument 2 expected String'
    );
    Exception.require(
      request instanceof Request, 
      'Argument 3 expected Request'
    );
    Exception.require(
      response instanceof Response, 
      'Argument 4 expected Response'
    );

    const event = method.toUpperCase() + ' ' + path;
    const route = this.route(event);
    return await route.handle(request, response);
  }

  /**
   * Route for TRACE method
   */
  trace(path: string, ...callbacks: (RouteAction|number)[]): Router {
    this.route(path).trace(...callbacks);
    return this;
  }
}
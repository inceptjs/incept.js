import type { RouteAction } from '../types';
import { EventEmitter, Statuses } from '@inceptjs/types';
import Request from './Request';
import Response from './Response';
import Exception from './Exception';
import { APIResponse } from '../../types';

/**
 * Single route handler
 */
export default class Route {
  /**
   * The event string that will be hanndled
   */
  protected event: string;

  /**
   * The router to work with
   */
  protected router: EventEmitter<
    [ Request, Response<APIResponse>, Exception? ]
  >;
  
  /**
   * Sets the route path we are working with
   */
  constructor(event: string, router: EventEmitter<
    [ Request, Response<APIResponse>, Exception? ]
  >) {
    //arg check
    Exception.require(
      typeof event === 'string', 
      'Argument 1 expected String'
    );
    Exception.require(
      router instanceof EventEmitter, 
      'Argument 2 expected Router'
    );

    this.event = event;
    this.router = router;
  }

  /**
   * Listens for all requests matching path
   */
  all(...callbacks: (RouteAction|number)[]): Route {
    //the first callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 1 expected Function'
    );

    //determine the priority
    let priority = 0;
    //if the last callback is a number
    if (typeof callbacks[callbacks.length - 1] === 'number') {
      //pop out the priority
      priority = callbacks.pop() as number;
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return this.on('[A-Z]+', callbacks as RouteAction[], priority);
  }

  /**
   * Listens for CONNECT requests matching path
   */
  connect(...callbacks: (RouteAction|number)[]): Route {
    //the first callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 1 expected Function'
    );

    //determine the priority
    let priority = 0;
    //if the last callback is a number
    if (typeof callbacks[callbacks.length - 1] === 'number') {
      //pop out the priority
      priority = callbacks.pop() as number;
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return this.on('CONNECT', callbacks as RouteAction[], priority);
  }

  /**
   * Listens for DELETE requests matching path
   */
  delete(...callbacks: (RouteAction|number)[]): Route {
    //the first callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 1 expected Function'
    );

    //determine the priority
    let priority = 0;
    //if the last callback is a number
    if (typeof callbacks[callbacks.length - 1] === 'number') {
      //pop out the priority
      priority = callbacks.pop() as number;
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return this.on('DELETE', callbacks as RouteAction[], priority);
  }

  /**
   * 3. Runs the 'response' event and interprets
   */
  async dispatch(request: Request, response: Response<APIResponse>): Promise<boolean> {
    Exception.require(
      request instanceof Request,
      'Argument 1 expected Request'
    );

    Exception.require(
      response instanceof Response,
      'Argument 2 expected Response'
    );

    //emit a response event
    const status = await this.router.emit('response', request, response);

    //if the status was incomplete (308)
    return status.code !== Statuses.ABORT.code;
  }

  /**
   * Listens for GET requests matching path
   */
  get(...callbacks: (RouteAction|number)[]): Route {
    //the first callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 1 expected Function'
    );

    //determine the priority
    let priority = 0;
    //if the last callback is a number
    if (typeof callbacks[callbacks.length - 1] === 'number') {
      //pop out the priority
      priority = callbacks.pop() as number;
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return this.on('GET', callbacks as RouteAction[], priority);
  }

  /**
   * Handles the route
   */
  async handle(request: Request, response: Response<APIResponse>) {
    Exception.require(
      request instanceof Request,
      'Argument 1 expected Request'
    );

    Exception.require(
      response instanceof Response,
      'Argument 2 expected Response'
    );

    //try to trigger request pre-processors
    if (!await this.prepare(request, response)) {
      //if the request exits, then stop
      return false;
    }

    // from here we can assume that it is okay to
    // continue with processing the routes
    if (!await this.process(request, response)) {
      //if the request exits, then stop
      return false;
    }

    //last call before dispatch
    if (!await this.dispatch(request, response)) {
      //if the dispatch exits, then stop
      return false;
    }

    //anything else?
    return true;
  }

  /**
   * Listens for HEAD requests matching path
   */
  head(...callbacks: (RouteAction|number)[]): Route {
    //the first callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 1 expected Function'
    );

    //determine the priority
    let priority = 0;
    //if the last callback is a number
    if (typeof callbacks[callbacks.length - 1] === 'number') {
      //pop out the priority
      priority = callbacks.pop() as number;
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return this.on('HEAD', callbacks as RouteAction[], priority);
  }

  /**
   * Transform the route into an event
   */
  on(method: string, callbacks: RouteAction[], priority: number) {
    //convert path to a regex pattern
    const pattern = this.event
      //replace the :variable-_name01
      .replace(/(\:[a-zA-Z0-9\-_]+)/g, '*')
      //replace the stars
      //* -> ([^/]+)
      //@ts-ignore Property 'replaceAll' does not exist on type 'string'
      //but it does exist according to MDN...
      .replaceAll('*', '([^/]+)')
      //** -> ([^/]+)([^/]+) -> (.*)
      .replaceAll('([^/]+)([^/]+)', '(.*)');

    //now form the event pattern
    const event = new RegExp(`^${method}\\s${pattern}/*$`, 'ig');
    //this is the main callback
    const main = callbacks.pop() as Function;
    //we are naming this function so it can be found during inspection
    function processRoute(req: Request, res: Response<APIResponse>, e?: Exception) {
      //call the original event callback. here we are 
      //binding the main emitter so they can use `this`
      for (let i = 0; i < callbacks.length; i++) {
        //if the callback returns false
        if (callbacks[i](req, res, e) === false) {
          //then dont run the main callback but allow 
          //anything else listening to this event to run
          return;
        }
      }

      return main(req, res, e);
    }

    //emit event
    this.router.on(event, processRoute, priority);
    return this;
  }

  /**
   * Listens for OPTIONS requests matching path
   */
  options(...callbacks: (RouteAction|number)[]): Route {
    //the first callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 1 expected Function'
    );

    //determine the priority
    let priority = 0;
    //if the last callback is a number
    if (typeof callbacks[callbacks.length - 1] === 'number') {
      //pop out the priority
      priority = callbacks.pop() as number;
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return this.on('OPTIONS', callbacks as RouteAction[], priority);
  }

  /**
   * Listens for PATCH requests matching path
   */
  patch(...callbacks: (RouteAction|number)[]): Route {
    //the first callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 1 expected Function'
    );

    //determine the priority
    let priority = 0;
    //if the last callback is a number
    if (typeof callbacks[callbacks.length - 1] === 'number') {
      //pop out the priority
      priority = callbacks.pop() as number;
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return this.on('PATCH', callbacks as RouteAction[], priority);
  }

  /**
   * Listens for POST requests matching path
   */
  post(...callbacks: (RouteAction|number)[]): Route {
    //the first callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 1 expected Function'
    );

    //determine the priority
    let priority = 0;
    //if the last callback is a number
    if (typeof callbacks[callbacks.length - 1] === 'number') {
      //pop out the priority
      priority = callbacks.pop() as number;
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return this.on('POST', callbacks as RouteAction[], priority);
  }

  /**
   * 1. Runs the 'request' event and interprets
   */
  async prepare(request: Request, response: Response<APIResponse>): Promise<boolean> {
    Exception.require(
      request instanceof Request,
      'Argument 1 expected Request'
    );

    Exception.require(
      response instanceof Response,
      'Argument 2 expected Response'
    );

    const status = await this.router.emit('request', request, response);

    //if the status was incomplete (308)
    return status.code !== Statuses.ABORT.code;
  }

  /**
   * 2. Runs the route event and interprets
   */
  async process(request: Request, response: Response<APIResponse>): Promise<boolean> {
    Exception.require(
      request instanceof Request,
      'Argument 1 expected Request'
    );

    Exception.require(
      response instanceof Response,
      'Argument 2 expected Response'
    );

    const status = await this.router.emit(this.event, request, response);

    //if the status was incomplete (308)
    if (status.code === Statuses.ABORT.code) {
      //the callback that set that should have already processed
      //the request and is signaling to no longer continue
      return false;
    }

    //if no body and status code
    //NOTE: it's okay if there is no body as 
    //      long as there is a status code
    //ex. like in the case of a reirect
    if (!response.body && !response.status) {
      response.setStatus(Statuses.NOT_FOUND.code);
      throw Exception
        .for(Statuses.NOT_FOUND.message)
        .withCode(Statuses.NOT_FOUND.code);
    }

    //if no status was set
    if (!response.status) {
      //make it okay
      response.setStatus(Statuses.OK.code, Statuses.OK.message);
    }

    //if the status was incomplete (308)
    return status.code !== Statuses.ABORT.code;
  }

  /**
   * Listens for PUT requests matching path
   */
  put(...callbacks: (RouteAction|number)[]): Route {
    //the first callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 1 expected Function'
    );

    //determine the priority
    let priority = 0;
    //if the last callback is a number
    if (typeof callbacks[callbacks.length - 1] === 'number') {
      //pop out the priority
      priority = callbacks.pop() as number;
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return this.on('PUT', callbacks as RouteAction[], priority);
  }

  /**
   * Listens for TRACE requests matching path
   */
  trace(...callbacks: (RouteAction|number)[]): Route {
    //the first callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 1 expected Function'
    );

    //determine the priority
    let priority = 0;
    //if the last callback is a number
    if (typeof callbacks[callbacks.length - 1] === 'number') {
      //pop out the priority
      priority = callbacks.pop() as number;
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return this.on('TRACE', callbacks as RouteAction[], priority);
  }
}
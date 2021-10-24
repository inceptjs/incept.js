import { 
  EventEmitter, 
  Reflection, 
  Statuses 
} from '@inceptjs/types';

import Request from './Request';
import Response from './Response';
import Exception from './Exception';

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
  protected router: EventEmitter;
  
  /**
   * Sets the route path we are working with
   */
  constructor(event: string, router: EventEmitter) {
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
   * Listens for any type of request matching path
   */
  all(...callbacks: any[]): Route {
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
      priority = callbacks.pop();
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return _onMethod.call(this, '[A-Z]+', callbacks, priority);
  }

  /**
   * Listens for CONNECT requests matching path
   */
  connect(...callbacks: any[]): Route {
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
      priority = callbacks.pop();
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return _onMethod.call(this, 'CONNECT', callbacks, priority)
  }

  /**
   * Listens for DELETE requests matching path
   */
  delete(...callbacks: any[]): Route {
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
      priority = callbacks.pop();
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return _onMethod.call(this, 'DELETE', callbacks, priority)
  }

  /**
   * Listens for GET requests matching path
   */
  get(...callbacks: any[]): Route {
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
      priority = callbacks.pop();
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return _onMethod.call(this, 'GET', callbacks, priority)
  }

  /**
   * Runs the 'response' event and interprets
   */
  async dispatch(request: Request, response: Response): Promise<boolean> {
    Exception.require(
      request instanceof Request,
      'Argument 1 expected Request'
    );

    Exception.require(
      response instanceof Response,
      'Argument 2 expected Response'
    );

    let status = Statuses.OK;

    try {
      //emit a response event
      status = await this.router.emit('response', request, response);
    } catch(error) {
      //if there is an error
      response.setStatus(Statuses.ERROR);
      status = await this.router.emit('error', error, request, response);
    }

    //if the status was incomplete (308)
    return status.code !== Statuses.ABORT.code;
  }

  /**
   * Handles the route
   */
  async handle(request: Request, response: Response): Promise<boolean> {
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
  head(...callbacks: any[]): Route {
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
      priority = callbacks.pop();
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return _onMethod.call(this, 'HEAD', callbacks, priority)
  }

  /**
   * Listens for OPTIONS requests matching path
   */
  options(...callbacks: any[]): Route {
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
      priority = callbacks.pop();
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return _onMethod.call(this, 'OPTIONS', callbacks, priority)
  }

  /**
   * Listens for POST requests matching path
   */
  post(...callbacks: any[]): Route {
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
      priority = callbacks.pop();
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return _onMethod.call(this, 'POST', callbacks, priority)
  }

  /**
   * Runs the 'request' event and interprets
   */
  async prepare(request: Request, response: Response): Promise<boolean> {
    Exception.require(
      request instanceof Request,
      'Argument 1 expected Request'
    );

    Exception.require(
      response instanceof Response,
      'Argument 2 expected Response'
    );

    let status = Statuses.OK;
  
    try {
      //emit a response event
      status = await this.router.emit('request', request, response);
    } catch(error) {
      //if there is an error
      response.setStatus(Statuses.ERROR);
      status = await this.router.emit('error', error, request, response);
    }

    //if the status was incomplete (308)
    return status.code !== Statuses.ABORT.code;
  }

  /**
   * Runs the route event and interprets
   */
  async process(request: Request, response: Response): Promise<boolean> {
    Exception.require(
      request instanceof Request,
      'Argument 1 expected Request'
    );

    Exception.require(
      response instanceof Response,
      'Argument 2 expected Response'
    );

    let status = Statuses.OK;

    try {
      //emit a response event
      status = await this.router.emit(this.event, request, response);
    } catch(error) {
      //if there is an error
      response.setStatus(Statuses.ERROR);
      status = await this.router.emit('error', error, request, response);
    }

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
      response.setStatus(Statuses.NOT_FOUND);
      const exception = Exception
        .for(Statuses.NOT_FOUND.text)
        .withCode(Statuses.NOT_FOUND.code);
      
      status = await this.router.emit(
        'error', 
        exception, 
        request, 
        response
      );
    }

    //if no status was set
    if (!response.status) {
      //make it okay
      response.setStatus(Statuses.OK);
    }

    //if the status was incomplete (308)
    return status.code !== Statuses.ABORT.code;
  }

  /**
   * Listens for PUT requests matching path
   */
  put(...callbacks: any[]): Route {
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
      priority = callbacks.pop();
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return _onMethod.call(this, 'PUT', callbacks, priority)
  }

  /**
   * Listens for TRACE requests matching path
   */
  trace(...callbacks: any[]): Route {
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
      priority = callbacks.pop();
    }

    //now check the rest
    for (let i = 0; i < callbacks.length; i++) {
      Exception.require(
        typeof callbacks[i] === 'function', 
        `Argument ${i + 1} expected Function`
      );
    }

    return _onMethod.call(this, 'TRACE', callbacks, priority)
  }
}

/**
 * Adds a listener for the exact method and path called
 */
function _onMethod(
  this: Route,
  method: string, 
  callbacks: Function[], 
  priority: number
) {
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
    .replaceAll('([^/]+)([^/]+)', '(.*)')

  //now form the event pattern
  const event = new RegExp(`^${method}\\s${pattern}/*$`, 'ig')
  //this is the main callback
  const main = callbacks.pop() as Function
  //we are naming this function so it can be found during inspection
  function processRoute(req: Request, ...args: any[]) {
    //call the original event callback. here we are 
    //binding the main emitter so they can use `this`
    for (let i = 0; i < callbacks.length; i++) {
      //if the callback returns false
      if (callbacks[i](req, ...args) === false) {
        //then dont run the main callback but allow 
        //anything else listening to this event to run
        return
      }
    }

    return main(req, ...args)
  }

  //if the main function has a name
  if (main.name) {
    //rename the processRoute
    Reflection.rename(processRoute, main.name)
  }

  //emit event
  this.router.on(event, processRoute.bind(this), priority)
  return this
}
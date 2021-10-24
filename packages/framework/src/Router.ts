import { Reflection, EventEmitter } from '@inceptjs/types';

import Route from './Route';
import Request from './Request';
import Response from './Response';
import Exception from './Exception';

/**
 * Abstraction defining what an event is
 */
 export interface Params {
  /**
   * The name of the event
   */
  event: string;

  /**
   * The regexp pattern of the event
   */
  pattern: RegExp;

  /**
   * `args` from the dynamic * pathing
   * ex. /foo/bar/*
   */
  args: any[];

  /**
   * `params` from the dynamic : pathing
   * ex. /foo/:bar/zoo
   */
  params: Record<string, any>;
}

/**
 * Allows requests to be routed to a callback to be processed
 */
export default class Router extends EventEmitter {
  /**
   * Route for any method
   */
  all(path: string, ...callbacks: any[]): Router {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected Stringg'
    );
    //the second callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 2 expected Function'
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
        `Argument ${i + 2} expected Function`
      );
    }

    this.route(path).all(...callbacks, priority);
    return this;
  }

  /**
   * Route for CONNECT method
   */
  connect(path: string, ...callbacks: any[]): Router {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected Stringg'
    );
    //the second callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 2 expected Function'
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
        `Argument ${i + 2} expected Function`
      );
    }

    this.route(path).connect(...callbacks, priority);
    return this;
  }

  /**
   * Route for DELETE method
   */
  delete(path: string, ...callbacks: any[]): Router {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected Stringg'
    );
    //the second callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 2 expected Function'
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
        `Argument ${i + 2} expected Function`
      );
    }

    this.route(path).delete(...callbacks, priority);
    return this;
  }

  /**
   * Route for GET method
   */
  get(path: string, ...callbacks: any[]): Router {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected Stringg'
    );
    //the second callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 2 expected Function'
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
        `Argument ${i + 2} expected Function`
      );
    }

    this.route(path).get(...callbacks, priority);
    return this;
  }

  /**
   * Handles an incoming request
   */
  handle: Function = async (
    req: string|Record<string, any>|null = null, 
    res: Record<string, any>|null = null
  ) => {
    Exception.require(
      typeof req === 'object',
      'Argument 1 expecting Object'
    );

    Exception.require(
      typeof res === 'object',
      'Argument 2 expecting Object'
    );

    //let middleware contribute before routing
    await this.emit('open', req, res);

    //create a new payload
    const request = this.makeRequest({ 
      context: this, 
      resource: req 
    });
    const response = this.makeResponse({ 
      context: this, 
      resource: res 
    });

    //handle the route
    const event = request.method + ' ' + request.pathname;
    const route = this.route(event);
    await route.handle(request, response);

    //let middleware contribute to populating resources
    // NOTE: dispatchers should use this instead of close
    await this.emit('dispatch', request, response);
    //let middleware contribute after closing
    await this.emit('close', req, res);
  }

  /**
   * Route for HEAD method
   */
  head(path: string, ...callbacks: any[]): Router {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected Stringg'
    );
    //the second callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 2 expected Function'
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
        `Argument ${i + 2} expected Function`
      );
    }

    this.route(path).head(...callbacks, priority);
    return this;
  }

  /**
   * Makes a new request object (IoC)
   */
  makeRequest(init: Record<string, any>|null = null): Request {
    if (init === null) {
      return new Request;
    }

    const { url, ...requestInit } = init;
    if (typeof url === 'string') {
      return new Request(url, requestInit);
    }

    if (typeof requestInit?.resource?.url === 'string') {
      return new Request(requestInit.resource.url, requestInit);
    }

    return new Request(null, requestInit || {});
  }

  /**
   * Makes a new response object (IoC)
   */
  makeResponse(init: Record<string, any>|null = null): Response {
    return new Response(null, init || {});
  }

  /**
   * Route for OPTIONS method
   */
  options(path: string, ...callbacks: any[]): Router {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected Stringg'
    );
    //the second callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 2 expected Function'
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
        `Argument ${i + 2} expected Function`
      );
    }

    this.route(path).options(...callbacks, priority);
    return this;
  }

  /**
   * Returns dynamic variables from path pattern
   */
  params(request: Request, method: string, path: string): Params {
    Exception.require(
      request instanceof Request, 
      'Argument 1 expected Request'
    );

    Exception.require(
      typeof method === 'string', 
      'Argument 2 expected String'
    );

    Exception.require(
      typeof path === 'string', 
      'Argument 3 expected String'
    );
  
    //make sure method is uppercase
    method = method.toUpperCase();
    //consider all methods
    if (method === 'ALL' || method === '*') {
      method = '[A-Z]+';
    }
    //convert path to a regex pattern
    const pattern = path
      //replace the :variable-_name01
      .replace(/(\:[a-zA-Z0-9\-_]+)/g, '*')
      //replace the stars
      //* -> ([^/]+)
      //@ts-ignore Property 'replaceAll' does not exist on type 'string'
      //but it does exist according to MDN...
      .replaceAll('*', '([^/]+)')
      //** -> ([^/]+)([^/]+) -> (.*)
      .replaceAll('([^/]+)([^/]+)', '(.*)');

    //this is what we will be returning
    const route: Params = {
      event: `${request.method} ${request.pathname}`,
      pattern: new RegExp(`^${method}\\s${pattern}/*$`, 'ig'),
      args: [],
      params: {}
    };

    //this is how to unlock the args and variables...

    //find all the matches
    const matches = Array.from(route.event.matchAll(pattern));
    //if no matches
    if (!Array.isArray(matches[0]) || !matches[0].length) {
      return route;
    }

    //find and organize all the dynamic parameters for mapping
    const map = Array.from(
      path.matchAll(/(\:[a-zA-Z0-9\-_]+)|(\*\*)|(\*)/g)
    ).map(match => match[0]);
    //loop through the matches
    matches[0].slice().forEach((param, i) => {
      //skip the first one (GET)
      if (!i) {
        return;
      }

      //so matches will look like
      // [ '/foo/bar', 'foo', 'bar' ]
      //and map will look like
      // [ ':foo', ':bar' ]

      //if it's a * param
      if (typeof map[i - 1] !== 'string' 
        || map[i - 1].indexOf('*') === 0
      ) {
        //if no / in param
        if (param.indexOf('/') === -1) {
          //single push
          return route.args.push(param);
        }

        //push multiple values
        return Array.prototype.push.apply(
          route.args, 
          param.split('/')
        );
      }

      //if it's a :parameter
      if (typeof map[i - 1] === 'string') {
        route.params[map[i - 1].substr(1)] = param;
      }
    });

    return route;
  }

  /**
   * Route for POST method
   */
  post(path: string, ...callbacks: any[]): Router {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected Stringg'
    );
    //the second callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 2 expected Function'
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
        `Argument ${i + 2} expected Function`
      );
    }

    this.route(path).post(...callbacks, priority);
    return this;
  }

  /**
   * Route for PUT method
   */
  put(path: string, ...callbacks: any[]): Router {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected Stringg'
    );
    //the second callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 2 expected Function'
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
        `Argument ${i + 2} expected Function`
      );
    }

    this.route(path).put(...callbacks, priority);
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
    response.headers.set('Location', path)
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
    response: Response
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
  trace(path: string, ...callbacks: any[]): Router {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected Stringg'
    );
    //the second callback needs to exist
    Exception.require(
      typeof callbacks[0] === 'function', 
      'Argument 2 expected Function'
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
        `Argument ${i + 2} expected Function`
      );
    }

    this.route(path).trace(...callbacks, priority);
    return this;
  }

  /**
   * Allows events from other emitters to apply here
   */
  use(path: any, ...emitters: any) {
    //if path is an array
    if (Array.isArray(path)) {
      //recursive flatten strategy
      path.forEach(path => this.use(path, ...emitters));
      return this;
    }

    //if path is a function or emitter
    if (typeof path === 'function' || path instanceof EventEmitter) {
      //there really is no path
      emitters.unshift(path);
    }

    //determine a valid path ahead of time
    const validPath = typeof path === 'string' || path instanceof RegExp;

    //for each emitter
    for (const emitter of emitters) {
      //if the emitter is an array
      if (Array.isArray(emitter)) {
        //recursive flatten strategy
        if (validPath) {
          this.use(path, ...emitter);
        } else {
          //@ts-ignore This is big boy stuff...
          this.use(...emitter);
        }
        
        continue;
      //if the emitter is really an emitter
      } else if (emitter instanceof EventEmitter) {
        //call the parent
        super.use(emitter);
        continue;
      //if the emitter is not a function
      } else if (typeof emitter !== 'function') {
        //not sure...
        continue;
      }

      //if there is a valid path
      if (validPath) {
        //use route to route it.
        //NOTE: sorry we will not be supporting next() 
        // for routing 
        //@ts-ignore `all` is dynamically defined
        this.all(path, callback)
        continue
      }

      //okay so no path and just a callback
      //here we will support next()
      const wrapper = function(
        req: Record<string, any>, 
        res: Record<string, any>
      ) {
        return new Promise((resolve, reject) => {
          //make a next function
          const next = function(...args: any[]) {
            if (args.length) {
              reject(...args);
            } else {
              resolve(true);
            }
          }

          emitter(req, res, next);
        });
      }

      //copy the emitter name so we can track this on inspection
      Reflection.rename(wrapper, emitter.name);
      //lastly listen to it
      this.on('open', wrapper);
    }

    return this;
  }
}
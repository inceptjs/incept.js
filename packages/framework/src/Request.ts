import { Headers, Request as NativeRequest } from 'node-fetch';
import { Store } from '@inceptjs/types'

import Body from './Body';
import Exception from './Exception';

type RouteParams = {
  args: string[];
  params: Record<string, any>;
}

export type RequestOptions = {
  body?: any;
  cache?: string;
  context?: any;
  credentials?: string;
  headers?: Headers|Record<string, string>;
  integrity?: string;
  method?: string;
  mode?: string;
  redirect?: string;
  referrer?: string;
  resource?: any;
};

export enum RequestMethods {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE'
};

export enum RequestCaches {
  DEFAULT = 'default',
  NO_STORE = 'no-store',
  RELOAD = 'no-reload',
  NO_CACHE = 'no-cache',
  FORCE_CACHE = 'force-cache',
  ONLY_IF_CACHED = 'only-if-cached'
};

export enum RequestCredentials {
  OMIT = 'omit',
  SAME_ORIGIN = 'same-origin',
  INCLUDE = 'include'
};

export enum RequestModes {
  CORS = 'cors',
  NO_CORS = 'no-cors',
  SAME_ORIGIN = 'same-origin',
  NAVIGATE = 'same-origin'
};

export enum RequestRedirects {
  FOLLOW = 'follow',
  ERROR = 'error',
  MANUAL = 'manual'
};

export enum RequestReferrers {
  NO_REFERRER = 'no-referrer',
  CLIENT = 'client',
  ABOUT = 'about:client'
};

/**
 * Implementation of the WHATWG Fetch API request class
 * see: https://fetch.spec.whatwg.org/#request-class
 * see: https://developer.mozilla.org/en-US/docs/Web/API/Request
 */
export default class Request extends Body {
  /**
   * Request args used to stage data
   */
  protected _args: any[] = [];

  /**
   * Request cache mode
   */
  protected _cache: string;

  /**
   * Request credentials
   */
  protected _credentials: string;

  /**
   * Request integrity
   */
  protected _integrity: string|undefined;

  /**
   * Request method
   */
  protected _method: string;

  /**
   * Request mode
   */
  protected _mode: string;

  /**
   * Request params used to stage data
   */
  protected _params: Store = new Store;

  /**
   * Request redirect mode
   */
  protected _redirect: string;
  
  /**
   * Request referrer mode
   */
  protected _referrer: string;
 
  /**
   * Custom: returns custom args
   */
  get args(): any[] {
    return this._args;
  }

  /**
   * Contains the cache mode of the request (e.g., default, 
   * reload, no-cache).
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
   */
  get cache(): string {
    return this._cache;
  }
  
  /**
   * Returns a string describing the request's destination. This is a 
   * string indicating the type of content being requested.
   * WARNING: This is not implemented yet.
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/destination
   */
  get destination(): string {
    throw Exception.for('`destination` is not implemented');
  }
  
  /**
   * Contains the credentials of the request (e.g., omit, same-origin, 
   * include). The default is same-origin.
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
   */
  get credentials(): string {
    return this._credentials;
  }

  /**
   * Contains the subresource integrity value of the request 
   * (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/integrity
   */
  get integrity(): string|undefined {
    return this._integrity;
  }

  /**
   * Contains the request's method (GET, POST, etc.)
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/method
   */
  get method(): string {
    return this._method;
  }

  /**
   * Contains the mode of the request (e.g., cors, no-cors, same-origin, 
   * navigate.)
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
   */
  get mode(): string {
    return this._mode;
  }
 
  /**
   * Custom: returns custom parameters
   */
  get params() {
    return this._params.get();
  }

  /**
   * Contains the mode for how redirects are handled. It may be one of 
   * follow, error, or manual.
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/redirect
   */
  get redirect(): string {
    return this._redirect;
  }

  /**
   * Contains the referrer of the request (e.g., client).
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/referrer
   */
  get referrer(): string {
    return this._referrer;
  }

  /**
   * Contains the referrer policy of the request (e.g., no-referrer).
   * WARNING: This is not implemented yet.
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/referrerPolicy
   */
  get referrerPolicy(): string {
    throw Exception.for('`referrerPolicy` is not implemented');
  }

  /**
   * Custom: sets args
   */
  set args(args: any[]) {
    Exception.require(
      Array.isArray(args), 
      'Value expected Array<amy>'
    );
    this._args = [];
  }

  /**
   * Custom: sets parameters
   */
  set params(data: Record<string, any>) {
    Exception.require(
      data.constructor === Object, 
      'Value expected Object'
    );
    this._params.set(data);
  }

  /**
   * Sets the body and options
   */
  constructor(url: string|null = null, init: RequestOptions = {}) {
    super(null, init);
    //set the URL
    if (typeof url === 'string') {
      try {
        this._url = new URL(url);  
      } catch(e) {
        this._url = new URL(this._unknownHost(url));  
      }
      this.assign(this.query);
    }
    //set the cache mode
    this._cache = init.cache || RequestCaches.DEFAULT;
    //set the credentials
    this._credentials = init.credentials || RequestCredentials.SAME_ORIGIN;
    //set the integrity
    this._integrity = init.integrity;
    //set the metbod
    this._method = (init.method || RequestMethods.GET).toUpperCase();
    //set the mode
    this._mode = init.mode || RequestModes.CORS;
    //set the redirect mode
    this._redirect = init.redirect || RequestRedirects.FOLLOW;
    //set the referrer
    this._referrer = init.referrer || RequestReferrers.CLIENT;
  }

  /**
   * Custom: soft merges the given hashes to the params
   */
  assign(...hashes: Object[]): Request {
    for(let i = 0; i < hashes.length; i++) {
      Exception.require(
        hashes[i].constructor === Object, 
        'Argument %s expected Object',
        i + 1
      )
    }
    this.params = Object.assign(this.params, ...hashes);
    return this;
  }

  /**
   * Clones the Response reseting all states
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/clone
   */
  clone() {
    return new Response(this.url, this._getInit());
  }

  /**
   * Custom: returns the arg of the given index
   */
  arg(index: number) {
    Exception.require(
      typeof index === 'number', 
      'Argument 1 expected number'
    );
    return this._args[index];
  }

  /**
   * Custom: returns the value of the name
   */
  get(...path: (string|number)[]) {
    Exception.require(
      typeof path[0] === 'string', 
      'Argument 1 expected string'
    );
    return this._params.get(...path);
  }

  /**
   * Custom: pushes to the args
   */
  push(value: any): Request {
    this._args.push(value);
    return this;
  }

  /**
   * Custom: Returns parameters based on given route path
   */
  routeParams(routepath: string): RouteParams {
    Exception.require(
      typeof routepath === 'string', 
      'Argument 1 expected String'
    );

    //this is what we will be returning
    const route: RouteParams = { args: [], params: {} };

    if (!this.pathname.length) {
      return route;
    }

    //convert path to a regex pattern
    const pattern = `^${routepath}$`
      //replace the :variable-_name01
      .replace(/(\:[a-zA-Z0-9\-_]+)/g, '*')
      //replace the stars
      //* -> ([^/]+)
      //@ts-ignore Property 'replaceAll' does not exist on type 'string'
      //but it does exist according to MDN...
      .replaceAll('*', '([^/]+)')
      //** -> ([^/]+)([^/]+) -> (.*)
      .replaceAll('([^/]+)([^/]+)', '(.*)');

    //find all the matches
    const matches = Array.from(this.pathname.matchAll(pattern));
    //if no matches
    if (!Array.isArray(matches[0]) || !matches[0].length) {
      return route;
    }

    //find and organize all the dynamic parameters for mapping
    const map = Array.from(
      routepath.matchAll(/(\:[a-zA-Z0-9\-_]+)|(\*\*)|(\*)/g)
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
   * Custom: sets a value to the params
   */
  set(...path: any[]): Request {
    Exception.require(
      typeof path[0] === 'string' || path[0]?.constructor === Object, 
      'Argument 1 expected string'
    );
    Exception.require(
      path.length > 1 || path[0]?.constructor === Object, 
      'Argument 2 expected'
    );
    this._params.set(...path);
    return this;
  }

  /**
   * Custom: unshifts to the args
   */
  unshift(value: any): Request {
    this._args.unshift(value);
    return this;
  }

  /**
   * Custom: resets body
   */
  write(body: any, safe: boolean = true): Body {
    const readOnly = [
      RequestMethods.GET,
      RequestMethods.HEAD,
      RequestMethods.DELETE
    ];
    //@ts-ignore Argument of type 'string' is not assignable to 
    //parameter of type 'RequestMethods'.
    if (!safe && readOnly.indexOf(this._method) !== -1) {
      //make it a POST
      this._method = RequestMethods.POST;
    }
    this._body = body;
    return this;
  }

  /**
   * Returns initial options based on what's currently set
   */
  protected _getInit(): Record<string, any> {
    let body = this._body || undefined;
    if (body?.constructor === Object 
      && typeof body.pipe !== 'function'
    ) {
      body = JSON.stringify(body);
    }
    return {
      body,
      cache: this._cache,
      credentials: this._credentials,
      integrity: this._integrity,
      method: this._method,
      mode: this._mode,
      redirect: this._redirect,
      referrer: this._referrer
    };
  }

  /**
   * Returns the original response resource
   */
  protected _getResource(): NativeRequest {
    return new NativeRequest(this.url, this._getInit());
  }

  /**
   * Adds a default host to invalid URLs
   */
  private _unknownHost(url: string) {
    if (url.indexOf('/') !== 0) {
      url = '/' + url;
    }
  
    return `http://unknownhost${url}`;
  }
};
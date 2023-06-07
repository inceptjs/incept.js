import type { NestedScalarObject } from '../types';
import type { ExpressLikeMessage, RouteParams } from './types';

import cookie from 'cookie';
import { Store } from '@inceptjs/types';


/**
 * A type of request that provides a  
 * common interface for HTTP inputs.
 */
export default class Request {
  /**
   * Incoming message from the server.
   */
  protected _resource: ExpressLikeMessage;

  /**
   * Cached cookie data
   */
  protected _cookies?: Record<string, string>;

  /**
   * Cached post data
   */
  protected _post?: NestedScalarObject;
  /**
   * Cached query data
   */
  protected _query?: NestedScalarObject;

  /**
   * Cached params data
   */
  protected _params?: NestedScalarObject;

  /**
   * Returns the parsed body of the request
   * We cant use the actual body because it 
   * is a stream and can only be read once.
   */
  public get body() {
    return this.getBody();
  }

  /**
   * Returns the cookie data from the request
   */
  public get cookies() {
    return this.getCookies();
  }

  /**
   * Returns the headers from the request
   */
  public get headers() {
    return this.getHeaders();
  }

  /**
   * Returns the request method
   */
  public get method() {
    return this._resource.method || 'GET';
  }

  /**
   * Returns the post data from the request
   * The body could be a string and the post
   * is guaranteed to be an object.
   */
  public get post() {
    return this.getPost();
  }

  /**
   * Returns the query data parsed from the url
   */
  public get query() {
    return this.getQuery();
  }

  /**
   * Returns a combination of the query, post and route params
   */
  public get params() {
    return this.getParams();
  }

  /**
   * Returns the url object from the request
   */
  public get url() {
    const resource = this._resource;
    //determine protocol (by default https)
    let protocol = 'https';
    //if there is an x-forwarded-proto header
    const proto = resource.headers['x-forwarded-proto'];
    if (proto?.length) {
      //then let's use that instead
      if (Array.isArray(proto)) {
        protocol = proto[0];
      } else {
        protocol = proto;
      }
      protocol = protocol.trim();
      // Note: X-Forwarded-Proto is normally only ever a
      //       single value, but this is to be safe.
      if (protocol.indexOf(',') !== -1) {
        protocol = protocol.substring(0, protocol.indexOf(',')).trim();
      }
    }
    //form the URL
    const url = `${protocol}://${resource.headers.host}${resource.url}`;
    //try to create a URL object
    try {
      return new URL(url);  
    } catch(e) {}
    //we need to return a URL object
    return new URL(this._unknownHost(url));  
  }

  /**
   * All we need to do here is set the resource
   * and all the properties will be lazy parsed
   * when called.
   */
  constructor(resource: ExpressLikeMessage) {
    this._resource = resource;
  }

  /**
   * Returns a clone of the request
   */
  public clone(empty = false) {
    const request = new Request(this._resource);
    if (!empty) {
      for (const name in this.params) {
        request.stage(name, this.params[name]);
      }
    }
    return request;
  }

  /**
   * Returns strongly typed body data
   */
  public getBody<T = string | NestedScalarObject>() {
    return this._resource.body as T;
  }

  /**
   * Returns strongly typed cookie data
   */
  public getCookies<T = NestedScalarObject>() {
    if (!this._cookies) {
      this._cookies = cookie.parse(this.headers.cookie as string || '');
    }
    return this._cookies as T;
  }

  /**
   * Returns strongly typed headers data
   */
  public getHeaders<T = Record<string, string|string[]|undefined>>() {
    return (this._resource.headers || {}) as T;
  }

  /**
   * Returns strongly typed query data
   */
  public getQuery<T = NestedScalarObject>() {
    if (!this._query) {
      const queryString = this.url.search.substring(1);
      if (!queryString.length) {
        this._query = {};
      } else {
        const query = new Store;
        this._query = query.withQuery.set(queryString).get() || {};
      }
    }

    return this._query as T;
  }

  /**
   * Returns strongly typed params
   */
  public getParams<T = NestedScalarObject>() {
    if (!this._params) {
      this._params = Object.assign({}, this.query, this.post);
    }

    return this._params as T;
  }

  /**
   * Returns strongly typed post data]
   */
  public getPost<T = NestedScalarObject>() {
    if (!this._post) {
      if (this.body === 'string') {
        const body = JSON.parse(this.body);
        this._post = typeof body === 'object' ? body : {};
      } else {
        this._post = this.body as NestedScalarObject;
      }
    }
    
    return this._post as T;
  }

  /**
   * Returns parameters based on given route path
   */
  public route(path: string, save = false) {
    //this is what we will be returning
    const route: RouteParams = { args: [], params: this.params };

    if (!this.url.pathname.length) {
      return route;
    }

    //convert path to a regex pattern
    const pattern = `^${path}$`
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
    const matches = Array.from(this.url.pathname.matchAll(pattern));
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

    if (save) {
      this._params = Object.assign({}, this.params, route.params);
    }
    return route;
  }

  /**
   * Allows the manipulation of the params object
   */
  public stage(name: string, ...path: any[]) {
    const stage = new Store(this.params);
    stage.set(name, ...path);
    this._params = stage.get();
    return this.params;
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
}
import { Headers, Request as NativeRequest } from 'node-fetch';

import Body from './Body';
import Exception from './Exception';

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
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
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
  protected _params: Record<string, any> = {};

  /**
   * Request redirect mode
   */
  protected _redirect: string;
  
  /**
   * Request referrer mode
   */
  protected _referrer: string;

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
  get params(): Record<string, any> {
    return this._params;
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
   * Custom: sets parameters
   */
  set params(data: Record<string, any>) {
    Exception.require(
      data.constructor === Object, 
      'Value expected Object'
    );
    this._params = data;
  }

  /**
   * Sets the body and options
   */
  constructor(url: string|null = null, init: RequestOptions = {}) {
    super(null, init);
    //set the URL
    if (typeof url === 'string') {
      this._url = new URL(url);
      Object.assign(this.params, this.query);
    }
    //set the cache mode
    this._cache = init.cache || RequestCaches.DEFAULT;
    //set the credentials
    this._credentials = init.credentials || RequestCredentials.SAME_ORIGIN;
    //set the integrity
    this._integrity = init.integrity;
    //set the metbod
    this._method = init.method || RequestMethods.GET;
    //set the mode
    this._mode = init.mode || RequestModes.CORS;
    //set the redirect mode
    this._redirect = init.redirect || RequestRedirects.FOLLOW;
    //set the referrer
    this._referrer = init.referrer || RequestReferrers.CLIENT;
  }

  /**
   * Clones the Response reseting all states
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/clone
   */
  clone() {
    return new Response(this.url, this._getInit());
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
};
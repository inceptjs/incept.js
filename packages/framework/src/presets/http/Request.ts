import { IncomingMessage } from 'http';
import { Headers } from 'node-fetch';
import cookie from 'cookie';

import Request, {
  RequestOptions,
  RequestMethods,
  RequestCaches,
  RequestCredentials,
  RequestModes,
  RequestRedirects,
  RequestReferrers
} from '../../Request';

export {
  RequestOptions,
  RequestMethods,
  RequestCaches,
  RequestCredentials,
  RequestModes,
  RequestRedirects,
  RequestReferrers
}

export default class HTTPRequest extends Request {
  /**
   * The HTTP version
   */
  protected _version: string = '';

  /**
   * The HTTP Cookies
   */
  protected _cookies: Record<string, string|number> = {};

  /**
   * Returns all cookies
   */
  get cookies(): Record<string, string|number> {
    return Object.assign({}, this._cookies);
  }

  /**
   * Maps resource
   */
  constructor(url: string|null = null, init: RequestOptions = {}) {
    super(url, init);
    if (!(init.resource instanceof IncomingMessage)) {
      return;
    }

    const resource = init.resource as IncomingMessage;

    //determine protocol
    //@ts-ignore
    let protocol = resource.connection && resource.connection.encrypted 
      ? 'https' 
      : 'http';
    if (resource.headers['x-forwarded-proto']
      && resource.headers['x-forwarded-proto'].length
    ) {
      if (Array.isArray(resource.headers['x-forwarded-proto'])) {
        protocol = resource.headers['x-forwarded-proto'][0];
      } else {
        protocol = resource.headers['x-forwarded-proto'];
      }

      protocol = protocol.trim();
      // Note: X-Forwarded-Proto is normally only ever a
      //       single value, but this is to be safe.
      if (protocol.indexOf(',') !== -1) {
        protocol = protocol.substring(0, protocol.indexOf(',')).trim();
      }
    }

    //not set url
    const host = resource.headers.host;
    this._url = new URL(protocol + '://' + host + resource.url);
    //put query into params
    this.assign(this.query);
    //set headers
    if (typeof resource.headers === 'object') {
      //@ts-ignore missing the following properties from type 
      //'string[][]': length, pop, push, etc.
      //but MDN says Headers accepts Object.
      //see: https://developer.mozilla.org/en-US/docs/Web/API/Headers/Headers
      //see: https://github.com/node-fetch/node-fetch/blob/96f9ae27c938e30e4915c72125a53c7c725fec36/src/headers.js#L60
      this._headers = new Headers(Object.assign({}, resource.headers))
    }

    //set version
    if (typeof resource.httpVersion === 'string') {
      this._version = resource.httpVersion;
    }

    //set method
    this._method = (resource.method || RequestMethods.GET).toUpperCase();

    //set cookies
    const cookies = this.headers.get('cookie');
    if (typeof cookies === 'string' && cookies.length) {
      this._cookies = cookie.parse(cookies);
    }
  }
}

import { Store } from '@inceptjs/types';
import { IncomingMessage } from 'http';

import Request from '../../Request';

type GenericObject = { [key: string]: any };

export default class HTTPRequest extends Request {
  /**
   * Returns all cookies
   */
  get cookies(): GenericObject|null {
    return this.get('cookies');
  }

  /**
   * Returns the query data
   */
  get query(): string|null {
    //self starter
    if (!this.has('query')) {
      this.set('query', {});
    }
    return this.get('query');
  }

  /**
   * Returns session data
   */
  get session(): GenericObject|null {
    return this.get('session');
  }

  /**
   * Maps resource
   */
  constructor(data: GenericObject, resource: IncomingMessage) {
    super(data, resource);
    map(resource, this);
  }
}

/**
 * Maps resource
 */
function map(resource: IncomingMessage, request: Request): void {
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

  //load a URL to help mapping
  const host = resource.headers.host;
  const url = new URL(protocol + '://' + host + resource.url);

  //LEGEND:
  // url.hash - #foo
  // url.host - 127.0.0.1:3000
  // url.hostname - 127.0.0.1
  // url.href - http://127.0.0.1:3000/some/path?lets=dothis
  // url.origin - http://127.0.0.1:3000
  // url.password - ??
  // url.pathname - /some/path
  // url.port - 3000
  // url.protocol - http:
  // url.search - ?lets=dothis
  request
    .set('hash', url.hash)
    .set('host', url.host)
    .set('hostname', url.hostname)
    .set('href', url.href)
    .set('origin', url.origin)
    .set('password', url.password)
    .set('pathname', url.pathname)
    .set('port', parseInt(url.port))
    .set('protocol', url.protocol)
    .set('search', url.search);

  //set headers
  request.set('headers', Object.assign({}, resource.headers));
  //set version
  request.set('version', resource.httpVersion);
  //set method
  request.set('method', (resource.method || 'GET').toUpperCase());
  //set status code
  request.set('status', 'code', Object.assign({}, resource.statusCode));

  //parse search to query
  if (url.search.length) {
    const query = new Store;
    const params = query.withQuery.set(
      url.search.substr(1)
    );
    request.set('query', params);
    //also add to params
    request.set('params', { ...request.params, params });
  }
}

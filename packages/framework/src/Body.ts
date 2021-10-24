import { Headers, Body as NativeBody } from 'node-fetch';
import { Store } from '@inceptjs/types';

import Exception from './Exception';

export type BodyOptions = {
  headers?: Headers|Record<string, string>;
  body?: any;
  context?: any;
  resource?: any;
};

/**
 * Implementation of the WHATWG Fetch API body mixin
 * see: https://fetch.spec.whatwg.org/#body-mixin
 */
export default abstract class Body {
  /**
   * The actual body
   */
  protected _body: any;

  /**
   * The context is where the response is currently managed
   */
  protected _context: any = null;

  /**
   * Body headers
   */
  protected _headers: Headers; 

  /**
   * Whether if the body was cunsumed
   */
  protected _disturbed: boolean = false;

  /**
   * Pointer linking to the original resource
   */
  protected _resource: any;

  /**
   * The URL where the reponse originated from
   */
  protected _url: URL|null = null;

  /**
   * Returns the body
   * see: https://fetch.spec.whatwg.org/#body
   */
  get body(): any {
    return this._getResource().body;
  }
  
  /**
   * Returns context is where the body is currently managed
   */
  get ctx(): any {
    return this._context;
  }

  /**
   * Returns if the body was consumed
   * see: https://fetch.spec.whatwg.org/#body
   */
  get bodyUsed(): boolean {
    return this._disturbed;
  }

  /**
   * Custom: Returns the hash from the URL
   */
  get hash(): string {
    return this._url? this._url.hash: '';
  }

  /**
   * Custom: Returns the host from the URL
   */
  get host(): string {
    return this._url? this._url.host: '';
  }

  /**
   * Custom: Returns the hostname from the URL
   */
  get hostname(): string {
    return this._url? this._url.hostname: '';
  }

  /**
   * Returns the body headers
   * see: https://fetch.spec.whatwg.org/#body
   */
  get headers(): Headers {
    return this._headers
  }

  /**
   * Custom: Returns the origin from the URL
   */
  get origin(): string {
    return this._url? this._url.origin: '';
  }

  /**
   * Custom: Returns the request path
   */
  get pathname(): string {
    return this._url? this._url.pathname: '';
  }

  /**
   * Custom: Returns the password from the URL
   */
  get password(): string {
    return this._url? this._url.password: '';
  }

  /**
   * Custom: Returns the port
   */
  get port(): string {
    return this._url? this._url.port: '';
  }

  /**
   * Custom: Returns the protocol (like https)
   */
  get protocol(): string {
    return this._url? this._url.protocol: '';
  }

  /**
   * Custom: returns the parsed URL Query
   */
  get query(): Record<string, any> {
    const queryString = this.search.substr(1);
    if (!queryString.length) {
      return {};
    }

    const query = new Store;
    return query.withQuery.set(queryString);
  }

  /**
   * Custom: Returns the original resource
   */
  get resource(): any {
    return this._resource;
  }

  /**
   * Custom: Returns the search from the URL
   */
  get search(): string {
    return this._url? this._url.search: '';
  }

  /**
   * The URL of the response.
   */
  get url(): string {
    return this._url? this._url.href: '';
  }

  /**
   * Sets the body and options
   */
  constructor(body: any = null, init: BodyOptions = {}) {
    //get the headers
    let headers = init.headers;
    //if headers isnt Headers
    if (!(headers instanceof Headers)) {
      //make it Headers
      headers = new Headers(headers || {})
    }
    //set headers
    this._headers = headers;
    //if no body and body is in the init
    if (body === null && typeof init.body !== 'undefined') {
      //set body to the init body
      body = init.body;
    }
    //set body
    this._body = body;
    //set the context
    this._context = init.context || null;
    //set the resource
    this._resource = init.resource || null;
  }

  /**
   * Returns a promise that resolves with an ArrayBuffer 
   * representation of the request body.
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Response/arrayBuffer
   */
  async arrayBuffer() {
    this._disturbed = true;
    const response = this._getResource();
    return await response.arrayBuffer();
  }

  /**
   * Returns a promise that resolves with a Blob 
   * representation of the response body.
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Response/blob
   */
  async blob() {
    this._disturbed = true;
    const response = this._getResource();
    return await response.blob();
  }

  /**
   * Returns a promise that resolves with a FormData representation of 
   * the body. 
   * WARNING: This is not implemented yet.
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Response/formData
   * see: https://github.com/node-fetch/node-fetch#interface-body
   */
  async formData() {
    throw Exception.for('`formData()` is not implemented');
  }

  /**
   * Custom: Parses body by content type
   */
  async parse() {
    const type = this.headers.get('content-type');
    switch(true) {
      case type === 'text/json':
      case type === 'application/json':
        return await this.json();
      case type === 'application/x-www-form-urlencoded':
        return await this.fromURLQuery();
      case type?.indexOf('multipart/form-data') === 0:
        return await this.fromFormData();
    }

    return null;
  }

  /**
   * Custom: Returns the body converted to an object using 
   * multipart/form-data parsing
   */
  async fromFormData() {
    const store = new Store;
    return store.withFormData.set(await this.text()).get();
  }

  /**
   * Custom: Returns the body converted to an object using 
   * URL query parsing
   */
  async fromURLQuery() {
    const store = new Store;
    return store.withQuery.set(await this.text()).get();
  }

  /**
   * Returns a promise that resolves with the result of parsing the 
   * request body as JSON.
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Response/json
   */
  async json() {
    this._disturbed = true;
    const response = this._getResource();
    return await response.json();
  }

  /**
   * Returns a promise that resolves with a text representation of the 
   * request body.
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Request/text
   */
  async text() {
    this._disturbed = true;
    const response = this._getResource();
    return await response.text();
  }

  /**
   * Custom: resets body
   */
  write(body: any): Body {
    this._body = body;
    return this;
  }

  /**
   * Returns the original body resource
   */
  protected abstract _getResource(): NativeBody;
}
import type { NestedScalarObject, ServerResponse, Cookie } from '../types';

import cookie from 'cookie';

import Exception from './Exception';

/**
 * A type of response that provides a
 * common interface for HTTP outputs.
 * 
 * Separates writing to the response 
 * and sending exclusively
 */
export default class Response<T = string|Buffer|NestedScalarObject> {
  /**
   * Editable body object
   */
  protected _body?: T;

  /**
   * Editable cookies object
   */
  protected _cookies: Record<string, Cookie> = {};

  /**
   * Editable headers object
   */
  protected _headers: Record<string, string|string[]|undefined> = {};

  /**
   * Native response from the server.
   */
  protected _resource?: ServerResponse;

  /**
   * Whether the response has been prematurely sent
   */
  protected _sent = false;

  /**
   * Default status code and message
   */
  protected _status = { code: 200, message: 'OK' };
  
  /**
   * Returns the body of the response
   */
  public get body() {
    return this._body;
  }

  /**
   * Returns the flat body
   */
  public get content() {
    return typeof this._body === 'string' || Buffer.isBuffer(this._body)
      ? this._body
      : JSON.stringify(this._body);
  }

  /**
   * Returns the resource
   */
  public get resource() {
    return this._resource;
  }

  /**
   * Returns whether the response has been prematurely sent
   */
  public get sent() {
    if (!this._resource) {
      throw Exception.for('Request resource is not set');
    }
    return this._resource.headersSent || this._sent;
  }

  /**
   * Returns the status
   */
  public get status() {
    return this._status;
  }

  /**
   * All we need to do here is set the resource
   * and all the properties will be lazy parsed
   * when called.
   */
  constructor(resource?: ServerResponse) {
    this._resource = resource;
  }

  /**
   * Returns a clone of the request
   */
  public clone(empty = false) {
    const response = new Response<T>(this._resource);
    if (!empty) {
      response.setStatus(this._status.code, this._status.message);
      if (this._body) {
        response.json(this._body);
      }
      for (const name in this._headers) {
        response.setHeader(name, this._headers[name]);
      }
      for (const name in this._cookies) {
        response.setCookie(
          name, 
          this._cookies[name].value, 
          this._cookies[name].options
        );
      }
    }
    return response;
  }

  /**
   * Returns the body of the response
   * Typescript throws errors when testing 
   * for get body twice in the same function
   */
  public get() {
    return this._body;
  }

  /**
   * Returns a cookie given the name
   */
  public getCookie(name: string) {
    return this._cookies[name];
  }

  /**
   * Returns a header given the name
   */
  public getHeader(name: string) {
    return this._headers[name];
  }

  /**
   * Returns the status
   * Typescript throws errors when testing 
   * for get body twice in the same function
   */
  public getStatus() {
    return this._status;
  }

  /**
   * Sets the body of the response as a json object
   */
  public json(body: T) {
    this._body = body;
  }

  /**
   * Sets all the outputs without sending
   */
  public prepare() {
    if (!this._resource) {
      throw Exception.for('Request resource is not set');
    }
    const resource = this._resource as ServerResponse;
    //set headers
    Object.keys(this._headers).map(key => {
      resource.setHeader(key, this._headers[key] || '');
    });
    //set cookies
    Object.keys(this._cookies).map(key => {
      const { value, options } = this._cookies[key];
      resource.setHeader('Set-Cookie', cookie.serialize(key, value, options));
    });
  }

  /**
   * Parses all the given inputs and sends 
   * the response using the native resource
   */
  public send(content?: any) {
    if (!this._resource) {
      throw Exception.for('Request resource is not set');
    }
    //if already sent, do nothing
    if (this._sent) return;
    this._sent = true;
    this.prepare();
    const { code, message } = this._status;
    this._resource.writeHead(code, message);
    //if content is a stream, pipe it
    if (content && typeof content.pipe === 'function') {
      content.pipe(this._resource);
    //if content is a valid response
    } else if (typeof content === 'string' 
      || Buffer.isBuffer(content) 
      || content instanceof Uint8Array
    ) {
      this._resource.end(content);
    //if content is a valid response
    } else if (typeof this.content === 'string' 
      || Buffer.isBuffer(this.content) 
    ) {
      this._resource.end(this.content);
    } else {
      this._resource.end();
    }
  }

  /**
   * Sets a cookie on the response 
   */
  public setCookie(name: string, value: string, options: Record<string, any> = {}) {
    this._cookies[name] = { value, options };
  }

  /**
   * Sets a header on the response 
   */
  public setHeader(name: string, value?: string|string[]) {
    this._headers[name] = value;
  }

  /**
   * Sets the status code and message
   */
  public setStatus(code: number, message?: string) {
    this._status = { code, message: message || 'OK' };
  }

  /**
   * Sets the body of the response as a string or buffer
   */
  public write(body: T) {
    this._body = body;
  }
}
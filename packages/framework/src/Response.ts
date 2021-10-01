import { Reflection, Store } from '@inceptjs/types';

import Exception from './Exception';

type Scalar = string|number|boolean;

/**
 * Simple response object irrespective of where it came from. 
 * This is useful as an interface to extend for routing that 
 * did not originate from an HTTP server scenario like sockets 
 * or client side routing
 */
export default class Response extends Store {
  /**
   * Pointer linking to the original resource
   */
  protected _resource: any;

  /**
   * The context is where the response was created
   */
  protected _context: Record<string, any>;

  /**
   * Returns the response
   */
  get body(): any {
    return this.get('body');
  }

  /**
   * Returns a response status code
   */
  get ctx(): Record<string, any> {
    return this._context;
  }

  /**
   * Returns a response status code
   */
  get code(): number {
    return this.get('status', 'code') || 0;
  }

  /**
   * Returns all the headers as a function setter
   */
  get headers(): Function {
    //we do this to disallow manipulating the header loosely
    //so it can be called like `res.header('foo', 'bar')`
    const callable = (name: string, value?: Scalar) => {
      if (typeof value === 'undefined') {
        return this.get('header', name);
      }

      return this.set('header', name, value);
    };
    //attach the current route the callable
    //so it can be called like `res.header.Location`
    Reflection.assign(callable, this.get('header') || {});
    return callable;
  }

  /**
   * Returns the original response resource
   */
  get resource(): any {
    return this._resource;
  }

  /**
   * Sets the context
   */
  set ctx(value: Record<string, any>) {
    this._context = value;
  }

  /**
   * Sets the response body. Accepts any value but 
   * should error if it is not eventually a string/number
   */
  set body(value: any) {
    this.set('body', value);
  }

  /**
   * Sets the data and resource
   */
  constructor(data?: Record<string, any>, resource?: any) {
    super(data);
    this._resource = resource;
    this._context = {}
  }

  /**
   * Returns the response status. If value 
   * is provided, then sets the status
   */
  status(code?: any, text?: string) {
    const typeOfCode = typeof code;
    if (typeOfCode === 'undefined') {
      return this.get('status');
    }

    if (typeOfCode === 'object') {
      const status = code;
      Exception.require(
        typeof status.code === 'number', 
        'Value of `code` expected to be a number'
      );

      Exception.require(
        typeof status.text === 'string', 
        'Value of `text` expected to be a string'
      );

      return this.set('status', status);
    }

    return this.set('status', { code, text })
  }

  /**
   * Alias For setting the body (what people traditionally expect)
   */
  write(body: any): this {
    this.set('body', body);
    return this;
  }
}
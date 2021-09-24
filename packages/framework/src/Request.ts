import Response from './Response';
import Exception from './Exception';

type GenericObject = { [key: string]: any };

/**
 * Simple request object irrespective of where it came from. 
 * This is useful as an interface to extend for routing that 
 * did not originate from an HTTP server scenario like sockets 
 * or client side routing
 */
export default class Request extends Response {
  /**
   * Returns the host
   */
  get host(): string {
    return this.get('hostname') || '';
  }

  /**
   * Returns the method
   */
  get method(): string {
    return this.get('method') || 'GET';
  }
 
  /**
   * Returns custom parameters
   */
  get params(): GenericObject {
    //self starter
    if (!this.has('params')) {
      this.set('params', {});
    }
    return this.get('params');
  }

  /**
   * Returns the request path
   */
  get pathname(): string {
    return this.get('pathname') || '';
  }

  /**
   * Returns the port
   */
  get port(): number {
    return this.get('port') || 0;
  }

  /**
   * Returns the protocol (like https)
   */
  get protocol(): string {
    return this.get('protocol') || 'http';
  }

  /**
   * Returns the origin of this request
   */
  get via(): string | null {
    return this.get('via');
  }

  /**
   * Sets parameters
   */
  set params(data: GenericObject) {
    Exception.require(
      data.constructor === Object, 
      'Value expected Object'
    );
    this.set('params', data);
  }
}
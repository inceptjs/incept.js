import Response from '../../Response';
import Exception from '../../Exception';

export default class HTTPResponse extends Response {
  /**
   * Sets a cookie to be added in the headers, eventually
   * 
   * @param {String} name 
   * @param {String|Number} value 
   * @param {Object} [options = {}] 
   * 
   * @returns {Response}
   */
  setCookie(name: string, value: string|number, options = {}): Response {
    Exception.require(
      typeof name === 'string', 
      'Argument 1 expected String'
    );
    //if its an object
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(key => {
        this.setCookie(`${name}[${key}]`, value[key], options)
      });

      return this;
    }

    Exception.require( 
      typeof value === 'string' || typeof value === 'number', 
      'Argument 2 expected String|Number'
    );

    // Map for cookie options
    // - Max-Age: number,
    // - Expires: string,
    // - Domain: string,
    // - Path: string,
    // - Secure: boolean,
    // - HttpOnly: boolean,
    // - SameSite: string
    Exception.require(
      typeof value === 'object', 
      'Argument 3 expected Object'
    );
    this.set('cookies', name, { value, options });
    return this;
  }

  /**
   * Sets session data
   * 
   * @param {(...*)} args 
   * 
   * @returns {Response}
   */
  setSession(...args: any[]): Response {
    this.set('session', ...args);
    return this;
  }
}
import { Headers, Response as NativeResponse } from 'node-fetch';
import { Status } from '@inceptjs/types';

import Body from './Body';
import Exception from './Exception';


export type ResponseOptions = {
  body?: any;
  context?: any;
  headers?: Headers|Record<string, string>;
  resource?: any;
  status?: number;
  statusText?: string;
  type?: ResponseTypes;
  url?: string;
};

export enum ResponseTypes {
  Basic = 'basic',
  CORS = 'cors'
};

/**
 * Implementation of the WHATWG Fetch API response class
 * see: https://fetch.spec.whatwg.org/#response-class
 * see: https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
export default class Response extends Body {
  /**
   * Whether if the response was from a redirected RUL
   */
  protected _redirected: boolean = false;

  /**
   * The status code and text
   */
  protected _status: Status;

  /**
   * Type of response: basic, cors
   */
  protected _type: ResponseTypes;

  /**
   * A boolean indicating whether the response was successful 
   * (status in the range 200–299) or not.
   */
  get ok(): boolean {
    return 200 <= this._status.code && this._status.code <= 299; 
  } 

  /**
   * Indicates whether or not the response is the result of a redirect 
   * (that is, its URL list has more than one entry).
   */
  get redirected(): boolean {
    return this._redirected;
  }

  /**
   * The status code of the response. (This will be 200 for a success).
   */
  get status(): number {
    return this._status.code; 
  } 

  /**
   * The status message corresponding to the status code. 
   * (e.g., OK for 200).
   */
  get statusText(): string {
    return this._status.text; 
  } 

  /**
   * The type of the response (e.g., basic, cors).
   */
  get type(): ResponseTypes {
    return this._type; 
  }

  /**
   * The type of the response (e.g., basic, cors).
   */
  set type(type: ResponseTypes) {
    this._type = type; 
  } 

  /**
   * Sets the body and options
   */
  constructor(body: any = null, init: ResponseOptions = {}) {
    super(body, init);
    if (typeof init.url === 'string') {
      this._url = new URL(init.url);
    }
    this._type = init.type || ResponseTypes.Basic;
    this._status = {
      code: init.status || 0,
      text: init.statusText || ''
    }
  }

  /**
   * Clones the Response reseting all states
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Response/clone
   */
  clone() {
    return new Response(this._body, this._getInit());
  }

  /**
   * Updates the url and status. The original one 
   * returns a new Response, but this one doesn't.
   * see: https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect
   */
  redirect(url: string, status?: number|Status): Response {
    this._redirected = true;
    this._url = new URL(url);
    if (typeof status === 'number') {
      this._status.code = status;
    } else {
      if (typeof status?.code === 'number') {
        this._status.code = status.code;
      }

      if (typeof status?.text === 'string') {
        this._status.text = status.text;
      }
    }

    return this;
  }

  /**
   * Custom: sets the status
   */
  setStatus(code: number|Status, text?: string): Response {
    if (typeof code === 'number') {
      Exception.require(
        typeof text === 'string', 
        'Argument 2 expected string'
      );
      //@ts-ignore Type 'string | undefined' is not assignable to 
      //type 'string'. - But is covered by `Exception.require`.
      this._status = { code, text };
      return this;
    }

    const status = code as Status;

    Exception.require(
      typeof status.code === 'number'
      && typeof status.text === 'string',
      'Argument 1 exprected number or Status'
    );

    this._status = status;
    return this;
  }

  /**
   * Returns initial options based on what's currently set
   */
  protected _getInit(): Record<string, any> {
    return {
      status: this._status.code || undefined,
      text: this._status.text || undefined,
      type: this._type,
      url: this.url !== ''? this.url: undefined
    };
  }

  /**
   * Returns the original response resource
   */
  protected _getResource(): NativeResponse {
    let body = this._body || null;
    if (body?.constructor === Object 
      && typeof body.pipe !== 'function'
    ) {
      body = JSON.stringify(body);
    }
    return new NativeResponse(body, this._getInit());
  }
}
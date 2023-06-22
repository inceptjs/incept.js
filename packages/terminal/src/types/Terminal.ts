import type { Framework, Request, Response } from 'inceptjs';

import { Socket } from 'net';
import { IncomingMessage, ServerResponse } from 'http';

import { Store } from '@inceptjs/types';
import Exception from './Exception';

export default class Terminal {
  // brand to prefix in all logs
  public static brand: string = '[INCEPT]';

  /**
   * Outputs an error log 
   */
  public static error(message: string, variables: string[] = []) {
    this.output(message, variables, '\x1b[31m%s\x1b[0m');
  }

  /**
   * Outputs an info log 
   */
  public static info(message: string, variables: string[] = []) {
    this.output(message, variables, '\x1b[34m%s\x1b[0m');
  }

  /**
   * Outputs a log 
   */
  public static output(
    message: string, 
    variables: string[] = [],
    color?: string
  ) {
    //add variables to message
    for (const variable of variables) {
      message = message.replace('%s', variable);
    }
    //add brand to message
    message = `${this.brand} ${message}`;
    //colorize the message
    if (color) {
      console.log(color, message);
      return;
    }
    //or just output the message
    console.log(message);
  }

  /**
   * Outputs a success log 
   */
  public static success(message: string, variables: string[] = []) {
    this.output(message, variables, '\x1b[32m%s\x1b[0m');
  }

  /**
   * Outputs a system log 
   */
  public static system(message: string, variables: string[] = []) {
    this.output(message, variables, '\x1b[35m%s\x1b[0m');
  }

  /**
   * Outputs a warning log 
   */
  public static warning(message: string, variables: string[] = []) {
    this.output(message, variables, '\x1b[33m%s\x1b[0m');
  }

  /**
   * The context to refer to when running this plugin
   */
  protected _context: Framework;

  /**
   * Sets the config
   */
  constructor(context: Framework) {
    this._context = context;
    // if loggers
    if (this._context.inspect('log').length) {
      return;
    }

    this._context.on('log', (req, res, e) => {
      //if the message is an error
      if (e) {
        //dont make it pretty, just show it.
        return console.error(e);
      }
      //if API error
      if (res.body?.error) {
        Terminal.error(res.body?.message || 'Unknown error');
        return;
      }

      const type = req.params.type;
      const message: string = req.params.message as string;

      switch(type) {
        case 'info':
          Terminal.info(message);
          break;
        case 'system':
          Terminal.system(message);
          break;
        case 'warning':
          Terminal.warning(message);
          break;
        case 'error':
          Terminal.error(message);
          break;
        case 'success':
          Terminal.success(message);
          break;
        default:
          Terminal.output(message);
          break;
      }
    });
  }

  /**
   * Dispatches the response
   */
  dispatch(request: Request, response: Response) {
    //get the body
    let body = response.body;
    //if no body
    if (typeof body === 'undefined' || body === null) {
      return false;
    }

    //we need to consider all events including `user-search`
    //where it's most likely silent
    const output = request.params.output;

    //if raw output
    if (output === 'raw') {
      if (typeof body === 'object') {
        body = JSON.stringify(body);
      }
      console.log(body);
      return true;
    }

    //if boundary output
    if (output === 'boundary') {
      const boundary = 'boundary-------------------------';
      if (typeof body === 'object') {
        body = JSON.stringify(body);
      }
      console.log(boundary);
      console.log(body);
      console.log(boundary);
      return true;
    }

    //if scalar
    if (typeof body !== 'object') {
      console.log(body);
      return true;
    }

    //anything else?
    return false;
  }

  /**
   * Handles a command from the terminal
   */
  async emit(): Promise<boolean> {
    //mock rr
    const im = new IncomingMessage(new Socket());
    const sr = new ServerResponse(im);
    //make payload
    const { request, response } = this._context.payload(im, sr);
    if (request.args.length < 3) {
      const error = Exception.for('No command given');
      await this._context.emit('error', request, response, error);
      return false;
    }
    //parse args and add to request params
    const args = new Store().withArgs.set(request.args.slice(3)).get() || {};
    Object.keys(args).forEach(key => request.stage(key, args[key]));
    //emit event
    await this._context.emit(request.args[2], request, response);
    this.dispatch(request, response);

    return true;
  }
}
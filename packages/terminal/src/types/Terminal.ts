import type { Framework, Request, Response } from 'inceptjs';

import { Socket } from 'net';
import { IncomingMessage, ServerResponse } from 'http';

import { Store } from '@inceptjs/types';
import Exception from './Exception';

export default class Terminal {
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
        console.log(
          '\x1b[31m%s\x1b[0m',
          res.body?.message || 'Unknown error'
        );
        return;
      }

      const type = req.params.type;
      let message: string = req.params.message as string;

      switch(type) {
        case 'info':
          console.log('\x1b[34m%s\x1b[0m', message);
          break;
        case 'system':
          console.log('\x1b[35m%s\x1b[0m', message);
          break;
        case 'warning':
          console.log('\x1b[33m%s\x1b[0m', message);
          break;
        case 'error':
          console.log('\x1b[31m%s\x1b[0m', message);
          break;
        case 'success':
          console.log('\x1b[32m%s\x1b[0m', message);
          break;
        default:
          console.log(message);
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
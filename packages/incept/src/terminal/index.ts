import chalk from 'chalk';
import { Request, Response, Router } from '@inceptjs/framework';

import Exception from './Exception';

const fx = require('fx/fx');
const JSON = require('lossless-json');
JSON.config({circularRefs: false});

export default class TerminalPlugin {
  /**
   * The context to refer to when running this plugin
   */
  protected _context: Router;

  /**
   * Sets the config
   */
  constructor(context: Router) {
    this._context = context;
  }

  /**
   * Dispatches the response
   */
  async dispatch(request: Request, response: Response): Promise<boolean> {
    //get the body
    let body = response.body;
    //if no body
    if (typeof body === 'undefined' || body === null) {
      return false;
    }

    //we need to consider all events including `user-search`
    //where it's most likely silent

    //if raw output
    if (request.params.output === 'raw') {
      if (typeof body === 'object') {
        body = JSON.stringify(body);
      }
      console.log(body);
      return true;
    }

    //if boundary output
    if (request.params.output === 'boundary') {
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

    //if interactive output
    if (request.params.output === 'interactive') {
      fx(request.get('argv', 2), body);
      return true;
    }

    //anything else?
    return false;
  }

  /**
   * Handles a command from the terminal
   */
  async emit(cwd: string, argv: string[]): Promise<boolean> {
    //create a new payload
    const request = new Request;
    const response = new Response;

    //add context
    request.ctx = this._context;
    response.ctx = this._context;
    //add cwd and argsv
    request.set('cwd', cwd).set('argv', argv);

    //if no command
    if (argv.length < 3) {
      const error = Exception.for('No command given');
      await this._context.emit('error', error, request, response);
      return false;
    }
  
    // if no loggers
    if (!this._context.inspect('log').length) {
      this._context.on('log', this.displayLogOnConsole.bind(this));
    }
    
    //get the event and populate request
    const args = argv.slice(2);
    const event = args.shift() as string;
    request.withArgs.set('params', args);
    //suppress 404 error
    response.status(200, 'OK');
    //handle the route
    const route = this._context.route(event);
    await route.handle(request, response);

    //try to dispatch the results
    if (!await this.dispatch(request, response)) {
      //if unable to prepare
      return false;
    }

    return true;
  }

  /**
   * Displays the log on the console
   */
  displayLogOnConsole(message: any, type: string) {
    //if the message is an error
    if (message instanceof Error) {
      //dont make it pretty, just show it.
      return console.log(message);
    }

    if (typeof message !== 'string') {
      message = message.toString()
    }

    switch(type) {
      case 'info':
        message = chalk.blueBright(message)
        break
      case 'system':
        message = chalk.gray(message)
        break
      case 'warning':
        message = chalk.keyword('orange')(message)
        break
      case 'error':
        message = chalk.bold.red(message)
        break
      case 'success':
        message = chalk.green(message)
        break
    }

    console.log(message)
  }
}
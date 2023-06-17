import type { 
  APIResponse, 
  ProjectConfig, 
  IncomingMessage, 
  ServerResponse 
} from '../types';

import Exception from './Exception';

import Router from './Router';
import Request from './Request';
import Response from './Response';

export default class Framework extends Router {
  /**
   * The config for the framework
   */
  protected _config: Partial<ProjectConfig>;

  /**
   * Plugin registry
   */
  protected _plugins: Record<string, any> = {};

  /**
   * Returns the config for the framework
   */
  get config() {
    return this._config;
  }

  /**
   * Load the config
   */
  constructor(config: Partial<ProjectConfig> = {}) {
    super();
    this._config = config;
  }

  /**
   * Handles a payload using events
   */
  async handle(im: IncomingMessage, sr: ServerResponse) {
    //create a new payload
    const { request, response } = this.payload(im, sr);
    try {
      //let middleware contribute before routing
      await this.emit('open', request, response);
      //if it was not already sent off 
      if (!response.sent) {
        //handle the route
        const event = request.method + ' ' + request.url.pathname;
        const route = this.route(event);
        await route.handle(request, response);
        //let middleware contribute to populating resources
        // NOTE: dispatchers should use this instead of close
        await this.emit('dispatch', request, response);
      }
      //let middleware contribute after closing
      await this.emit('close', request, response);
    } catch(e) {
      //let middleware contribute after error
      await this.emit('error', request, response, e as Exception);
    }
    return response;
  }

  /**
   * Allows a plugin to bootstrap itself to the app.
   * This is the opposite of `use()` where the caller
   * chooses how middleware is used. `use()` makes 
   * sense for small projects but can cause 
   * the bootstrap to be extensive overtime
   */
  load(callback: (app: Framework) => void|Promise<void>) {
    Exception.require(
      typeof callback === 'function', 
      'Argument 1 expected Function'
    );
    callback(this);
    return this;
  }

  /**
   * Creates a payload from the message and response
   */
  payload(im: IncomingMessage, sr: ServerResponse) {
    //create a new payload
    const request = this.request(im);
    const response = this.response(sr);
    return { request, response };
  }

  /**
   * Allows a plugin to safely secure a namespace
   * and other plugin to access it safely. This
   * pattern is used as a pollyfill for private 
   * properties (plugins)
   */
  plugin(name: string, definition?: Record<string, any>): Record<string, any> {
    //name should be a string
    Exception.require(
      typeof name === 'string', 
      'Argument 1 expected String'
    );

    //if they mean to create a plugin
    if (typeof definition === 'object') {
      //can only be claimed once
      Exception.require(
        !this._plugins[name], 
        'Plugin `%s` already exists', 
        name
      );

      //create the plugin
      this._plugins[name] = definition;
      //let the code continue
    }

    if (!this._plugins[name]) {
      throw Exception.for('Plugin `%s` does not exist', name);
    }

    //they mean to get the plugin
    return this._plugins[name];
  }

  /**
   * Makes a new request object (IoC)
   */
  request(resource: IncomingMessage): Request {
    return new Request(resource);
  }

  /**
   * Makes a new response object (IoC)
   */
  response(resource: ServerResponse): Response<APIResponse> {
    return new Response<APIResponse>(resource);
  }

  /**
   * Handles a payload using events and sends it off
   */
  async send(im: IncomingMessage, sr: ServerResponse) {
    //handle the payload
    const response = await this.handle(im, sr);
    if (!response.sent) {
      //send the response
      response.send();
    }
  }
}
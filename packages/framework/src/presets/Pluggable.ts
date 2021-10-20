import { 
  EventEmitter,
  Reflection,
  Statuses,
  Store,
  TaskQueue,
  //types
  Emitter,
  Event,
  Queue,
  Status,
  Task
} from '@inceptjs/types';

import Route from '../Route';
import Router from '../Router';
import Request from '../Request';
import Response from '../Response';
import Exception from '../Exception';

export default class Pluggable extends Router {
  /**
   * Plugin registry
   */
  protected plugins: Record<string, any> = {};

  /**
   * Allows a plugin to bootstrap itself to the app.
   * This is the opposite of `use()` where the caller
   * chooses how middleware is used. `use()` makes 
   * sense for small projects but can cause 
   * the bootstrap to be extensive overtime
   */
  bootstrap(callback: Function): Pluggable {
    Exception.require(
      typeof callback === 'function', 
      'Argument 1 expected Function'
    );
    callback.call(this, this);
    return this;
  }

  /**
   * Allows a plugin to safely secure a namespace
   * and other plugin to access it safely. This
   * pattern is used as a pollyfill for private 
   * properties (plugins)
   */
  plugin(name: string, definition?: Record<string, any>): any {
    //name should be a string
    Exception.require(
      typeof name === 'string', 
      'Argument 1 expected String'
    );

    //if they mean to create a plugin
    if (typeof definition === 'object') {
      //can only be claimed once
      Exception.require(
        !this.plugins[name], 
        'Plugin `%s` already exists', 
        name
      );

      //create the plugin
      this.plugins[name] = definition;
      //let the code continue
    }

    //they mean to get the plugin

    //does it exist?
    if (!this.plugins[name]) {
      return false;
    }

    return this.plugins[name];
  }
}

export {
  Request,
  Response,
  Route,
  Pluggable as Router,
  //pass through
  EventEmitter,
  Exception,
  Reflection,
  Statuses,
  Store,
  TaskQueue,
  //types
  Emitter,
  Event,
  Queue,
  Status,
  Task
};
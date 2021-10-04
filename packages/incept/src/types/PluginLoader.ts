import fs from 'fs';
import path from 'path';
import { EventEmitter, Router, Pluggable } from '@inceptjs/framework';
import Exception from './Exception';

export default class PluginLoader {
  /**
   * The current working directory
   */
  protected _cwd: string;
  
  /**
   * The location for `node_modules`
   */
  protected _modules: string;

  /**
   * List of plugins
   */
  protected _config?: string[];

  /**
   * If the config is not set, then it loads it.
   * Returns the plugin configs
   */
  get config(): string[] {
    if (!this._config) {
      let config = require(this.resolve());
      //if import
      if (config.default) {
        config = config.default;
      }
      //if package.json, look for the `incept` key
      if (config.incept) {
        config = config.incept;
      }

      if (typeof config == 'string') {
        config = [ config ];
      }

      this._config = Array.isArray(config) ? config : [];
    }

    return Array.from(this._config);
  }
  
  /**
   * Setups up the current working directory
   */
  constructor(cwd: string, modules: string = '', config?: string[]) {
    let validCwd = fs.existsSync(cwd)
    if (validCwd) {
      const stats = fs.lstatSync(cwd)
      validCwd = stats.isDirectory() || stats.isSymbolicLink()
    }
    Exception.require(
      validCwd,
      'Argument 1 expected valid path ( %s )',
      cwd
    )
    this._cwd = cwd;
    //if no node_modules directory
    if (!modules || !modules.length) {
      //make it the current directory
      modules = path.resolve(cwd, 'node_modules');
    }
    this._modules = modules;
    this._config = config;
  }

  /**
   * Requires all the files and registers it to the context.
   * You can only bootstrap server files.
   */
  bootstrap(context: Pluggable): Pluggable {
    //config should be a list of files
    for (let pathname of this.config) {
      pathname = this.resolve(pathname);
      //require the plugin
      let plugin = require(pathname);
      //if using import
      if (plugin.default) {
        plugin = plugin.default;
      }

      //if package.json, look for the `incept` key
      if (plugin.incept) {
        plugin = plugin.incept;
      } 
      
      if(Array.isArray(plugin)) {
        //get the folder name of the plugin pathname
        const cwd = path.dirname(pathname);
        //make a new plugin
        const child = new PluginLoader(cwd, this._modules, plugin);
        //bootstrap
        child.bootstrap(context);
      } else {
        //try consuming it
        this.use(context, plugin);
      }
    }

    return context;
  }

  /**
   * Resolves the path name to a path that can be required
   */
  resolve(pathname?: string): string {
    //if no pathname
    if (!pathname) {
      pathname = this._cwd;
    //ex. ./plugin or ../plugin -> [cwd] / plugin 
    } else if (pathname.match(/^.{1,2}\//g)) {
      pathname = path.resolve(this._cwd, pathname);
    //ex. plugin/foo
    } else {
      pathname = path.resolve(this._modules, pathname);
    }
    //ex. /plugin/foo
    //it's already absolute...

    //1. Check if pathname is literally a file
    let file = pathname;
    //2. check for [pathname].js
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file += '.js';
    }
    //3. check for [pathname].json
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file += 'on';
    }
    //4. Check for plugin.js
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'plugin.js');
    }
    //5. Check for plugin.json
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) { 
      file += 'on';
    }
    //6. Check for package.json
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'package.json');
    }
    //7. Check for index.js
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'index.js');
    }

    Exception.require (
      fs.existsSync(file) && fs.lstatSync(file).isFile(),
      'Could not resolve `%s`',
      pathname
    );

    return file;
  }

  /**
   * Tries to add the plugin to the context.
   */
  use(context: EventEmitter, plugin: any): void {
    //if context is kind of an event emitter
    if (context instanceof EventEmitter 
      //and the plugin is also an event emitter
      && plugin instanceof EventEmitter
    ) {
      context.use(plugin);
    //if context is a kind of application
    } else if (context instanceof Pluggable
      //and the plugin is a function
      && typeof plugin === 'function'
    ) {
      context.bootstrap(plugin);
    //if the context is a kind of router
    } else if (context instanceof Router 
      //and the plugin is a function
      && typeof plugin === 'function'
    ) {
      context.use(plugin);
    }
  }
}
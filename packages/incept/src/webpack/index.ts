import webpack, { Compiler, Stats } from 'webpack'
import VirtualModulesPlugin from 'webpack-virtual-modules';

import Exception from './Exception'
import defaults from './defaults'

type Event = {
  event: string,
  plugin: string,
  callback: Function
}

type PostCompile = {
  stats: Stats,
  compiler: Compiler
}

export default class WithWebpack {
  /**
   * Webpack config
   */
  protected _config: Record<string, any>;

  /**
   * Webpack events
   */
  protected _events: Event[] = [];

  /**
   * Virtual modules
   */
  protected _virtualModules: Record<string, string> = {};

  /**
   * Returns a webpack compiler
   */
  get compiler(): Compiler {
    const config = this.config;
    //add modules to config
    if (Object.keys(this._virtualModules)) {
      config.plugins.push(
        new VirtualModulesPlugin(this._virtualModules)
      );
    }
    //make the compiler
    const compiler = webpack(this._config);
    //add events
    //@ts-ignore 
    this._events.forEach(event => compiler.hooks[event.event].tap(
      event.plugin,
      event.callback
    ));

    return compiler;
  }

  /**
   * Returns the webpack config
   */
  get config(): Record<string, any> {
    return Object.assign({}, this._config);
  }

  /**
   * Sets the webpack config
   */
  constructor(config: Record<string, any> = {}) {
    this._config = Object.assign({}, defaults, config);
    //make sure there are plugins
    if (!this._config.plugins) {
      this._config.plugins = [];
    }
  }

  /**
   * Adds an entry to the webpack config
   */
  addEntry(name: string, file: string|string[]): WithWebpack {
    Exception.require(
      typeof name === 'string',
      'Argument 1 expected string'
    );

    if (!this._config.entry) {
      this._config.entry = {};
    }
  
    this._config.entry[name] = file;
    return this;
  }

  /**
   * Adds a virtual file to the VirtualModules plugin
   */
  addModule(filename: string, code: string): WithWebpack {
    this._virtualModules[filename] = code;
    return this;
  }

  /**
   * Adds a plugin to the webpack config
   */
  addPlugin(plugin: any): WithWebpack {
    this._config.plugins.push(plugin);
    return this;
  }

  /**
   * Compiles a build
   */
  compile(): Promise<PostCompile> {
    const compiler = this.compiler;
    
    return new Promise((resolve, reject) => {
      compiler.run((error, info) => {
        if (error) {
          return reject(error)
        }

        const stats = info as Stats;

        //if there's an error
        if (stats.hasErrors()) {
          //`stats.toJson()` is memory intensive
          //@ts-ignore wp Stats not properly typed for this...
          reject(Exception.for(stats.toJson({
            all: false,
            errors: true
          }).errors[0].message))

          console.log(stats.toJson({
            all: false,
            errors: true
          }).errors)
        }

        // Done processing
        compiler.close((error) => {
          if (error) {
            reject(error)
          }

          resolve({ compiler, stats })
        })
      })
    }) 
  }

  /**
   * Listens to a webpack event
   */
  on(plugin: string, event: string, callback: Function): WithWebpack {
    Exception.require(
      typeof plugin === 'string',
      'Argument 1 expected string'
    );
    Exception.require(
      typeof event === 'string',
      'Argument 2 expected string'
    );
    Exception.require(
      typeof callback === 'function',
      'Argument 3 expected string'
    );

    this._events.push({ event, plugin, callback })
    return this
  }

  /**
   * Adds an output to the webpack config
   */
  setOutput(
    path: string, 
    filename: string|Function, 
    chunkname?: string|Function
  ): WithWebpack {
    Exception.require(
      typeof path === 'string',
      'Argument 1 expected string'
    );
    Exception.require(
      typeof filename === 'string',
      'Argument 2 expected string'
    );
  
    this._config.output = { path, filename };

    if (chunkname) {
      this._config.output.chunkFilename = chunkname;
    }
    return this;
  }

  /**
   * Watches files
   */
  watch(config: Record<string, any>, callback: Function) {
    //@ts-ignore Sorry I dont know how to do CallbackFunction<Stats> 
    return this.compiler.watch(config, callback);
  }
}
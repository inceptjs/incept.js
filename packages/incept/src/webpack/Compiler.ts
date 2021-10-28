import webpack, { Compiler, Stats } from 'webpack';

import Exception from './Exception';

type Event = {
  event: string,
  plugin: string,
  callback: Function
};

type PostCompile = {
  stats: Stats,
  compiler: Compiler
};

export default class WebpackCompiler {
  /**
   * Webpack config
   */
  public config: Record<string, any>;

  /**
   * Webpack events
   */
  protected _events: Event[] = [];

  /**
   * Returns a webpack compiler
   */
  get compiler(): Compiler {
    //make the compiler
    const compiler = webpack(this.config);
    //add events
    //@ts-ignore 
    this._events.forEach(event => compiler.hooks[event.event].tap(
      event.plugin,
      event.callback
    ));

    return compiler;
  }

  /**
   * Sets the mode in config
   */
  set mode(mode: string) {
    this.config.mode = mode;
  }

  /**
   * Sets the name in config
   */
  set name(name: string) {
    this.config.name = name;
  }

  /**
   * Sets the target in config
   */
  set target(target: string) {
    this.config.target = target;
  }

  /**
   * Sets the webpack config
   */
  constructor(config: Record<string, any> = {}) {
    this.config = config;
  }

  /**
   * Adds an entry to the webpack config
   */
  addEntry(name: string, file: string|string[]): WebpackCompiler {
    Exception.require(
      typeof name === 'string',
      'Argument 1 expected string'
    );

    if (!this.config.entry) {
      this.config.entry = {};
    }

    this.config.entry[name] = file;
    return this;
  }

  /**
   * Adds a plugin to the webpack config
   */
  addPlugin(plugin: any): WebpackCompiler {
    this.config.plugins.push(plugin);
    return this;
  }

  /**
   * Adds a rule to the config
   */
  addRule(rule: Record<string, any>): WebpackCompiler {
    this.config.module.rules.push(rule);
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
  on(
    plugin: string, 
    event: string, 
    callback: Function
  ): WebpackCompiler {
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
   * Pushes a new plugin to an existing rule to the config
   */
  pushRule(
    test: RegExp|string|(RegExp|string)[], 
    plugin: string|Record<string, any>
  ): WebpackCompiler {
    for (const rule of this.config.module.rules) {
      if (rule.test.toString().indexOf(test.toString()) !== -1) {
        rule.use.push(plugin);
        break;
      }
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
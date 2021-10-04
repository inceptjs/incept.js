import path from 'path';
import { http } from '@inceptjs/framework';
import vfs, { VirtualFS } from '@inceptjs/virtualfs';

import Exception from './Exception';
import PluginLoader from './PluginLoader';

import WithWebpack from '../webpack';
import WithBabel from '../babel';
import WithReact from '../react';

const defaults = {
  buildPath: '.build',
  buildURL: '/.build',
  webpack: {}
};

export default class Application extends http.Router {
  /**
   * Connects to the Babel plugin
   */
  public withBabel: WithBabel;

  /**
   * Connects to the React plugin
   */
  public withReact: WithReact;

  /**
   * Connects to the VirtualFS plugin
   */
  public withVirtualFS: VirtualFS;

  /**
   * Connects to the Webpack plugin
   */
  public withWebpack: WithWebpack;

  /**
   * The current working directory
   */
  protected _config: Record<string, any>;

  /**
   * The plugin manager
   */
  protected _pluginManager: PluginLoader;

  /**
   * returns the build path
   */
  get buildPath(): string {
    if (this._config.buildPath[0] === '/') {
      return this._config.buildPath
    }
    const build = path.join(this._config.cwd, this._config.buildPath);
    return path.normalize(build);
  }

  /**
   * returns the build URL
   */
  get buildURL(): string {
    return this._config.buildURL
  }

  /**
   * returns the config
   */
  get config(): Record<string, any> {
    return this._config;
  }

  /**
   * returns the current working directory
   */
  get cwd(): string {
    return this._config.cwd;
  }

  /**
   * Sets up the application
   */
  constructor(config: Config) {
    super();
    Exception.require(
      typeof config.cwd === 'string',
      'config.cwd expected full path'
    );
    this._config = Object.assign({}, defaults, config);
    this._pluginManager = new PluginLoader(this._config.cwd);
    
    this.withBabel = new WithBabel;
    this.withReact = new WithReact(this);
    this.withWebpack = new WithWebpack(this);
    this.withVirtualFS = vfs;
    this.withVirtualFS.patchFS();
  }

  /**
   * Loads all the plugins so it can be consumed by others
   */
  load(): Application {
    this._pluginManager.bootstrap(this);
    return this;
  }
}

//this is for circular reference
export { Application };

export type Config = {
  cwd: string,
  buildPath?: string,
  buildURL?: string
}
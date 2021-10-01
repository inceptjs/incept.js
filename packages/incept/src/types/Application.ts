import { http } from '@inceptjs/framework';
import vfs, { VirtualFS } from '@inceptjs/virtualfs';

import PluginLoader from './PluginLoader';

import WithWebpack from '../webpack';
import WithBabel from '../babel';
import WithReact from '../react';

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
  protected _cwd: string;

  /**
   * The plugin manager
   */
  protected _pluginManager: PluginLoader;

  /**
   * returns the current working directory
   */
  get cwd() {
    return this._cwd;
  }

  /**
   * Sets up the application
   */
  constructor(cwd: string) {
    super();
    this._cwd = cwd;
    this._pluginManager = new PluginLoader(cwd);
    
    this.withBabel = new WithBabel;
    this.withReact = new WithReact(cwd);
    this.withVirtualFS = vfs;
    this.withWebpack = new WithWebpack;
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
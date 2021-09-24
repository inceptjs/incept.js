import { http } from '@inceptjs/framework'
import PluginLoader from './PluginLoader'
import WithWebpack from '../webpack'
import WithReact from '../react';

export default class Application extends http.Router {
  /**
   * Connects to the React plugin
   */
  public withReact: WithReact;

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
    
    this.withReact = new WithReact(cwd);
    this.withWebpack = new WithWebpack;
  }

  /**
   * Loads all the plugins so it can be consumed by others
   */
  load(): Application {
    this._pluginManager.bootstrap(this);
    return this;
  }
}
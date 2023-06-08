import fs from 'fs';
import path from 'path';

import Exception from './Exception';

/**
 * Loader
 */
export default class Loader {
  /**
   * Returns the current working directory
   */
  static cwd() {
    return process.cwd();
  }
  
  static schemas(cwd?: string) {
    cwd = cwd || this.cwd();
    const config = this.config(cwd);
    let schemas = config.schemas || './schemas';
    if (schemas.startsWith('.')) {
      schemas = path.resolve(cwd, schemas);
    }
    return schemas;
  }

  /**
   * Should locate the node_modules directory 
   * where incept is actually installed
   */
  static modules(cwd?: string): string {
    cwd = cwd || this.cwd();
    if (cwd === '/') {
      throw new Error('Could not find node_modules');
    }
    if (fs.existsSync(path.resolve(cwd, 'node_modules/inceptjs'))) {
      return path.resolve(cwd, 'node_modules');
    }
    return this.modules(path.dirname(cwd));
  }

  /**
   * Looks for the config in incept.config.js, 
   * incept.config.json, or package.json
   */
  static config(cwd?: string) {
    cwd = cwd || this.cwd();
    //look in incept.config.js for the schema files
    let file = path.join(cwd, 'incept.config.js');
    if (!fs.existsSync(file)) {
      //look in incept.config.json for the schema files
      file += 'on';
      if (!fs.existsSync(file)) {
        //look in package.json for the schema files
        file = path.join(cwd, 'package.json');
        if (!fs.existsSync(file)) {
          throw new Error('Could not find config path');
        }
      }
    }

    const config = this.require(file);
    return (config.incept || config) as Record<string, any>;
  }

  /**
   * Returns a list of plugins to load
   */
  static plugins(cwd?: string, plugins: string[] = []) {
    cwd = cwd || this.cwd();
    //config should be a list of files
    for (let pathname of plugins) {
      pathname = this.resolve(pathname, cwd);
      //require the plugin
      let plugin;
      try {
        plugin = this.require(pathname);
      } catch(e) {
        //it could be a bootstrap file vs a plugin config
        continue;
      }
      //if using import
      if (plugin.default) {
        plugin = plugin.default;
      }
      //if package.json, look for the `incept` key
      if (plugin.incept) {
        plugin = plugin.incept;
      } 
      //if there is a plugins key, use that
      if (plugin.plugins) {
        plugin = plugin.plugins;
      } 
      //plugins is an array of strings
      if(Array.isArray(plugin)) {
        this.plugins(path.dirname(pathname), plugin);
      } else if (typeof plugin === 'string') {
        plugins.push(plugin);
      }
    }

    return plugins;
  }

  /**
   * Resolves the path name to a path that can be required
   */
  static resolve(pathname?: string, cwd?: string): string {
    cwd = cwd || this.cwd();
    //if no pathname
    if (!pathname) {
      pathname = cwd;
    //ex. ./plugin or ../plugin -> [cwd] / plugin 
    } else if (pathname.match(/^.{1,2}\//g)) {
      pathname = path.resolve(cwd, pathname);
    //ex. plugin/foo
    } else {
      pathname = path.resolve(this.modules(), pathname);
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
    //8. Check for index.ts
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'index.ts');
    }
    //9. Check for plugin.ts
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'plugin.ts');
    }
    //10. Check for [pathname].ts
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = pathname + '.ts';
    }

    Exception.require (
      fs.existsSync(file) && fs.lstatSync(file).isFile(),
      'Could not resolve `%s`',
      pathname
    );

    return file;
  }

  /**
   * require() should be monitored separately from the code
   */
  static require(file: string) {
    //if JSON, safely require it
    if (path.extname(file) === '.json') {
      const contents = fs.readFileSync(file, 'utf8');
      try {
        return JSON.parse(contents) || {};
      } catch(e) {}
      return {};
    }
    
    return require(file);
  }
}
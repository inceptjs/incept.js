import fs from 'fs';
import path from 'path';

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
    let config = path.join(cwd, 'incept.config.js');
    //dynamic imports wont easily work with webpack (ie. nextjs)
    //if (fs.existsSync(config)) {
    //  return config;
    //}
    
    config += 'on';
    //look in incept.config.json for the schema files
    if (fs.existsSync(config)) {
      return config;
    }

    //look in package.json for the schema files
    config = path.join(cwd, 'package.json');
    if (fs.existsSync(config)) {
      return config;
    }
  
    throw new Error('Could not find config path');
  }

  /**
   * require() should be monitored separately from the code
   */
  static async require(file: string) {
    //if JSON, safely require it
    if (path.extname(file) === '.json') {
      const contents = fs.readFileSync(file, 'utf8');
      try {
        return JSON.parse(contents) || {};
      } catch(e) {}
      return {};
    }
    
    //if anything else, just require it
    //we can't actually require(), because webpack can't 
    //dynamically bundle ie. nextjs
    //return require(file);
    return await import(file);
  }
}
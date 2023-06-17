import type { ProjectConfig } from 'inceptjs';

import fs from 'fs';
import path from 'path';

/**
 * Loader
 */
export default class Loader {
  /**
   * Returns the schema directory
   */
  static schemas(config: Partial<ProjectConfig>) {
    return this.absolute(
      config.schema?.build || './schemas', 
      config.cwd || process.cwd()
    );
  }

  /**
   * Returns the fieldset directory
   */
  static fieldsets(config: Partial<ProjectConfig>) {
    return this.absolute(
      config.fieldset?.build || './fieldsets', 
      config.cwd || process.cwd()
    );
  }

  /**
   * Should locate the node_modules directory 
   * where incept is actually installed
   */
  static modules(cwd: string): string {
    if (cwd === '/') {
      throw new Error('Could not find node_modules');
    }
    if (fs.existsSync(path.resolve(cwd, 'node_modules/inceptjs'))) {
      return path.resolve(cwd, 'node_modules');
    }
    return this.modules(path.dirname(cwd));
  }

  /**
   * Returns the absolute path to the file
   */
  static absolute(pathname: string, cwd: string) {
    if (pathname.startsWith('.')) {
      pathname = path.resolve(cwd, pathname);
    }
    //if the pathname does not start with /, 
    //the path should start with modules
    if (!pathname.startsWith('/')) {
      pathname = path.resolve(this.modules(cwd), pathname);
    }
    return pathname;
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
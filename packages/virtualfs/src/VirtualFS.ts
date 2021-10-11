import fs, { PathLike } from 'fs';
import path from 'path';
import Module from 'module';

import { EventEmitter, Response } from '@inceptjs/framework';

import { Volume as MemVolume } from 'memfs';
import { TDataOut } from 'memfs/lib/encoding';
import { TFileId, Volume, IStatOptions } from 'memfs/lib/volume';
import Stats from 'memfs/lib/Stats';

import patchFS from './patchFS';
import Exception from './Exception';

interface RouteParams {
  /**
   * The file being requested
   */
  file: string;

  /**
   * The pattern that the file is being matched against
   */
  pattern: RegExp;

  /**
   * The args generated when matching a file with a pattern
   */
  args: any[];

  /**
   * The params generated when matching a file with a pattern
   */
  params: Record<string, any>;
}

export default class VirtualFS extends MemVolume {
  /**
   * We use an emitter to manage the routes
   */
  protected _emitter: EventEmitter = new EventEmitter;

  /**
   * Placeholder for the FS revert function when patched up to the main FS
   */
  protected _revertFS: Function|null = null;

  /**
   * Mapping of regex to transformations
   */
  protected _transformers: Transformer[] = [];

  /**
   * Original methods map
   */
  protected _originals: Record<string, Function> = {
    existsSync: fs.existsSync.bind(fs)
  };
  
  /**
   * Registers a transformer
   */
  public addRule(test: RegExp|Function, callback: Function): VirtualFS {
    Exception.require(
      typeof test === 'function' || test instanceof RegExp, 
      'Argument 1 expecting RegExp or Function'
    );

    Exception.require(
      typeof callback === 'function', 
      'Argument 2 expecting Function'
    );
    this._transformers.push({ test, callback });
    return this;
  }

  /**
   * Calls `route()` before `exists()`
   */
  public exists(path: PathLike, callback: (exists: boolean) => void) {
    this._resolveFile(path as string);
    return super.exists(path, callback);
  }

  /**
   * Calls `route()` before `existsSync()`
   */
  public existsSync(path: PathLike): boolean {
    this._resolveFile(path as string);
    return super.existsSync(path);
  }

  /**
   * Calls `route()` before `lstat()`
   */
  public lstat(path: PathLike, ...args: any) {
    this._resolveFile(path as string);
    //@ts-ignore
    return super.lstat(path, ...args);
  }

  /**
   * Calls `route()` before `lstatSync()`
   */
  public lstatSync(path: PathLike): Stats<number>;
  public lstatSync(path: PathLike, options: { bigint: false }): Stats<number>;
  public lstatSync(path: PathLike, options: { bigint: true }): Stats<bigint>;
  public lstatSync(path: PathLike, options?: IStatOptions): Stats {
    this._resolveFile(path as string);
    return super.lstatSync(path);
  }

  /**
   * A helper to provide a list of node_modules starting from the path
   */
  public modulePaths(pathname: string, parent?: string): string[] {
    parent = parent || path.dirname(pathname);
    const module = new Module(path.dirname(parent));
    //@ts-ignore
    module.paths = Module._nodeModulePaths(pathname, module);
    //@ts-ignore
    return Module._resolveLookupPaths(pathname, module);
  }

  /**
   * Merges the VirtualFS into Node's FS
   */
  public patchFS(): VirtualFS {
    //if it's already patched
    if (typeof this._revertFS === 'function') {
      return this;
    }

    this._revertFS = patchFS(this);
    //@ts-ignore
    this._originals._findPath = Module._findPath;
    //@ts-ignore 
    Module._findPath = this._findPath.bind(this);
    return this;
  }

  /**
   * Calls `_route()` before readFileSync
   */
  public readFileSync(id: TFileId, ...args: any): TDataOut {
    this._resolveFile(id as string);
    //transform the results
    return this.transform(id as string, super.readFileSync(id, ...args));
  }

  /**
   * Calls `_route()` before readFile
   */
  public readFile(id: TFileId, ...args: any) {
    this._resolveFile(id as string);
    //if there's a callback
    if (typeof args[args.length - 1] === 'function') {
      //wrap the callback
      const callback = args[args.length - 1];
      args[args.length - 1] = (error: Error, results: string|Buffer) => {
        if (results) {
          //so we can transform it
          results = this.transform(id as string, results);
        }
        callback(error, results)
      };
    }
    //@ts-ignore
    super.readFile(id, ...args);
  }

  /**
   * Helper to resolve a path. Checks .js, .jsx, .json, ./index.js, etc.
   */
  public resolvePath(
    request: string, 
    paths: string[] = [],
    context: any = fs
  ): string|boolean {
    let filename;
    //1. try absolute pathing
    if (
      //1. try absolute pathing
      !(filename = tryAbsolute(request, context))
      //2. try relative pathing
      && !(filename = tryRelative(request, paths, context))
      //3. try module pathing
      && !(filename = tryModule(request, paths, context))
    ) {
      return false;
    }

    return filename;
  }

  /**
   * A helper to resolve a node module
   */
  public resolveModule(name: string, parent: string): string|boolean {
    const paths = this.modulePaths(name, parent);
    for (const pathname of paths) {
      const folder = path.join(pathname, name);
      if (fs.existsSync(folder)) {
        return folder;
      }
    }

    return false;
  }

  /**
   * Reverts the FS patch
   */
  public revertPatch(): Volume {
    if (typeof this._revertFS === 'function') {
      this._revertFS();
      this._revertFS = null;
    }

    if (typeof this._originals._findPath === 'function') {
      //@ts-ignore
      Module._findPath = this._originals._findPath;
      delete this._originals._findPath;
    }
  
    return this;
  }

  /**
   * Register routes to be considered when `readFile` like is called
   */
  public route(path: string, router: Function): Volume {
    Exception.require(
      typeof path === 'string', 
      'Argument 1 expected String'
    );

    Exception.require(
      typeof router === 'function', 
      'Argument 2 expected String'
    );
  
    //convert path to a regex pattern
    const pattern = path
      //replace the :variable-_name01
      .replace(/(\:[a-zA-Z0-9\-_]+)/g, '*')
      //replace the stars
      //* -> ([^/]+)
      //@ts-ignore Property 'replaceAll' does not exist on type 'string'
      //but it does exist according to MDN...
      .replaceAll('*', '([^/]+)')
      //** -> ([^/]+)([^/]+) -> (.*)
      .replaceAll('([^/]+)([^/]+)', '(.*)');

    //now form the event pattern
    const event = new RegExp(`^${pattern}/*$`, 'ig');
    this._emitter.on(event, router);
    return this;
  }

  /**
   * Returns dynamic variables from path pattern
   */
  public routeParams(file: string, route: string): Record<string, any> {
    Exception.require(
      typeof file === 'string', 
      'Argument 1 expected String'
    );

    Exception.require(
      typeof route === 'string', 
      'Argument 2 expected String'
    );
  
    //convert path to a regex pattern
    const pattern = route
      //replace the :variable-_name01
      .replace(/(\:[a-zA-Z0-9\-_]+)/g, '*')
      //replace the stars
      //* -> ([^/]+)
      //@ts-ignore Property 'replaceAll' does not exist on type 'string'
      //but it does exist according to MDN...
      .replaceAll('*', '([^/]+)')
      //** -> ([^/]+)([^/]+) -> (.*)
      .replaceAll('([^/]+)([^/]+)', '(.*)');

    //this is what we will be returning
    const params: RouteParams = {
      file: file,
      pattern: new RegExp(`^${pattern}/*$`, 'ig'),
      args: [],
      params: {}
    };

    //this is how to unlock the args and variables...

    //find all the matches
    const matches = Array.from(params.file.matchAll(pattern));
    //if no matches
    if (!Array.isArray(matches[0]) || !matches[0].length) {
      return params;
    }

    //find and organize all the dynamic parameters for mapping
    const map = Array.from(
      route.matchAll(/(\:[a-zA-Z0-9\-_]+)|(\*\*)|(\*)/g)
    ).map(match => match[0]);
    //loop through the matches
    matches[0].slice().forEach((param, i) => {
      //skip the first one (GET)
      if (!i) {
        return;
      }

      //so matches will look like
      // [ '/foo/bar', 'foo', 'bar' ]
      //and map will look like
      // [ ':foo', ':bar' ]

      //if it's a * param
      if (typeof map[i - 1] !== 'string' 
        || map[i - 1].indexOf('*') === 0
      ) {
        //if no / in param
        if (param.indexOf('/') === -1) {
          //single push
          return params.args.push(param);
        }

        //push multiple values
        return Array.prototype.push.apply(
          params.args, 
          param.split('/')
        );
      }

      //if it's a :parameter
      if (typeof map[i - 1] === 'string') {
        params.params[map[i - 1].substr(1)] = param;
      }
    });

    return params;
  }

  /**
   * Calls `route()` before `stat()`
   */
  public stat(path: PathLike, ...args: any) {
    this._resolveFile(path as string);
    //@ts-ignore
    return super.stat(path, ...args);
  }

  /**
   * Calls `route()` before `statSync()`
   */
  public statSync(path: PathLike): Stats<number>;
  public statSync(path: PathLike, options: { bigint: false }): Stats<number>;
  public statSync(path: PathLike, options: { bigint: true }): Stats<bigint>;
  public statSync(path: PathLike, options?: IStatOptions): Stats {
    this._resolveFile(path as string);
    return super.statSync(path);
  }

  /**
   * Processes all the matching transformers onto the code
   */
  public transform(file: string, body: string|Buffer): string|Buffer {
    for (const transformer of this._transformers) {
      const valid = typeof transformer.test === 'function' 
        ? transformer.test(file)
        : transformer.test.test(file);
      
      if(valid) {
        const transformed = transformer.callback(file, body);
        if (typeof transformed === 'string') {
          body = transformed;
        }
      }
    }
    return body;
  }

  /**
   * Used to override `Module._findPath()`
   */
  protected _findPath(
    request: string, 
    paths: string[], 
    isMain: boolean
  ): string|boolean {
    //first try the original way
    let filename = this._originals._findPath.call(
      Module, 
      request, 
      paths, 
      isMain
    );
    if (filename) {
      //the original `_findPath` will automatically cache it
      return filename;
    }

    if (!(filename = this.resolvePath(request, paths, this))) {
      return false;
    }

    //cache it
    const cacheKey = request + '\x00' + paths.join('\x00');
    //@ts-ignore
    Module._pathCache[cacheKey] = filename;
    return filename;
  }

  /**
   * Does the routing when `readFile` is called
   */
  protected _resolveFile(file: string): VirtualFS {
    //if it already exists
    if (this._originals.existsSync(file) || super.existsSync(file)) {
      return this;
    }

    //at this point, the routes are considered

    const response = new Response();
    this._emitter.emitSync(file, file, response, this);
  
    if (response.body && typeof response.body === 'object') {
      response.write(JSON.stringify(response.body, null, 4));
    }

    if (typeof response.body !== 'undefined' && response.body !== null) {
      const dirname = path.dirname(file);
      if (!super.existsSync(dirname)) {
        this.mkdirSync(dirname, { recursive: true })
      }

      this.writeFileSync(file, response.body);
    }

    return this;
  }
}

function tryAbsolute(request: string, fs: any): string|boolean {
  //if it's not a absolute path
  if (!path.isAbsolute(request)) {
    return false;
  }

  let file: string|boolean = request;
  if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
    return file;
  }

  file = tryVariants(file, fs);
  if (file) {
    return file;
  }

  return false;
}

function tryRelative(
  request: string, 
  paths: string[], 
  fs: any
): string|boolean {
  //if it's relative
  if (!paths.length || !/^\.{1,2}[\/\\]/.test(request)) {
    return false;
  }
  
  let file: string|boolean = path.resolve(paths[0], request);
  if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
    return file;
  }

  file = tryVariants(file, fs);
  if (file) {
    return file;
  }

  return false;
}

function tryModule(
  request: string, 
  paths: string[], 
  fs: any
): string|boolean {
  for (const pathname of paths) {
    let file: string|boolean = path.resolve(pathname, request);
    if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
      return file;
    }

    file = tryVariants(file, fs);
    if (file) {
      return file;
    }
  }

  return false;
}

function tryVariants(request: string, fs: any): string|boolean {
  let file = tryExtensions(request, fs);
  if (file) {
    return file;
  }

  file = tryIndex(request, fs);
  if (file) {
    return file;
  }
  return false;
}

function tryIndex(request: string, fs: any): string|boolean {
  let file: string|boolean = `${request}/index`;
  if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
    return file;
  }

  file = tryExtensions(file, fs);
  if (file) {
    return file;
  }

  return false;
}

function tryExtensions(request: string, fs: any): string|boolean {
  let file = `${request}.js`;
  if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
    return file;
  }

  file = `${request}.jsx`;
  if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
    return file;
  }

  file = `${request}.json`;
  if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
    return file;
  }

  return false;
}

const vfs = new VirtualFS;
export { vfs };

export type Transformer = {
  test: RegExp|Function;
  callback: Function;
}
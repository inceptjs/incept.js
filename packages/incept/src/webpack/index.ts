import fs from 'fs';
import path from 'path';
import LoadablePlugin from '@loadable/webpack-plugin';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { Stats, Compilation, HotModuleReplacementPlugin } from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { Application } from '../types/Application';

import defaults from './defaults';
import WebpackCompiler from './Compiler';

const statsReporting = {
  cached: false,
  colors: true,
  assets: false,
  chunks: false,
  chunkModules: false,
  chunkOrigins: false,
  errors: true,
  errorDetails: true,
  hash: false,
  modules: false,
  timings: false,
  warnings: false,
  version: false,
  children: false,
  reasons: false,
  source: false,
};

export default class WithWebpack {
  /**
   * The app instance
   */
  protected _application: Application;
  
  /**
   * Sets the webpack config
   */
  constructor(app: Application) {
    this._application = app;
  }

  /**
   * Configures the bundler for static or server
   */
  bundle(
    target: Target = Target.Static,
    mode: Mode = Mode.Development, 
    write: boolean = false
  ) {
    //---------------------------------------------------------------//
    // Common Configuration
    const { cwd, withVirtualFS: vfs } = this._application;
    const bundler = new WebpackCompiler(Object.assign(
      defaults[target](this._application), 
      this._application.config.webpack[target]
    ));
    const buildPath = path.join(this._application.buildPath, target);
    const config = bundler.config;
    //set dev or prod mode
    config.mode = mode;
    //setup the `@loadable/webpack-plugin` config
    const loadableConfig: Record<string, any> = { 
      filename: 'stats.json' 
    };
    //if we are writing to disk
    if (write) {
      //tell loadable where we are writing this to
      loadableConfig.writeToDisk = { filename: buildPath };
    } else {
      //this is a trick to load the stats in memory using virtualFS
      bundler.on(
        'loadable-in-memory', 
        'afterCompile', 
        (compilation: Compilation) => {
          const loadable = new LoadablePlugin;
          if (!vfs.existsSync(buildPath)) {
            vfs.mkdirSync(buildPath, { recursive: true });
          }
          vfs.writeFileSync(
            path.join(buildPath, 'stats.json'), 
            //@ts-ignore `handleEmit()` already stringifies the object
            loadable.handleEmit(compilation).source()
          );
        }
      );
    }
    //add loadable (for file chunking)
    bundler.addPlugin(new LoadablePlugin(loadableConfig));
    // After webpack rebuild, clear the files from the require cache,
    // so that next server side render wil be in sync
    bundler.on('cleanup-the-require-cache', 'afterEmit', () => {
      Object.keys(require.cache).filter(key => key.includes(cwd) 
        //clearing node_modules and any of them using instanceof will
        //fail, so we should not clear node_modules once it's used
        && !key.includes(path.join(cwd, 'node_modules')
      )).forEach(key => delete require.cache[key]);
    });
    //For some reason `webpack-dev-middleware` is compiling for the 
    //regular build and another for cache. It makes it look like it's 
    //compiling the same thing twice and could be mistaken for a bug.
    //all this does is make sure when the compile is complete it is 
    //logged once. TODO: Find a better solution...
    let done = false;
    bundler.on('display-ready', 'done', (stats: Stats) => {
      if (done) return;
      const time = stats.compilation.endTime - stats.compilation.startTime;
      this._application.emit('log', `compiled ${target} in ${time}ms`);
      done = true;
    });

    //set the entry location
    bundler.addEntry('main', path.join(cwd, `.build/virtual/${target}.js`));

    //---------------------------------------------------------------//
    // Target: Static, Mode: Development
    if (target === Target.Static && mode === Mode.Development) {
      //add hot to all entries
      for (const entry in config.entry) {
        config.entry[entry] = [
          'webpack-hot-middleware/client?path=/__incept', 
          config.entry[entry] 
        ];
      }
      //add to the output
      config.output.hotUpdateMainFilename = 'develop/[runtime].[fullhash].hot-update.json';
      config.output.hotUpdateChunkFilename = 'develop/[id].[fullhash].hot-update.js';
      //add HOT module
      bundler.addPlugin(new HotModuleReplacementPlugin);
      //add react refresh
      bundler.addPlugin(new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: 'whm'
        }
      }));
      //updates on react component changes (for dev)
      config.module.rules[0].use[0].options.plugins.push(
        'react-refresh/babel'
      );
    }

    return bundler
  }

  /**
   * `$ incept build` - Builds the bundles
   */
  build() {
    //get build folder from app config
    const { buildPath } = this._application;
    //if there is a build folder
    if (fs.existsSync(buildPath)) {
      //remove the build path
      fs.rmSync(buildPath, { recursive: true });
    }

    //make a static entry file
    const staticEntry = path.join(buildPath, `virtual/static.js`);
    fs.mkdirSync(path.dirname(staticEntry), { recursive: true });
    fs.writeFileSync(staticEntry, this.staticEntryCode());
    //make a server entry file
    const serverEntry = path.join(buildPath, `virtual/server.js`);
    fs.mkdirSync(path.dirname(serverEntry), { recursive: true });
    fs.writeFileSync(serverEntry, this.serverEntryCode());
    //bundle both the server and static files...
    this
      .bundle(Target.Static, Mode.Production, true)
      .compiler.run(this.report);
    this
      .bundle(Target.Server, Mode.Production, true)
      .compiler.run(this.report);
  
    return this;
  }

  /**
   * Generates a static entry file
   */
  staticEntryCode(): string {
    const { 
      app, 
      imports, 
      exports, 
      loadables, 
      routesJson 
    } = this._application.withReact.compile();

    return [
      `import React from 'react'`,
      `import { hydrate } from 'react-dom'`,
      `import { BrowserRouter } from 'react-router-dom'`,
      `import loadable, { loadableReady } from '@loadable/component'`,
      `import App from '${app}'`,
      ...imports,
      'loadableReady(() => {',
      ...loadables,
      `  const routes = ${routesJson}`,
      `  const props = { ${exports.join(', ')} }`,
      '  hydrate(',
      '    <BrowserRouter><App {...props} /></BrowserRouter>,',
      `    document.getElementById('__incept_root')`,
      '  )',
      '})'
    ].join("\n")
  }

  /**
   * `$ incept dev` - Development configuration
   */
  develop(write: boolean = false) {
    const { 
      buildPath, 
      buildURL, 
      withVirtualFS: vfs
    } = this._application;

    //make a static entry file (virtually)
    const staticEntry = path.join(buildPath, 'virtual/static.js');
    vfs.mkdirSync(path.dirname(staticEntry), { recursive: true });
    vfs.writeFileSync(staticEntry, this.staticEntryCode());
    //make a server entry file (virtually)
    const serverEntry = path.join(buildPath, 'virtual/server.js');
    vfs.mkdirSync(path.dirname(serverEntry), { recursive: true });
    vfs.writeFileSync(serverEntry, this.serverEntryCode());
    //get both the server and static webpack compilers
    const staticCompiler = this
      .bundle(Target.Static, Mode.Development, write)
      .compiler;
    const serverCompiler = this
      .bundle(Target.Server, Mode.Development, write)
      .compiler;
    //if we are not writing to disk
    if (!write) {
      //change the compiler's fs to VirtualFS
      serverCompiler.outputFileSystem = vfs;
    }
    //bundle the server files
    serverCompiler.run((error, stats) => {
      this.report(error, stats);
      //now watch for changes...
      serverCompiler.watch({}, (error, stats) => {
        this.report(error, stats);
        //clear the require cache
        delete require.cache[serverEntry];
      });
    });
  
    //setup webpack-dev-middleware
    const dev = webpackDevMiddleware(staticCompiler, {
      serverSideRender: true,
      publicPath: buildURL,
      writeToDisk: write
    });
    //setup webpack-hot-middleware
    const hot = webpackHotMiddleware(staticCompiler, {
      log: false,
      path: '/__incept',
      heartbeat: 10 * 1000
    });
    //return useful things
    return { staticCompiler, serverCompiler, dev, hot };
  }

  /**
   * The callback after calling `webpack.run()`
   */
  report = (error: Error|undefined, stats: Stats|undefined) => {
    if (error) {
      this._application.emit('log', error, 'error');
    } else if (stats?.hasErrors()) {
      this._application.emit('log', stats.toString(statsReporting));
    }
  }

  /**
   * Generates a server entry file
   */
  serverEntryCode(): string {
    const { 
      app, 
      imports, 
      exports, 
      loadables, 
      routesJson 
    } = this._application.withReact.compile();

    return [
      `import React from 'react'`,
      `import loadable, { loadableReady } from '@loadable/component'`,
      `import App from '${app}'`,
      ...imports,
      ...loadables,
      `const routes = ${routesJson}`,
      `const props = { ${exports.join(', ')} }`,
      'export default () => (<App {...props} />)'
    ].join("\n")
  }
}

export enum Target {
  Server = 'server',
  Static = 'static'
}

export enum Mode {
  Development = 'development',
  Production = 'production'
}
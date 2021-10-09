import path from 'path';
import { Stats, Compilation, HotModuleReplacementPlugin } from 'webpack';
import LoadablePlugin from '@loadable/webpack-plugin';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { Application } from '../types/Application';

import defaults from './defaults';
import WebpackCompiler from './Compiler';

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

  bundle(
    target: Target = Target.Static,
    mode: Mode = Mode.Development, 
    write: boolean = false
  ) {
    //---------------------------------------------------------------//
    // Common Configuration
    const { cwd, withVirtualFS: vfs, withReact: react } = this._application;
    const bundler = new WebpackCompiler(Object.assign(
      defaults[target](this._application), 
      this._application.config.webpack[target]
    ));
    const buildPath = path.join(this._application.buildPath, target);
    const config = bundler.config;
    //set dev or prod mode
    config.mode = mode;
    //setup the `@loadable/webpack-plugin` config
    const loadableConfig: Record<string, any> = { filename: 'stats.json' };
    //if we are writing to disk
    if (write) {
      //tell loadable where we are writing this to
      loadableConfig.writeToDisk = { filename: buildPath };
    } else {
      //this is a trick to load the stats in memory usin virtualFS
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
      console.log(`compiled ${target} in ${time}ms`);
      done = true;
    });

    //---------------------------------------------------------------//
    // Target: Static
    if (target === Target.Static) {
      //add routes as bundler entries
      for(const route of react.routes) {
        //determine the name (same as ReactPlugin.render)
        const name = this.clientEntryFileName(route.path);
        //determine the virtual entry
        const entry = path.join(cwd, `.build/virtual/${name}.js`);
        bundler.addEntry(name, entry);
      }

      //if Mode: Development
      if (mode === Mode.Development) {
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
        config.module.rules[0].use[0].options.plugins.push('react-refresh/babel');
      }
    }
    
    //---------------------------------------------------------------//
    // Target: Server
    if (target === Target.Server) {
      const entry = path.join(cwd, `.build/virtual/_server.js`);
      bundler.addEntry('main', entry);
    }

    return bundler
  }

  /**
   * Client development configuration
   */
  develop(write: boolean = false) {
    const { 
      cwd, 
      buildURL, 
      withVirtualFS, 
      withReact 
    } = this._application;

    //add routes as bundler entries
    for(const route of withReact.routes) {
      //determine the name (same as ReactPlugin.render)
      const name = this.clientEntryFileName(route.path);
      //determine the virtual entry
      const entry = path.join(cwd, `.build/virtual/${name}.js`);
      withVirtualFS.mkdirSync(path.dirname(entry), { recursive: true });
      withVirtualFS.writeFileSync(entry, this.clientEntryCode(route.path));
    }

    const entry = path.join(cwd, `.build/virtual/_server.js`);
    withVirtualFS.mkdirSync(path.dirname(entry), { recursive: true });
    withVirtualFS.writeFileSync(entry, this.serverEntryCode());
    
    const client = this
      .bundle(Target.Static, Mode.Development, write)
      .compiler;
    
    const server = this
      .bundle(Target.Server, Mode.Development, write)
      .compiler;

    if (!write) {
      server.outputFileSystem = withVirtualFS;
    }

    server.run((error) => { if (error) throw error });
  
    const dev = webpackDevMiddleware(client, {
      serverSideRender: true,
      publicPath: buildURL,
      writeToDisk: write
    });
    
    const hot = webpackHotMiddleware(client, {
      log: false,
      path: '/__incept',
      heartbeat: 10 * 1000
    });
  
    return { client, server, dev, hot }
  }

  /**
   * Generates a client entry file
   */
  clientEntryCode(pathname: string): string {
    const { 
      app, 
      imports, 
      exports, 
      loadables, 
      routesJson 
    } = this._application.withReact.compile(pathname);

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
   * generates a file name based on the router path
   */
  clientEntryFileName(path: string): string {
    path = path.replaceAll(':', '')
    if (path.indexOf('/') === 0) {
      path = path.substr(1)
    }
    if (!path.length) {
      path = 'index'
    }
    return path
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
      `import { hydrate } from 'react-dom'`,
      `import { BrowserRouter } from 'react-router-dom'`,
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
import path from 'path';
import { Stats, Compilation } from 'webpack';
import { HotModuleReplacementPlugin } from 'webpack';
import LoadablePlugin from '@loadable/webpack-plugin';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { Application } from '../types/Application';

import WebpackCompiler from './Compiler'

export default class WithWebpack {
  /**
   * The app instance
   */
  public _application: Application;

  /**
   * The webpack compiler instance
   */
  public withCompiler: WebpackCompiler;
  
  /**
   * Sets the webpack config
   */
   constructor(app: Application) {
    this._application = app;
    this.withCompiler = new WebpackCompiler(app.config.webpack);
  }

  develop(write: boolean = false) {
    const { cwd, withVirtualFS: vfs, withReact: react } = this._application;
    const bundler = this.withCompiler;
    const buildURL = this._application.buildURL;
    const buildPath = path.join(this._application.buildPath, 'static');
  
    const chunkNamer = (fileinfo: Record<string, any>) => {
      const name = fileinfo.chunk.name.replace(/_js$/, '').split('_').pop();
      const hash = fileinfo.chunk.renderedHash;
      return path.join('chunks', `${name}.${hash}.js`);
    };

    const loadableConfig = { 
      filename: 'stats.json'
    };

    if (write) {
      //@ts-ignore
      loadableConfig.writeToDisk = { filename: buildPath }
    }
    
    //with webpack bundler
    bundler
      // set the output location
      .setOutput(buildPath, 'entries/[name].js', buildURL, chunkNamer)
      //add loadable (for file chunking)
      .addPlugin(new LoadablePlugin(loadableConfig))
      //add css module
      .addPlugin(new MiniCssExtractPlugin({
        filename: '/styles/[name].[contenthash].css',
      }))
      //add HOT module (for dev server)
      .addPlugin(new HotModuleReplacementPlugin)
      //add react refresh (for dev server)
      .addPlugin(new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: 'whm'
        }
      }));
    
    // After webpack rebuild, clear the files from the require cache,
    // so that next server side render wil be in sync
    bundler.on('cleanup-the-require-cache', 'afterEmit', () => {
      Object.keys(require.cache).filter(key => key.includes(cwd) 
        //clearing node_modules and any of them using instanceof will
        //fail, so we should not clear node_modules once it's used
        && !key.includes(path.join(cwd, 'node_modules')
      )).forEach(key => delete require.cache[key])
    });
  
    if (!write) {
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
      )
    }
  
    //For some reason `webpack-dev-middleware` is compiling for the 
    //regular build and another for cache. It makes it look like it's 
    //compiling the same thing twice and could be mistaken for a bug.
    //all this does is make sure when the compile is complete it is 
    //logged once. TODO: Find a better solution...
    let done = false;
    bundler.on('display-ready', 'done', (stats: Stats) => {
      if (done) return;
      const time = stats.compilation.endTime - stats.compilation.startTime;
      console.log(`compiled in ${time}ms`);
      done = true;
    });

    //add routes as bundler entries
    for(const route of react.routes) {
      //determine the name (same as ReactPlugin.render)
      const name = react.entryFileName(route.path);
      //determine the virtual entry
      const entry = path.join(cwd, `.build/virtual/${name}.js`);
      bundler.addEntry(name, [ 
        'webpack-hot-middleware/client?path=/__incept', 
        entry 
      ]);
      vfs.mkdirSync(path.dirname(entry), { recursive: true });
      vfs.writeFileSync(entry, react.entry(route.path));
    }
  
    //build a webpack compiler
    const compiler = bundler.compiler;
  
    const dev = webpackDevMiddleware(compiler, {
      serverSideRender: true,
      publicPath: buildURL,
      writeToDisk: write
    })
    
    const hot = webpackHotMiddleware(compiler, {
      log: false,
      path: '/__incept',
      heartbeat: 10 * 1000
    })
  
    return { compiler, dev, hot }
  }
}
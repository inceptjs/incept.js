import path from 'path';
import { HotModuleReplacementPlugin } from 'webpack';
import LoadablePlugin from '@loadable/webpack-plugin';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import Application from '../types/Application';

export default function webpackPlugin(app: Application) {
  const { 
    cwd, 
    withReact: react, 
    withWebpack: bundler, 
    withVirtualFS: vfs 
  } = app
  const buildFolder = path.join(cwd, '.build');

  const chunkNamer = (fileinfo: Record<string, any>) => {
    const hash = fileinfo.chunk.hash;
    const [ name, extension ] = fileinfo.chunk.id.split('_').slice(-2);
    return `chunks/${name}.${hash}.${extension}`;
  }
  
  //withh webpack bundler
  bundler
    // set the output location
    .setOutput(buildFolder, '[name].js', chunkNamer)
    //add loadable (for file chunking)
    .addPlugin(new LoadablePlugin({ 
      filename: 'stats.json',
      writeToDisk: { filename: buildFolder }
    }))
    //add css module
    .addPlugin(new MiniCssExtractPlugin)
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
    Object.keys(require.cache)
      .filter(key => key.includes(cwd) 
        //clearing node_modules and any of them using instanceof will
        //fail, so we should not clear node_modules once it's used
        && !key.includes(path.join(cwd, 'node_modules')
      ))
      .forEach(key => delete require.cache[key])
  });

  vfs.mkdirSync(path.join(cwd, 'scripts'), { recursive: true });
  
  //add routes as bundler entries
  for(const route of react.routes) {
    //determine the name (same as ReactPlugin.render)
    const name = path.join('scripts', react.entryFileName(route.path));
    //determine the virtual entry
    const entry = path.join(cwd, `${name}.js`);
    bundler.addEntry(name, [ 'webpack-hot-middleware/client', entry ]);
    vfs.writeFileSync(entry, react.entry(route.path));
  }

  //build a webpack compiler
  const compiler = bundler.compiler

  const dev = webpackDevMiddleware(compiler, {
    serverSideRender: true,
    publicPath: '/.build',
    writeToDisk: true
  })
  
  //@ts-ignore
  const hot = webpackHotMiddleware(compiler, {
    log: false,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  })

  return { compiler, dev, hot }
};
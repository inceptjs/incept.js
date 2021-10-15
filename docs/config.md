# Configuration and Options

> WARNINNG: We cannot support most issues created where the cause was 
changing the `webpack` or `babel` configuration. In the future, we will 
harden up this feature in order for it to be supported. For now it's 
free for all.

## General Options

The default configuration for the application is exactly the following.

```js
{
  "cwd": process.cwd(),
  "buildPath": ".build",
  "buildURL": "/.build",
  "webpack": {
    "server": {},
    "static": {}
  }
}
```

To access the configuration of an app, the following can be done inside 
of a plugin.

```js
export default function(app) {
  const config = app.config
  //only soft setting is allowed 
  config.cwd = '/some/new/path'
  config.buildPath = '/some/new/path'
  config.buildURL = '/some/new/path'
}
```

## Configuring Babel

Incept uses `@babel/register` to transpile files. You can also 
*kind of* customize `babel` through `app.withBabel.register()`. 
The default configuration for `babel` is exactly the following.

```js
{
  ignore: [ /node_modules/ ],
  extensions: [ '.js', '.jsx' ],
  presets: [
    '@babel/preset-env', 
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    'react-require'
  ]
}
```

To customize `babel`, the following can be done inside of a plugin. 

```js
export default function(app) {
  app.withBabel.register({
    ignore: [ /node_modules/ ],
    extensions: [ '.js', '.jsx' ],
    presets: [
      '@babel/preset-env', 
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      'react-require'
    ]
  })
}
```

> WARNING: This could cause errors if not configured correctly.

What `app.withBabel.register()` will do is re-register babel for plugins 
that use `require()` after it has been registered again. This does not 
merge with the current configuration, but rather hard resets it. Also 
in this case it's important that you consider placing plugins that use 
`app.withBabel.register()` first in your plugin tree in order for other 
plugins to see the benefits. It is also important for third party plugin 
creators to note this for their consumers.

## Configuring Webpack

The default configuration for `webpack` varies between `server` and 
`static` builds, but is exactly the following.

```js
// Server Config
import path from 'path';
import crypto from 'crypto';
import nodeExternals from 'webpack-node-externals';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VirtualFSWebpackPlugin } from '@inceptjs/virtualfs';
import { Application } from '../../types/Application';

function salt(id: string): string {
  return crypto.createHash('md5').update(id).digest('hex');
}

export default (app: Application) => {
  return {
    target: 'node',
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.css'],
      plugins: [ new VirtualFSWebpackPlugin ]
    },
    externals: [
      nodeExternals({
        additionalModuleDirs: app.withVirtualFS.modulePaths(app.cwd)
      })
    ],
    externalsPresets: { node: true },
    output: { 
      path: path.join(app.buildPath, 'server'), 
      filename: 'entries/[name].js', 
      libraryTarget: 'commonjs2',
      //this is so the chunks can be identified easier
      chunkFilename: (fileinfo: Record<string, any>) => {
        const name = fileinfo.chunk.id.replace(/_js$/, '').split('_').pop();
        const hash = salt(fileinfo.chunk.id);
        return `chunks/${name}.${hash}.js`;
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        //filename: 'styles/[name].[contenthash].css',
        filename: (pathData: Record<string, any>) => {
          const name = pathData.chunk.id.replace(/_js$/, '').split('_').pop();
          const hash = salt(pathData.chunk.id);
          return `styles/${name}.${hash}.css`;
        },
        chunkFilename: (pathData: Record<string, any>) => {
          const name = pathData.chunk.id.replace(/_js$/, '').split('_').pop();
          const hash = salt(pathData.chunk.id);
          return `styles/${name}.${hash}.css`;
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.(jsx?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-react', [
                  '@babel/preset-env', {
                    exclude: ['transform-regenerator'],
                    corejs: false,
                    modules: 'commonjs' 
                  }
                ]],
                plugins: [
                  //adds react import where jsx is found
                  'react-require', 
                  //need to call `import()` transpile before loadable
                  '@babel/plugin-syntax-dynamic-import', 
                  //transpile `loadable()` syntax
                  '@loadable/babel-plugin'
                ]
              }
            }
          ]
        },
        {
          test: [ /\.jsx?$/, /\.tsx?$/ ],
          include: /node_modules/,
          enforce: 'pre',
          use: ['source-map-loader']
        },
        {
          test: /\.css$/i,
          use: [
            { loader: MiniCssExtractPlugin.loader }, 
            {
              loader: 'css-loader',
              options: {
                esModule: true,
                modules: { localIdentName: '[name]-[local]-[hash:base64:5]' }
              }
            }
          ]
        }
      ]
    },
    optimization: {
      moduleIds: 'named',
      chunkIds: 'named',
      splitChunks: { chunks: 'all' }
    },
    //see: https://webpack.js.org/configuration/stats/
    stats: {
      preset: 'none',
      colors: false,
      errors: true,
      errorDetails: false,
      errorStack: false,
      logging: 'warn',
      warnings: true
    }
  }
}
```

```js
// Static Config
import path from 'path';
import crypto from 'crypto';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VirtualFSWebpackPlugin } from '@inceptjs/virtualfs';
import { Application } from '../../types/Application';

function salt(id: string): string {
  return crypto.createHash('md5').update(id).digest('hex');
}

export default (app: Application) => ({
  resolve: {
    extensions: [ '.js', '.jsx', '.json', '.css' ],
    plugins: [ new VirtualFSWebpackPlugin ]
  },
  output: { 
    path: path.join(app.buildPath, 'static'), 
    filename: 'entries/[name].js', 
    publicPath: app.buildURL + path.sep,
    //this is so the chunks can be identified easier
    chunkFilename: (fileinfo: Record<string, any>) => {
      const name = fileinfo.chunk.id.replace(/_js$/, '').split('_').pop();
      const hash = salt(fileinfo.chunk.id);
      return `chunks/${name}.${hash}.js`;
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: (pathData: Record<string, any>) => {
        const name = pathData.chunk.id.replace(/_js$/, '').split('_').pop();
        const hash = salt(pathData.chunk.id);
        return `styles/${name}.${hash}.css`;
      },
      chunkFilename: (pathData: Record<string, any>) => {
        const name = pathData.chunk.id.replace(/_js$/, '').split('_').pop();
        const hash = salt(pathData.chunk.id);
        return `styles/${name}.${hash}.css`;
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', [
                '@babel/preset-env', {
                  exclude: ['transform-regenerator'],
                  useBuiltIns: 'entry',
                  corejs: 'core-js@3',
                  modules: false 
                }
              ]],
              plugins: [
                //adds react import where jsx is found
                'react-require', 
                //need to call `import()` transpile before loadable
                '@babel/plugin-syntax-dynamic-import', 
                //transpile `loadable()` syntax
                '@loadable/babel-plugin'
              ]
            }
          }
        ]
      },
      {
        test: [ /\.jsx?$/, /\.tsx?$/ ],
        include: /node_modules/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader }, 
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              modules: { localIdentName: '[name]-[local]-[hash:base64:5]' }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    moduleIds: 'named',
    chunkIds: 'named',
    splitChunks: { chunks: 'all' }
  },
  //see: https://webpack.js.org/configuration/stats/
  stats: {
    preset: 'none',
    colors: false,
    errors: true,
    errorDetails: false,
    errorStack: false,
    logging: 'warn',
    warnings: true
  }
})
```

To customize `webpack` for ether the server or static, the following 
can be done inside of a plugin. 

```js
export default function(app) {
  const wpServer = app.config.webpack.server
  const wpStatic = app.config.webpack.static
}
```

> WARNING: This could cause errors if not configured correctly.

Both `webpack` configs will be considered at the time of bundling 
and will shallow merge differences. This means if you need to tweak
the `target` option you can do so simply like this.

```js
export default function(app) {
  wpStatic.target = 'browserui'
}
```

But changing a nested object requires you to copy the initial value in
order to change what you need.

```js
export default function(app) {
  wpStatic.optimization = {
    moduleIds: 'id',
    chunkIds: 'named',
    splitChunks: { chunks: 'all' }
  }
}
```
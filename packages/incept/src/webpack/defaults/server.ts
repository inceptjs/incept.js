import path from 'path';
import crypto from 'crypto';
import nodeExternals from 'webpack-node-externals';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import VMWebpackPlugin from 'virtual_modules-webpack';
import { Application } from '../../types/Application';

function salt(id: string): string {
  return crypto.createHash('md5').update(id).digest('hex');
}

export default (app: Application) => {
  const defaults = {
    target: 'node',
    resolve: {
      extensions: [ '.js', '.jsx', '.json', '.css', '.ts', 'tsx' ],
      plugins: [ new VMWebpackPlugin ]
    },
    externals: [],
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
          test: /\.(tsx?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-react',
                  [
                    '@babel/preset-env', 
                    {
                      exclude: ['transform-regenerator'],
                      corejs: false,
                      modules: 'commonjs' 
                    }
                  ], 
                  [
                    '@babel/preset-typescript',
                    { isTSX: true, allExtensions: true }
                  ]
                ],
                plugins: [
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
  };

  defaults.externals.push(
    //@ts-ignore Argument of type 'ExternalItem' is not assignable to parameter of type 'never'.
    nodeExternals({ additionalModuleDirs: app.withVirtual.modulePaths(app.cwd) })
  );

  return defaults;
}
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Application } from '../../types/Application';

export default (app: Application) => {
  return {
    target: 'node',
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.css']
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
        const hash = fileinfo.chunk.renderedHash;
        return path.join('chunks', `${name}.${hash}.js`);
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '/styles/[name].[contenthash].css'
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
            {
              loader: MiniCssExtractPlugin.loader,
            }, 
            {
              loader: 'css-loader',
              options: {
                esModule: true,
                modules: {
                  localIdentName: '[name]-[local]',
                }
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
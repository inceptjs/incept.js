const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const dev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: dev ? 'inline-source-map' : undefined,
  entry: [
    dev && 'webpack-hot-middleware/client?path=/__incept',
    path.join(__dirname, 'src', 'client', 'index.tsx')
  ].filter(Boolean),
  output: {
    path: path.resolve(__dirname, 'build', 'static'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: [dev && ReactRefreshTypeScript()].filter(Boolean),
              }),
              transpileOnly: dev,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.css', '.tsx', '.ts', '.js', '.jsx']
  },
  plugins: [
    dev && new webpack.HotModuleReplacementPlugin(),
    dev && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'client', 'index.html')
    }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ].filter(Boolean),
  devServer: {
    hot: true,
    historyApiFallback: {
      index: '/'
    }
  }
};

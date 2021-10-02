import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.json', '.css']
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  { 'exclude': ['transform-regenerator'] }
                ], 
                '@babel/preset-react'
              ],
              plugins: [
                //adds react import where jsx is found
                'react-require',
                //updates on react component changes (for dev)
                'react-refresh/babel'
              ]
            }
          },
          'source-map-loader'
        ]
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
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
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[md5:hash:base64:7].[ext]',
              publicPath: '/.build/images',
              outputPath: 'images'
            },
          },
        ],
      }
    ]
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
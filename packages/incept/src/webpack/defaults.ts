import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.json', '.css']
  },
  stats: {
    errorDetails: true,
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
                localIdentName: '[path][name]-[local]-[md5:hash:base64:7]',
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
  }
}
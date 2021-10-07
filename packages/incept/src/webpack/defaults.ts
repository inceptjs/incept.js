import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
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
    splitChunks: {
      chunks: 'all'
    }
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
export default {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
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
              'react-require',
              '@babel/plugin-syntax-dynamic-import',
              'react-refresh/babel'
            ]
          }
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: ['source-map-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
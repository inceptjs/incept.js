export default {
  ignore: [
    /node_modules[\\/](?!@incept\/admin)/
  ],
  extensions: ['.js', '.jsx', '.svg', '.jpg', '.gif', '.png', '.jpeg'],
  presets: [
    [
      '@babel/preset-env',
      { 'exclude': ['transform-regenerator'] }
    ], 
    //transforms jsx
    '@babel/preset-react'
  ],
  plugins: [
    //import css server side
    [
      '@dr.pogodin/css-modules-transform', {
        generateScopedName: '[path][name]-[local]-[md5:hash:base64:7]'
      }
    ],
    //import images
    [
      '@openovate/babel-plugin-file-loader',
      {
        extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'],
        name: '[md5:hash:base64:7].[ext]',
        publicPath: '/.build/images'
      }
    ],
    //adds react import where jsx is found
    'react-require', 
    //allows to use import as a function
    '@loadable/babel-plugin'
  ]
}
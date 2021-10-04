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
        generateScopedName: '[name]-[local]'
      }
    ],
    //adds react import where jsx is found
    'react-require', 
    //allows to use import as a function
    '@loadable/babel-plugin'
  ]
}
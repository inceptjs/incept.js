export default {
  ignore: [
    /node_modules/
  ],
  extensions: ['.js', '.jsx', '.svg', '.jpg', '.gif', '.png', '.jpeg'],
  presets: [
    //transforms es6/7 to cjs
    '@babel/preset-env', 
    //transforms jsx
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    //adds react import where jsx is found
    'react-require', 
    //allows to use import as a function
    '@loadable/babel-plugin',
    //import css server side
    [
      '@dr.pogodin/css-modules-transform', {
        generateScopedName: '[name]-[local]'
      }
    ]
  ]
}
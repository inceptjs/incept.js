export default {
  ignore: [ /node_modules/ ],
  extensions: [ '.js', '.jsx' ],
  presets: [
    //transforms es6/7 to cjs
    '@babel/preset-env', 
    //transforms jsx
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    //adds react import where jsx is found
    'react-require'
  ]
}
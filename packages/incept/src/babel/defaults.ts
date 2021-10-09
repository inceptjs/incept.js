export default {
  ignore: [
    /node_modules/,
    /\.build\/server\/entries\/main\.js/,
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
    'react-require'
  ]
}
#!/usr/bin/env node

require('@babel/register')({
  ignore: [
    /node_modules[\\/](?!@incept\/admin)/
  ],
  presets: [
    [
      '@babel/preset-env',
      { 'exclude': ['transform-regenerator'] }
    ], 
    //transforms jsx
    '@babel/preset-react'
  ],
  plugins: [
    //adds react import where jsx is found
    'react-require', 
    //allows to use import as a function
    '@loadable/babel-plugin'
  ]
})

require('../dist/boot')
  
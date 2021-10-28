import path from 'path';

export default {
  ignore: [ /node_modules/ ],
  extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
  presets: [
    //transforms es6/7 to cjs
    '@babel/preset-env', 
    //transforms jsx
    '@babel/preset-react', 
    //transforms ts, tsx
    [
      '@babel/preset-typescript',
      { isTSX: true, allExtensions: true }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    //ignores files
    [path.join(__dirname, 'ignore'), { 
      except: [ '.js', '.jsx', '.ts', '.tsx' ] 
    }],
    //adds react import where jsx is found
    'react-require'
  ]
}
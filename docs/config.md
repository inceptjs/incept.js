# Configuration and Options

> WARNINNG: We cannot support most issues created where the cause was 
changing the `webpack` or `babel` configuration. In the future, we will 
harden up this feature in order for it to be supported. For now it's 
free for all.

## General Options

The default configuration for the application is exactly the following.

```js
{
  "cwd": process.cwd(),
  "buildPath": ".build",
  "buildURL": "/.build",
  "webpack": {
    "server": {},
    "static": {}
  }
}
```

To access the configuration of an app, the following can be done inside 
of a plugin.

```js
export default function(app) {
  const config = app.config
  //only soft setting is allowed 
  config.cwd = '/some/new/path'
  config.buildPath = '/some/new/path'
  config.buildURL = '/some/new/path'
}
```

## Configuring Babel

Incept uses `@babel/register` to transpile files. You can also 
*kind of* customize `babel` through `app.withBabel.register()`. 
The default configuration for `babel` is exactly the following.

```js
{
  ignore: [ /node_modules/ ],
  extensions: [ '.js', '.jsx' ],
  presets: [
    '@babel/preset-env', 
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    'react-require'
  ]
}
```

To customize `babel`, the following can be done inside of a plugin. 

```js
export default function(app) {
  app.withBabel.register({
    ignore: [ /node_modules/ ],
    extensions: [ '.js', '.jsx' ],
    presets: [
      '@babel/preset-env', 
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      'react-require'
    ]
  })
}
```

> WARNING: This could cause errors if not configured correctly.

What `app.withBabel.register()` will do is re-register babel for plugins 
that use `require()` after it has been registered again. This does not 
merge with the current configuration, but rather hard resets it. Also 
in this case it's important that you consider placing plugins that use 
`app.withBabel.register()` first in your plugin tree in order for other 
plugins to see the benefits. It is also important for third party plugin 
creators to note this for their consumers.

## Configuring Webpack

Incept uses Webpack to bundle static files and server files specifically 
for server side rendering. The easiest way to configure these is to use 
the following.

```js
const compiler = app.withWebpack.withStaticCompiler
const serverCompiler = app.withWebpack.withServerCompiler
```

Both of these compilers are different instances of the same class and 
share the following properties and methods examples.

```js
compiler.name = 'Static'
compiler.mode = 'production'
compiler.target = 'node'

compiler.addEntry('main', `${__dirname}/entry.js`)
compiler.addPlugin(new CustomPlugin)
compiler.addRule({
  test: [ /\.jsx?$/, /\.tsx?$/ ],
  include: /node_modules/,
  enforce: 'pre',
  use: ['source-map-loader']
})
compiler.pushRule(/\.jsx?$/, 'source-map-loader')
compiler.on('custom plugin', 'afterCompile', callback)
```

The above are defined for basic cases however you can still access and 
manipulate the full config using `compiler.config`.

> WARNING: This could cause errors if not configured correctly.

## Resources

 - [Babel](https://babeljs.io/)
 - [Webpack](https://webpack.js.org/)
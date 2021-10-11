# Incept VirtualFS

VirtualFS (VFS) lets you read and require files in a way that node 
treats them as if they were physically presented in the file system.
Designed to inherently work with Babel and Webpack with no extra 
tooling.

## Install

```bash
# with NPM
$ npm i --save @inceptjs/virtualfs

# with Yarn
$ yarn add @inceptjs/virtualfs
```

## Basic Usage

First patch Node's file system and require to consider our virtual one 
like the following.

```js
const vfs = require('@inceptjs/virtualfs')
vfs.patchFS()
```

> This will have no conflict with `@babel/register`

Next, you can write to the VFS like the following. 

```js
vfs.mkdirSync('/path/to/assets', { recursive: true })
vfs.writeFileSync('/path/to/assets/foo.js', 'module.exports = { foo: "foo" }')

//... somewhere else
const foo = require('/path/to/assets/foo.js')
console.log(foo.foo) //--> "foo"
```

While it looks a file was simply written in the file system, it won't 
actually exist upon manual inspection. What was created is a virtual 
file. You can also read a virtual file like the following.

```js
fs.readFileSync('/path/to/assets/foo.js', 'utf8') //--> module.exports = { foo: "foo" }
```

## Virtual Node Modules

This also works for defining virtual files in `node_modules`.

```js
vfs.writeFileSync('/my/project/node_modules/foo.js', 'module.exports = { foo: "foo" }')

//... somewhere in /my/project
const foo = require('foo')
console.log(foo.foo) //--> "foo"
```

## Virtual File Routing

Just call `route()` to make virtual file routes. Once they are 
registered, they can be immediately used.

```js
vfs.route('/my/post/:id/info.json', (filename, res, vfs) => {
  //extract the params from the filename
  const params = vfs.routeParams(filename, '/my/post/:id/info.json')
  //set the response body as a string or object
  res.body = { id: params.params.id }
})

fs.readFileSync('/my/post/1/info.json').toString() //--> { id: 1 }
require('/my/post/1/info.json').id //--> 1
```

When a route is requested by `readFileSync()`, it gets computed and 
written to the VFS in a lazy way. 

### Transforming files

Virtual modules has a basic transformer that sits on top that you can 
use optionally. 

```js
vfs.addRule(/\.(js)$/, (file, code) => {
  return code + ';console.log("transformed");'
})
```

> If you are using babel to transform files, you can still use babel 
without interupting your work flow. 

You can optionally replace `@babel/register` with virtual modules like 
the following snippet.

```js
const babel = require('@babel/core')
vfs.addRule(/\.(js)$/, (file, code) => {
  return babel.transform(code, {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ]
  }).code
})
```

### Stop/Start

VFS works directly with Node's `Module` and `require.cache`.
To cover cases to revert to the original Node methods you can start and 
stop virtual modules like this.

```js
vfs.revertPatch()

vm.patchFS()
```

## Wepack Plugin

Using routes on VFS could be problematic with `webpack` because it 
uses `enhanced-resolve` and that uses `fs.stat()` on folders to 
determine if a file exists. 

Since routes like `/my/post/:id/info.json` have an unlimited 
permutation, it would not be possible for VFS to populate stats in a 
directory. It could still work however, if all the possible 
permutations were pre-written to VFS.

Therefore we created a webpack plugin you can insert as a plugin 
resolver in your `webpack` config.

```js
const { VirtualFSWebpackPlugin } = require('@inceptjs/virtualfs')

module.exports = {
  resolve: {
    ...
    plugins: [ new VirtualFSWebpackPlugin ]
  },
  ...
}
```

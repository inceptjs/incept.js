# Incept VirtualFS

VirtualFS (VFS) lets you read and require files in a way that node 
treats them as if they were physically presented in the file system.

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
require(test).id //--> 1
```

## Virtual Node Modules

This also works for defining virtual files in `node_modules`.

```js
vfs.writeFileSync('/my/project/node_modules/foo.js', 'module.exports = { foo: "foo" }')

//... somewhere in /my/project
const foo = require('foo')
console.log(foo.foo) //--> "foo"
```

### Stop/Start

VFS works directly with Node's `Module` and `require.cache`.
To cover cases to revert to the original Node methods you can start and 
stop virtual modules like this.

```js
vfs.revertPatch()

vm.patchFS()
```

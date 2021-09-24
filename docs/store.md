# Store

A store contains methods to easily manage data.

 - [Basics](#basic)
 - [Advanced](#advanced)
 - [API (4)](#api)

<a name="basic"></a>
## Basics

Implementing a store looks like the following

```js
const { Store } = require('@inceptjs/types')

const store = new Store
```

You can set an object to the store on instantiating like the following.

```js
const store = new Store({
  name: 'John Doe',
  tags: [
    'funny',
    'witty'
  ],
  contact: {
    email: 'john@doe.com',
    phone: '555-2424'
  }
})
```

### GET

Once a store is instantiated to can read from the store using `get()`.

```js
store.get('name') //--> 'John Doe'
store.get('tags', 1) //--> 'witty'
store.get('contact', 'email') //--> 'john@doe.com'
store.get() //--> [the entire object]
```

### SET

You can also add to the store like the following.

```js
store.set('a', 'long', 'path', 'to', 'any kind of value')
```

This would create a series of objects in the store that would look like 
the following.

```json
{ "a": { "long": { "path": { "to": "any kind of value" } } } }
```

The method set would override this structure if the following was used
right after.

```js
store.set('a', 'long', 'path', [ 1, 2, 3 ])
```

Which would produce the following results.

```json
{ "a": { "long": { "path": [ 1, 2, 3 ] } } }
```

Arrays can also be auto created like objects.

```js
store.set('tags', 0, 'funny')
store.set('tags', 1, 'witty')
store.set('tags', null, 'smart') //auto push
//but once you add a non standard key it will be an object
store.set('tags', '3', 'quirky')
```

### HAS

You can test for the existance of a key using the `has()` method.

```js
store.has('a', 'long', 'path') //--> true
```

### REMOVE

You can remove data like the following and would effectively remove 
all of its contents from the store.

```js
store.remove('a', 'long', 'path')
```

<a name="advanced"></a>
## Advanced

### Query

You can set a store using a string query.

```js
store.withQuery.set('name=John Doe&tags[0]=funny&contact[phone]=555-2424')
```

### Pathing

You can also use paths to manipulate the store.

```js
store.withPath.set('a.long.path.to', 'any kind of value')
store.withPath.has('a.long.path.to') //--> true
store.withPath.get('a.long.path.to') //--> 'any kind of value'
store.withPath.remove('a.long.path.to')
```

By default the pathing separator is `.`, but you can change that like 
the following.

```js
store.withPath.set('a,long,path,to', 'any kind of value', ',')
```

### Args

You can set a store using arguments from the command line.

```js
store.withArgs.set('--name John+Doe -vfs --phone=555-2424 -e john@doe.com')
```

<a name="api"></a>
## API

 `get` - Returns the value of a given path

```js
store.get(...paths)
```

----

 `has` - Returns true if the paths exist in the store

```js
store.has(...paths)
```

----

 `remove` - Removes all contents found at the end of the given paths

```js
store.has(...paths)
```

----

 `set` - Sets a value in the store

```js
store.has(...paths, value)
```
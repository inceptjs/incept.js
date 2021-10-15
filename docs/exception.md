# Exception

An exception extends the native `Error` class and is used to 
expressively test and report errors during runtime.

 - [Basics](#basic)
 - [Advanced](#advanced)
 - [API (3)](#api)

<a name="basic"></a>
## Basics

A typical exception semantically looks like the following.

```js
const { Exception } = require('@inceptjs/types')

throw Exception.for('Not writing any code...')
```

In the example above you don't need to call `new` when throwing an 
error.

<a name="advanced"></a>
## Advanced

### Error Codes

You can chain an error like the following example.

```js
throw Exception.for('Not Found').withCode(404)
```

### Dynamic Messages

A dynamic message can be natively thrown like the following.

```js
const id = 1
const object = 'user'
throw Exception.for(`Missing ${object} id ${id}`) 
//--> Missing user id 1
```

You can also express a dynamic message like the following.

```js
throw Exception.for('Missing %s id %s', object, id) 
```

### Object Errors

For reporting errors objects you can do something similar as the 
following.

```js
throw Exception.forErrorsFound({
  id: 'missing',
  name: 'required'
})
```

In terminal, this would look similar to the following

```bash
Exception: Invalid Parameters
    at ...
    at ... {
  errors: {
    "id": "missing",
    "name": "required"
  },
  code: 500
}
```

### Function Requirements

You can use the `require()` method to validate variables.

```js
function doSomething(x) {
  Exception.require(typeof x === 'string', 'Argument 1 expected string.')
}
```

The `require()` method in the example above takes in two arguments. The
first one is any condition that will evaluate to a boolean *(softly)*.
The second is a message. Like `for()`, the message can be dynamic like
the following.

```js
Exception.require(typeof x === 'string', 'Argument %s expected string.', 1)
```

### Exception Types

It is recommended to create many exception types in your project to 
help pinpoint errors faster because when an error is thrown the class 
name will appear in the display. To create an exception type you simply
need to extend this class like the following.

```js
class ServerException extends Exception {}
```

Doing it this way an error in the console would look similar to the 
following.

```bash
ServerException: Argument 1 expected valid path
    at ...
    at ... {
  errors: {},
  code: 500
}
```

From here, your project should throw exceptions from `ServerException`,
rather than `Exception`.

<a name="api"></a>
## API

 `for` - Expression that returns an Exception to be thrown

```js
throw Exception.for('Missing %s id %s', object, id) 
```

----

 `forErrorsFound` - Returns an Exception with detailed errors

```js
throw Exception.forErrorsFound({
  id: 'missing',
  name: 'required'
})
```

----

 `require` - Throws an error if the condition is falsy

```js
Exception.require(typeof x === 'string', 'Argument 1 expected string.')
```

## Concepts

 - [Types](./types.md)
 - [TaskQueue](./taskqueue.md)
 - [EventEmitter](./events.md)
 - [Routing](./routing.md)
 - [Store](./store.md)
 - [Exceptions](./exception.md)
# Events

 - [Basics](#basic)
 - [Advanced](#advanced)
 - [API (5)](#api)

<a name="basic"></a>
## Basics

A typical listen semantically looks like the following.

```js
const { EventEmitter } = require('@inceptjs/types')
const emitter = new EventEmitter

emitter.on('Some Event', function(...args) {
  //Do something here
})
```

In the example above there are two main arguments. The first one 
expressed as `'Some Event'` is called the event. The second argument 
expressed as a function is called a handler. To fire off `'Some Event'` 
in the example above, we can use the follow example below.

```js
emitter.emit('Some Event', ...args)
```

As you noticed with `emit()` you can pass an N amount of arguments to 
the event handler. 

### `async`

Emitting events happens asyncronously. If you need to wait for the 
results of an `emit()`, you can do so like the following

```js
emitter.on('Some Event', async function(...args) {
  //Do something here
})

await emitter.emit('Some Event', ...args)
//wait for it...
```

The simplicity of the event interface is by design, though in most 
cases you may not have a need for the following features in the next 
section, it describes specific needs you can also use at your 
convenience.

<a name="advanced"></a>
## Advanced

### Priorites

One of the jewels of this EventEmitter is the ability to prioritize 
callbacks.

```js
emitter.on('Some Event', function DoSomething1(...args) {
  //Do something here
})

emitter.on('Some Event', function DoSomething2(...args) {
  //Do something here
}, 10)
```

In the example above the `DoSomething2()` will emit first because it 
was given a higher priority `10` than `DoSomething1()` which defaults 
to `0`. There are no range limits of priorities and can accept negative
numbers.

### Meta Data

To get the variable we call on the event handler using
`emitter.event` which returns meta data about the current event. The 
meta data is a hash that contains information like `'event'`, 
`'pattern'`, `'callback'` you can use to help process an event.

```info
There isn't an easy way to access meta data inside the event handler 
because you would only need to know about meta data in advance cases.
```

Meta data is short lived. It updates every time there is a new event. 
At the end of an event trigger, the meta data will hold one of three 
statuses.

 - **STATUSES.OK** (200) - All event listeners were triggered
 - **STATUSES.ABORT** (308) - The last event triggered returned
   `false`
 - **STATUSES.NOT_FOUND** (404) - No event listeners were triggered
   because none were defined

### Regular Expressions

It is also possible to listen to events via regular expressions like 
the following example below.

###### Listening via Regular Expressions

```js
emitter.on(/Some\s(.+)\sEvent/g, function(...args) {
  //output the first variable
  console.log(emitter.event.parameters[0]) //--> Random
}).emit('Some Random Event')
```

### Inspect

A common pitfall is troubleshooting events when they error. In 
consideration, an `inspect` method is given that reflects the callback
stack if an event were to emit.

```js
emitter.on('Some Event', function DoSomething1(...args) {
  //Do something here
})

emitter.on('Some Event', function DoSomething2(...args) {
  //Do something here
}, 10)

console.log(emitter.inspect('Some Event'))
// [
//   {
//     "callback": f DoSomething2(),
//     "priority": 10 
//   },
//   {
//     "callback": f DoSomething0(),
//     "priority": 0 
//   }
// ]
```

You can use `Array.map()` to get an array of function names like the 
following.

```js
emitter.inspect('Some Event').map(event => event.callback.name || 'anonymous')
```

<a name="api"></a>
## API

 `on` - Attaches an instance to be notified when an event has been triggered

```js
emitter.on('Some Event', function DoSomething(...args) {
  //Do something here
}, 10)
```

----

 `emit` - Notify all observers of that a specific event has happened

```js
emitter.emit('Some Event', ...args)
```

----

 `inspect` - Returns an event's call stack

```js
emitter.inspect('Some Event') //--> [{ callback, priority }, ...]
```

----

 `unbind` - Removes an observer from an event or all observers from an event

```js
//removes a specific observer
emitter.unbind('Some Event', DoSomething)
//removes all observers
emitter.unbind('Some Event')
```

----

 `use` - Adds the events of one emitter to another

```js
const emitter2 = new EventEmitter

emitter2.on('Event Defined Elsewhere', function DoSomethingElsewhere() {
  //Do something elsewhere
})

emitter.use(emitter2)
```


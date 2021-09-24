# Task Queue

 - [Basics](#basic)
 - [Advanced](#advanced)
 - [API (4)](#api)

<a name="basic"></a>
## Basics

A typical task queue semantically looks like the following.

```js
const { TaskQueue } = require('@inceptjs/types')
const queue = new TaskQueue

queue.push(x => {
  //perform a task
})
```

In the example above there is one main argument expressed as a 
function is called a handler. To run the queue from the example above, 
we can use the follow example below.

```js
queue.run(...args)
```

As you noticed with `run()` you can pass an N amount of arguments to 
the event handler. 

The simplicity of the task queue is by design, though in most 
cases you may not have a need for the following features in the next 
section, it describes specific needs you can also use at your 
convenience.

<a name="advanced"></a>
## Advanced

### Ways to queue

Besides pushing to the queue you can `shift()` like the following

```js
queue.shift(x => {
  //perform a task
})
```

Additionally you can `add()` to the queue by defining a priority like 
the following.

```js
queue.add(x => {
  //perform a task
}, 10)
```

When you `push()` to the queue it will automatically give a priority of
`lowest priority - 1` and when you `shift()` to a queue it will 
automatically give a priority of `highest priority + 1`. To inspect 
the queue you can simply do the following.

```js
console.log(queue.tasks)
```

### `async`

Running the queue happens asyncronously. If you need to wait for the 
results of a `run()`, you can do so like the following.

```js
queue.push(async (x) => {
  //perform a task
})

await queue.run(...args)
```

### Ways to run

Besides calling `run()` you can simply just await queue like the 
following.

```js
await queue.push(async (x) => {
  //perform a task
})

//or 

await queue
```

```info
When you `await` the queue it will call `run()` with no arguments.
```

<a name="api"></a>
## API

 `add` - Adds a task somewhere in the queue

```js
queue.add(x => {
  //perform a task
}, 10)
```

----

 `push` - Pushes a task to the bottom of the queue

```js
queue.push(x => {
  //perform a task
})
```

----

 `shift` - Shifts a task to the top of the queue

```js
queue.shift(x => {
  //perform a task
})
```

----

 `run` - Calls all the tasks in the queue

```js
queue.run(...args)
```


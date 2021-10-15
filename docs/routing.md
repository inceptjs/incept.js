# Routing

The basic route listener looks like the following.

```js
import { Router } from 'inceptjs'

const router = new Router

router.get('/', (req, res) => {
  // ... do something ...
})

export router
```

Which is very similar to how the basic [event listener](./events.md) 
looks like in retrospec. The two main differences here are instead of 
using `.on()`, we are using something called `get()` and there are 
two predefined arguments passed called `req` and a `res`. First 
let’s take a look at what `get()` is exactly.

## Request Methods

There are four common request methods a website deals with and they 
are the following.

Common Request Methods
 - GET
 - POST
 - PUT
 - DELETE

When a page loads for example, that method is called `GET` and when you 
submit a form the method is usually a `POST`. So what we need to take 
into consideration are a request method and from what URL path the user 
is requesting that from. The following shows another way we can consider 
requests which are called routing methods.

```js
router.route('/some/path/').get((req, res) => {
  // ... do something ...
});
```

This method has three arguments which combines thoughts of an event 
and thoughts of a website request into one. The single argument used 
in `route()` is the the request path. To simplify, this is the 
folder request a user makes for example, if a user loaded 
http://google.com/about, /about would be the path name.

Next `route()` returns a series of possible HTTP methods which are 
listed below.

 - `all()` - Any HTTP method
 - `connect()` - HTTP CONNECT
 - `get()` - HTTP GET
 - `head()` - HTTP HEAD
 - `delete()` - HTTP DELETE
 - `options()` - HTTP OPTIONS
 - `trace()` - HTTP TRACE

All of the mentioned methods require a callback argument, though you 
could pass multiple callbacks like so.

```js
router.route('/some/path/').get((req, res) => {
  // ... do something ...
}, (req, res) => {
  // ... do something else ...
}, (req, res) => {
  // ... do something more ...
});
```

Additionally routes can be prioritized like [events](./events.md). 
Consider two conflicting routes like the following.

```js
router.route('/some/path/').get((req, res) => {
  // ... do something ...
}, 100);

router.route('/some/path/').get((req, res) => {
  // ... do something else ...
}, 1000);
```

The route handler with the highest priority like in the above case of 
`1000` will be called first.

When it comes to request methods, mentioned before, the routing object 
has predefined methods that acknowledge this commonality. The following 
methods are provided for your convenience.

```js
router.all('/', (req, res) => {})
router.connect('/', (req, res) => {})
router.get('/', (req, res) => {})
router.head('/', (req, res) => {})
router.delete('/', (req, res) => {})
router.options('/', (req, res) => {})
router.trace('/', (req, res) => {})
```

## Request Paths

Request paths can be expressed as a string literal like `/about/us` or 
as a dynamic pattern.

### Star Variables

Paths can be expressed with wildcards by adding a `*` as in the 
following.

```js
router.get('/some/*/stuff', (req, res) => {
  const arg = router.params(req, 'get', '/some/*/stuff').args[0]
})
```

When the request path is `/some/good/stuff`, the above handler will be 
called, like wise with `/some/bad/stuff`, however `/some/stuff` will not 
fire the above handler.

To take on an N amount of wildcards you can add `**` as in the following.

```js
router.get('/some/**/stuff', (req, res) => {
  const args = router.params(req, 'get', '/some/**/stuff').args
})
```

When the request path is `/some/good/stuff`, the above handler will be 
called, like wise with `/some/even/better/stuff`, however `/some/stuff` 
will not fire the above handler. If you wanted a route handler to 
handle all requests that deal with all `/article` requests for example, 
you can do so like this.

```js
router.all('/article/**', (req, res) => {})
```

Or like this.

```js
router.all('**', (req, res) => {})
```

> WARNING: This will call the handler on every request. You may not 
want that.

### Binding Parameters

You can also use binding in routing if you care about the name of the 
dynamic paths being passed. The following shows how this can be done.

```js
router.get('/some/:name/stuff', (req, res) => {
  const name = router.params(req, 'get', '/some/:name/stuff').params.name
})
```

## Request and Response

`req` *(short for request)* and `res` *(short for response)* are 
objects that are usually passed to the callback. The request methods 
are generally the same as response methods and both have the same specs 
as [store](./store).

### Response Specs

```js
res.body - read/write
res.ctx - read/write
res.code - readonly
res.headers - readonly
res.resource - readonly
res.status - readonly
res.status(number, string)
res.write(any)
```

Some custom specs include the following.

 - `res.ctx` - The context; usually a `Router` or `Application`
 - `res.resource` - The original response; usually `http.ServerResponse`

### Request Specs

```js
req.host - readonly
req.methods - readonly
req.params - read/write
req.pathname - readonly
req.port - readonly
req.protocols - readonly
req.body - read/write
req.ctx - read/write
req.code - readonly
req.headers - readonly
req.resource - readonly
req.status - readonly
req.status(number, string)
req.write(any)
```

Some custom specs include the following.

 - `res.ctx` - The context; usually a `Router` or `Application`
 - `res.resource` - The original response; usually `http.IncomingMessage`

## Concepts

 - [Types](./types.md)
 - [TaskQueue](./taskqueue.md)
 - [EventEmitter](./events.md)
 - [Routing](./routing.md)
 - [Store](./store.md)
 - [Exceptions](./exception.md)
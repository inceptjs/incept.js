# Types

Types are the primitives of the Incept project. Each type can be used 
outside of this project and begin from being generically designed to 
specifically designed.

## Inheritence Tree

Incept is carefully designed starting from abstract concepts to 
practical use. The following describes each class type and how they
relate to each other through class inheritence.

```
  |- TaskQueue
  |    |- EventEmitter
  |         |- Router
  |             |- HTTPRouter
  |                  |- Application
  |- Store
  |    |- Response
  |         |- Request
  |         |    |- HTTPRequest
  |         |- HTTPResponse
  |- Exception
  |- Reflection
  |- Statuses
  |- Route
  |- PluginLoader
```

## Concepts

 - [TaskQueue](./taskqueue.md)
 - [EventEmitter](./events.md)
 - [Routing](./routing.md)
 - [Store](./store.md)
 - [Exceptions](./exception.md)
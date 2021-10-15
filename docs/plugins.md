# How Plugins Work

Incept is designed to be extended using a plugin architecture in order 
to keep its core clean. It is recommended that your project is 
structured around making plugins and using plugins whether if you plan
to publish it or use it privately.

Incept allows plugins to contribute functionality to the core in the 
following ways.

 - **Events** - Can listen to or emit events
 - **Server Routes** - Can add, prioritize or route to other routes
 - **React Routes** - Can add or override routes
 - **React Layouts** - Can add or override layouts
 - **React `<App />`** - Can override `<App />`
 - **Plugin Registry** - Can register new methods for other plugins to use

> It's important to understand that you can define your folder 
structure how ever you like. Incept just cares about where to start 
looking for files.

## How to Make a Plugin

For participation purposes however, create the given folder structure 
and we will start populating it reversely.

```
[Project]
  |- plugin/
  |   |- api/
  |   |- static/
  |- public/
  |- package.json
```

The folder structure above implies that we will be creaing two plugins
`api` which will house API calls and `static` which will house react 
components.

### Example API Plugin

Inside the `./plugin/api` folder add the following files.

```js
// FILE: ./plugin/api/router.js
import { Router } from 'inceptjs'

const router = new Router

router.get('/api/rest', (req, res) => {
  res.body = { error: false }
})

export default router
```

```js
// FILE: ./plugin/api/events.js
import { EventEmitter } from 'inceptjs'

const emitter = new EventEmitter

emitter.on('dispatch', (req, res) => {
  console.log('All systems are a go!')
})

export default emitter
```

```json
# FILE: ./plugin/api/plugin.json
[ "./router", "./events" ]
```

Then in `./package.json` in your project root folder add the following
`incept` key.

```json
{
  ...
  "incept": [ "./plugin/api" ],
  ...
}
```

You can now run visit http://localhost:3000/api/rest to view what just 
happened. 

## Plugin Tree

There are three ways to tell Incept about your plugin.

 1. Create an `index.js` that exports an event, route or function
 2. Create a `./plugin/api/plugin.json`
 3. Create a `./plugin/api/packages.json`

The `./plugin/api/index.js` would look like the following.

```js
import router from './router'
import events from './events'
export default function (app) {
  app.use(router).use(events)
}
```

The `./plugin/api/plugin.json` would look like the following.

```json
[ "./router", "./events" ]
```

The `./plugin/api/packages.json` would look like the following.

```json
{
  ...
  "incept": [ "./router", "./events" ],
  ...
}
```

All three ways are aliases of each other. With that said, it is also 
possible that plugins include files as well as other plugins from 
different sources.

### Example Static Plugin

Inside the `./plugin/static` folder add the following files.

```js
// File: ./plugin/static/pages/Home.js
import { Link } from 'inceptjs/components'
export default function Home() {
  return (
    <div>
      <h1>Welcome to Incept.js</h1>
      <Link to="/about">About</Link>
    </div>
  )
}
```

```js
// File: ./plugin/static/pages/About.js
import { Link } from 'inceptjs/components'
export default function About() {
  return (
    <div>
      <h1>About</h1>
      <Link to="/">Home</Link>
    </div>
  )
}
```

```js
// FILE: ./plugin/static/index.js
import path from 'path'

export default (app) => {
  //make a public
  app.public(path.resolve(__dirname, '../../public'), '/')
  //react routes
  app.withReact.route('/', `${__dirname}/pages/Home`)
  app.withReact.route('/about', `${__dirname}/pages/About`)
}
```

You will notice that `./plugin/static/index.js` provides ways to 
route a `react` component using paths. Unfortunately this is the 
only way to tell `webpack` what files to bundle.

Finally in `./package.json` in your project root folder add the following
`incept` key.

```json
{
  ...
  "incept": [ "./plugin/api", "./plugin/static" ],
  ...
}
```

You can now run visit http://localhost:3000/ to view what just 
happened. 

## NPM Plugins

You can include plugins developed by the community through `npm` like 
this where `@inceptjs/admin` is an example third party plugin and 
assuming you did `npm i @inceptjs/admin`.

```json
# FILE: ./package.json
{
  ...
  "incept": [ "./plugin/api", "./plugin/static", "@inceptjs/admin" ],
  ...
}
```

## Read More

 - [Configuration and Options](./config.md)
 - [Installing UI Libraries](./uilib.md)
 - [React App and Layouts](./layouts.md)
 - [Writing My Own Bash Commands](./terminal.md)
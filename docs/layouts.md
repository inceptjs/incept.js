# React Document, App and Layouts

When working with `react` apps it is common to want to eventually 
manipulate the `<App />` container and HTML Document. Additionally
amongst [Jamstack](https://jamstack.org/) platforms developers 
eventually want to use different layouts for different sections of 
their app.

Developers in Incept can customize `react` components at any stage. The 
order of rendering looks like the following.

```
  |- HTML
      |- App
          |- Layouts   
```

The purposes of providing these layers to developers are the following.

 - **HTML document** - Ability to add links, styles, additional scripts, SEO or analytics tags. 
 - **`<App />`** - Ability to wrap providers for cache, store or theming to affect globally. 
 - **React Layouts** - Ability to use a set of providers in particular sections.

## React Document

The default `Document` looks like the following.

```js
export default function Document(props) {
  const App = props.App

  return (
    <html {...props.htmlProps}>
      <head>
        {props.title}
        {props.meta}
        {props.links}
        {props.styles}
      </head>
      <body {...props.bodyProps}>
        <App />
        {props.scripts}
      </body>
    </html>
  )
}
```

You can change default document inside of a plugin like the following. 

```js
import Document from './Document'

export default function(app) {
  app.withReact.document = Document
}
```

> NOTE: Documents are used globally and shared across all pages. 

In some cases you may want to change elements in the head for example 
changing the `<head><title>` or adding SEO. This can be done with the 
use of the `<Head>` component.

```js
import { Head } from 'inceptjs/components'
<Head>
  <title>About</title>
  <meta name="description" content="About My Page" />
</Head>
```

The `<Head>` component accepts tags normally accepted in the `<head>` 
HTML tag including the following.

 - base
 - link
 - meta
 - noscript
 - script
 - style
 - title

You can also use `<Head>` to add attributes to the `<html>` and `<body>`
tags like the following.

```js
<Head bodyAttributes={{ id: 'foo' }} htmlAttributes={{ id: 'bar' }} />
```

## `<App />`

The default `<App />` looks similar to the following.

```js
import { Switch, Route } from 'inceptjs/components'

export default function App(props) {
  //build the switch cases
  const cases = props.routes.map((route, key) => {
    return (
      <Route key={key} path={route.path} exact>
        <route.layout {...props}>
          <route.view {...props} />
        </route.layout>
      </Route>
    )
  });
  return <Switch>{cases}</Switch>
}
```

> NOTE: Switch, Route, Link are from `react-router-dom`.

`props.routes` is an array with the following data structure.

```js
{
  path: string, //the route path like /post/detail/:id
  view: Component, //the component assigned to this route
  layout: Component, //the layout to use when rending this route
}
```

To use a custom `<App />` the following can be done inside of a plugin.

```js
import path from 'path'
export default function(app) {
  app.withReact.app = path.join(__dirname, 'App.js')
}
```

> WARNING: This will affect all document components. Using layouts is much 
safer.

## React Layouts

A project can use one or many layouts in Incept. The default layout 
looks similar to the following.

```js
export default function Layout({ children }) {
  return <div>{children}</div>
}
```

Layouts can be declared and used inside of a plugin like the following.

```js
import path from 'path'
export default function(app) {
  const react = app.withReact
  react.layout('default', path.join(__dirname, 'DefaultLayout.js'))
  react.layout('another', path.join(__dirname, 'AnotherLayout.js'))
  //uses the default layout
  react.route('/', path.join(__dirname, 'documents/Home'))
  //uses another layout
  react.route('/about', path.join(__dirname, 'documents/About'), 'another')
}
```

The `default` layout name is a special layout that is used by all 
routes that did not specify a layout. For example the `documents/Home`
route will use this `default` layout because none was specified compared 
to `documents/About` which will use `another` layout. Once a layout is 
inclluded with `app.withReact.layout()`, other plugins will be able to 
use it.

## Server Side Rendering

The default handler for SSR looks like the following.

```js
import ReactDOMServer from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'

function handler(req, res) {
  //let anything override this behaviour
  if (typeof res.body === 'string' 
    || typeof res.body?.pipe === 'function'
  ) {
    return;
  }
  //get route
  const route = this.withReact.match(req.pathname)
  //if no matching react routes 
  //or the layout isn't mui (remove this if you want to mui everything)
  if (!route || route.layout !== 'mui') {
    return
  }

  //get router props
  const routerProps = { location: pathname, context: {} }
  //now do the loadable chunking thing..
  //see: https://loadable-components.com/docs/server-side-rendering/
  const server = new ChunkExtractor({ 
    statsFile: path.join(this.buildPath, 'server/stats.json')
  })
  const { default: App } = server.requireEntrypoint();
  const client = new ChunkExtractor({ 
    statsFile: path.join(this.buildPath, 'static/stats.json'),
    publicPath: this.buildURL
  })

  //wrap everything needed around the app
  const Router = <StaticRouter {...routerProps}><App /></StaticRouter>
  //render the app now
  const app = ReactDOMServer.renderToString(
    client.collectChunks(Router)
  );

  //clone the document
  const document = this._document.clone
  //add links to head
  client.getLinkElements().forEach(link => {
    document.head.addChild(link)
  })
  //add styles to head
  client.getStyleElements().forEach(style => {
    document.head.addChild(style)
  })
  //add scripts to body
  client.getScriptElements().forEach(script => {
    document.body.addChild(script)
  })
  //render the document
  return document.render(app)
}
```

Overriding this handler can be done within a plugin like the following.

```js
export default async function(app) {
  const routes = app.withReact.routes
  for (const route of routes) {
    app.get(route.path, handler.bind(app), 1)
  }
}
```

> NOTE: It's important to set a priority above `0` when calling 
`app.get(route.path, handler.bind(app), 1)`, in which this case the 
priority is set to `1`.

## Concepts

 - [Types](./types.md)
 - [TaskQueue](./taskqueue.md)
 - [EventEmitter](./events.md)
 - [Routing](./routing.md)
 - [Store](./store.md)
 - [Exceptions](./exception.md)

## Resources

 - [React Router](https://reactrouter.com/)
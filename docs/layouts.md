# React Page, App and Layouts

When working with `react` apps it is common to want to eventually 
manipulate the `<App />` container and HTML Document. Additionally
amongst [Jamstack](https://jamstack.org/) platforms developers 
eventually want to use different layouts for different sections.

In Incept, developers can customize these at any stage. The order of 
rendering looks like the following.

```
  |- HTML
      |- App
          |- Layouts   
```

The purposes of providing these layers to developers are the following.

 - **HTML document** - You may want to add links, additional scripts, SEO or analytics tags. 
 - **`<App />`** - You may want to wrap meta components for cache, store or theming to affect globally. 
 - **React Layouts** - You may want a different cache, store or theming for a particular section.

## React Page

To create a new page, you can do so like the following.

```js
export default function(app) {
  const react = app.withReact
  const page = react.makePage()
  //... customize here ...
  react.page = page
}
```

The following quickly describes how pages can be customized.

```js
//changes the page title
page.title = 'My Document'
//add attribues to the <html> tag
page.props = { className: 'www-document' }
//add attribues to the <head> tag
page.head.props = { className: 'www-head' }
//add a react element to the <head> tag
page.head.addChild(<link rel="favicon" href="/favicon.ico" />)
//add attribues to the <body> tag
page.body.props = { className: 'www-body' }
//add a react element to the <body> tag
page.body.addChild(<script src="/scripts/jquery.min.js" />)
```

## `<App />`

The default app looks similar to the following.

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

To use a different `<App />` you can do so like the following.

```js
import path from 'path'
export default function(app) {
  app.withReact.app = path.join(__dirname, 'App.js')
}
```

> WARNING: This will affect all page components. Using layouts is much 
safer.

## React Layouts

You can make as many layouts as is needed in your project. The default 
layout looks similar to the following.

```js
export default function Layout({ children }) {
  return <div>{children}</div>
}
```

To declare and use layouts can be done like the following.

```js
import path from 'path'
export default function(app) {
  const react = app.withReact
  react.layout('default', path.join(__dirname, 'DefaultLayout.js'))
  react.layout('another', path.join(__dirname, 'AnotherLayout.js'))
  //uses the default layout
  react.route('/', `${__dirname}/pages/Home`)
  //uses another layout
  react.route('/about', `${__dirname}/pages/About`, 'another')
}
```

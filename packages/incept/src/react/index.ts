import path from 'path';
import React, { ComponentType } from 'react'
import ReactDOMServer from 'react-dom/server'
import { ChunkExtractor, ChunkExtractorOptions } from '@loadable/server'
import { StaticRouter, matchPath } from 'react-router';
import { Request, Response } from '@inceptjs/framework';

import Page from './Page';

type GenericObject = { [key: string]: any };

export default class WithReact {
  protected _cwd: string;
  protected _app: string;
  protected _page: Page;
  protected _appProps: GenericObject = {};
  protected _layouts: { [key: string]: string } = {};
  protected _routes: { [key: string]: StringRoute } = {};

  /**
   * Returns the routes as is path -> file
   */
  get routes(): StringRoute[] {
    const routes = [];
    for (const path in this._routes) {
      routes.push(this._routes[path]);
    }
    return routes;
  }

  /**
   * Developers can set a custom app
   */
  set app(App: string) {
    this._app = App;
  }

  /**
   * Developers can set a custom page
   */
  set page(page: Page) {
    this._page = page
  }

  /**
   * Sets up the default page and app
   */
  constructor(cwd: string) {
    this._cwd = cwd;
    this._app = `${__dirname}/Page/App`
    this._page = this.makePage()
    this._layouts.default = `${__dirname}/Page/Layout`
  }

  /**
   * sets a config file
   */
  config(name: string, file: string): WithReact {
    this._appProps[name] = file
    return this
  }

  /**
   * Generates the client entry file
   */
  entry(pathname: string): string {
    const lazy = []
    const exports = Object.keys(this._appProps)
    const imports = exports.map(
      name => `import ${name} from '${this._appProps[name]}'`
    )
    //generate routes
    const routes = this.routes
    let routesJson = JSON.stringify(routes)
    for (let i = 0; i < routes.length; i++) {
      const { path, view } = routes[i]
      //NOTE: routes should point a full path or node module
      //change from path to actual object reference
      routesJson = routesJson.replaceAll(`"${view}"`, `Route_${i + 1}`)
      
      //if active href
      if (path === pathname) {
        //active import
        imports.push(`import Route_${i + 1} from '${view}'`)
      } else {
        //lazy load
        lazy.push(
          `const Route_${i + 1} = loadable(_ => import('${view}'))`
        )
      }
    }
    exports.push('routes')
    //import layouts
    for (const name in this._layouts) {
      imports.push(
        `import Layout_${name} from '${this._layouts[name]}'`
      )
      //change from name to actual object reference
      routesJson = routesJson.replaceAll(
        `"layout":"${name}"`, 
        `"layout":Layout_${name}`
      )
    }

    return [
      `import React from 'react'`,
      `import { hydrate } from 'react-dom'`,
      `import { BrowserRouter } from 'react-router-dom'`,
      `import loadable from '@loadable/component'`,
      `import { loadableReady } from '@loadable/component'`,
      `import App from '${this._app}'`,
      ...imports,
      ...lazy,
      `const routes = ${routesJson}`,
      `const props = { ${exports.join(', ')} }`,
      'loadableReady(() => {',
      '  hydrate(',
      '    <BrowserRouter><App {...props} /></BrowserRouter>,',
      `    document.getElementById('__incept_root')`,
      '  )',
      '})'
    ].join("\n")
  }

  /**
   * generates a file name based on the router path
   */
  entryFileName(path: string): string {
    path = path.replaceAll(':', '')
    if (path.indexOf('/') === 0) {
      path = path.substr(1)
    }
    if (!path.length) {
      path = 'index'
    }
    return path
  }

  /**
   * Defines a new layout
   */
  layout(name: string, file: string): WithReact {
    this._layouts[name] = file
    return this
  }

  /**
   * Returns the route mapping to loaded component (for server)
   */
  load(): ComponentRoute[] {
    const stringRoutes = this.routes
    const componentRoutes = []
    for (const route of stringRoutes) {
      //routes should point a full path or node module
      //so we should just require it as is
      const componentRoute = {
        path: route.path,
        view: require(route.view),
        layout: require(this._layouts[route.layout])
      }

      //check for imports
      if (componentRoute.view.default) {
        componentRoute.view = componentRoute.view.default
      }
      if (componentRoute.layout.default) {
        componentRoute.layout = componentRoute.layout.default
      }

      componentRoutes.push(componentRoute)
    }
  
    return componentRoutes
  }

  /**
   * Returns a new page that developers can manipulate 
   * and send back using `ReactPlugin.page = page`
   */
  makePage(props: GenericObject = {}): Page {
    const page = new Page

    if (typeof props === 'object') {
      page.props = Object.assign({}, props)
    }
  
    return page
  }

  /**
   * Registers a route
   */
  route(
    path: string, 
    file: string, 
    layoutName: string = 'default'
  ): WithReact {
    this._routes[path] = { path, view: file, layout: layoutName }
    return this
  }

  /**
   * Renders the page (for server)
   */
  render(pathname: string): string {
    // Must create a mock window object for components that might need it
    if (global && typeof global.window === 'undefined') {
      //@ts-ignore im not sure how to do this in ts... my bad.
      global.window = {};
    }

    //get router props
    const routerProps = { location: pathname, context: {} }
    //get the app props (like routes)
    const appProps = Object.assign({}, this._appProps);
    for (const name in appProps) {
      appProps[name] = require(appProps[name]);
    }
    //add routes to app props
    appProps.routes = this.load();

    const page = this._page.clone;

    //get the path match
    const match = this.match(pathname);
    if (typeof match === 'string') {
      //determine the name (same as develop/webpack entry)
      let name = this.entryFileName(match);
      page.build = `/.build/scripts/${name}.js`;
    }

    //wrap the app
    const App = require(this._app);
    const Router = React.createElement(
      StaticRouter,
      routerProps,
      React.createElement(App.default || App, appProps)
    );
    //render the app now
    const app = ReactDOMServer.renderToString(Router);
    
    return page.render(app);
  }

  /**
   * Renders the page (for server)
   */
  renderWithChunks(pathname: string): string {
    // Must create a mock window object for components that might need it
    if (global && typeof global.window === 'undefined') {
      //@ts-ignore im not sure how to do this in ts... my bad.
      global.window = {};
    }

    //get router props
    const routerProps = { location: pathname, context: {} }
    //get the app props (like routes)
    const appProps = Object.assign({}, this._appProps);
    for (const name in appProps) {
      appProps[name] = require(appProps[name]);
    }
    //add routes to app props
    appProps.routes = this.load();

    const page = this._page.clone;

    const chunkConfig: ChunkExtractorOptions = { 
      statsFile: path.join(this._cwd, '/.build/stats.json'),
      publicPath: '/.build'
    }

    //get the path match
    const match = this.match(pathname);
    if (typeof match === 'string') {
      //determine the name (same as develop/webpack entry)
      let name = this.entryFileName(match);
      chunkConfig.entrypoints = [ path.join('scripts', name) ];
    }

    //now do the loadable chunking thing..
    //see: https://loadable-components.com/docs/server-side-rendering/
    const extractor = new ChunkExtractor(chunkConfig);

    //wrap the app
    const App = require(this._app);
    const Router = React.createElement(
      StaticRouter,
      routerProps,
      React.createElement(App.default || App, appProps)
    );
    //render the app now
    const app = ReactDOMServer.renderToString(
      extractor.collectChunks(Router)
    );

    //add links to head
    extractor.getLinkElements().forEach(link => {
      page.head.addChild(link);
    });

    //add styles to head
    extractor.getStyleElements().forEach(style => {
      page.head.addChild(style);
    });

    //add scripts to body
    extractor.getScriptElements().forEach(script => {
      page.body.addChild(script);
    });
    
    return page.render(app);
  }

  /**
   * Route handler
   */
  handle = (request: Request, response: Response): void => {
    const path = this.match(request.pathname)
    if (!path) {
      return
    }

    response.headers('Content-Type', 'text/html')
    response.body = this.renderWithChunks(request.pathname)
  }

  match(pathname: string): string|null {
    for (const path in this._routes) {
      if (matchPath(pathname, { path, exact: true })) {
        return path
      }
    }

    return null
  }
}

export type StringRoute = { 
  path: string, 
  view: string,
  layout: string 
};

export type ComponentRoute = { 
  path: string, 
  view: ComponentType , 
  layout: ComponentType 
};
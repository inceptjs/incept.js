import path from 'path';
import React, { ComponentType } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import { StaticRouter, matchPath } from 'react-router';
import { Request, Response } from '@inceptjs/framework';

import { Application } from '../types/Application';
import Exception from './Exception';
import Page from './Page';

export default class WithReact {
  /**
   * The app instance
   */
  public _application: Application;

  /**
   * The file path to the App component
   */
  protected _app: string = '';

  /**
   * The page component
   */
  protected _page: Page;

  /**
   * The props for the App componennt
   */
  protected _props: Record<string, string> = {};

  /**
   * Mapping of name to layouts
   */
  protected _layouts: Record<string, string> = {};

  /**
   * Mapping of path to route file path
   */
  protected _routes: Record<string, StringRoute> = {};

  /**
   * Returns the current HTML Document
   */
  get page() {
    return this._page;
  }

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
  set app(app: string) {
    const resolved = this._application.withVirtualFS.resolvePath(app);
    Exception.require(!!resolved, 'Module not found %s', app);
    this._app = resolved as string;
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
  constructor(app: Application) {
    this._application = app;
    //make a virtual cwd
    app.withVirtualFS.mkdirSync(app.cwd, { recursive: true });
    //set a default app
    this.app = path.normalize(
      path.join(__dirname, './Page/App')
    );
    //set a default layout
    this._layouts.default = path.normalize(
      path.join(__dirname, './Page/Layout')
    );
    //set a default page
    this._page = this.makePage();
  }

  /**
   * sets a config file
   */
  config(name: string, file: string): WithReact {
    this._props[name] = file
    return this
  }

  /**
   * Generates code to use for virtual entries
   */
  compile(): Record<string, any> {
    const importClause = `import %s from '%s'`;
    const loadableClause = 'const %s = loadable('
      + '_ => import(/* webpackChunkName: '
      + `'%s' */'%s'))`;
    const routes = this.routes;
    const loadables = [];
    const exports = Object.keys(this._props);
    const imports = exports.map(name => importClause
      .replace('%s', name)
      .replace('%s', this._props[name])
    );
    //generate routes
    let routesJson = JSON.stringify(this.routes);
    //change route paths to object references
    for (let i = 0; i < routes.length; i++) {
      const { view } = routes[i];
      routesJson = routesJson.replaceAll(`"${view}"`, `Route_${i + 1}`);
      loadables.push(
        loadableClause
          .replace('%s', `Route_${i + 1}`)
          .replace('%s', view
            .replaceAll('/', '_')
            .replaceAll('.', '_')
            .replace(/^_*/, '')
          )
          .replace('%s', view)
      );
    }
    //change layout paths to object references
    for (const name in this._layouts) {
      loadables.push(loadableClause
        .replace('%s', `Layout_${name}`)
        .replace('%s', this._layouts[name]
          .replaceAll('/', '_')
          .replaceAll('.', '_')
          .replace(/^_*/, '')
        )
        .replace('%s', this._layouts[name])
      );
      
      //change from name to actual object reference
      routesJson = routesJson.replaceAll(
        `"layout":"${name}"`, 
        `"layout":Layout_${name}`
      );
    }
    //change missing layouts to default object reference
    for (let i = 0; i < routes.length; i++) {
      const { layout } = routes[i];
      if (!this._layouts[layout]) {
        //change from name to actual object reference
        routesJson = routesJson.replaceAll(
          `"layout":"${name}"`, 
          `"layout":Layout_default`
        );
      }
    }
    exports.push('routes');
    const app = this._app;
    return { app, imports, exports, loadables, routesJson };
  }

  /**
   * Route handler
   */
  handle = (request: Request, response: Response): void => {
    //let anything override the default behaviour
    if (typeof response.body === 'string' 
      || typeof response.body?.pipe === 'function'
    ) {
      return;
    }
    //if no matching react routes
    if (!this.match(request.pathname)) {
      return;
    }
    response.headers('Content-Type', 'text/html');
    response.write(this.render(request.pathname));
  }

  /**
   * Defines a new layout
   */
  layout(name: string, file: string): WithReact {
    const resolved = this._application.withVirtualFS.resolvePath(file);
    Exception.require(!!resolved, 'Module not found %s', file);
    this._layouts[name] = resolved as string;
    return this;
  }

  /**
   * Returns a new page that developers can manipulate 
   * and send back using `ReactPlugin.page = page`
   */
  makePage(props: Record<string, any> = {}): Page {
    const page = new Page

    if (typeof props === 'object') {
      page.props = Object.assign({}, props)
    }
  
    return page
  }

  /**
   * Returns the matching route. Logic from `react-router`
   */
  match(pathname: string): StringRoute|null {
    for (const path in this._routes) {
      if (matchPath(pathname, { path, exact: true })) {
        return this._routes[path]
      }
    }

    return null
  }

  /**
   * Registers a route
   */
  route(
    path: string, 
    file: string, 
    layout: string = 'default'
  ): WithReact {
    const resolved = this._application.withVirtualFS.resolvePath(file);
    Exception.require(!!resolved, 'Module not found %s', file);
    const view = resolved as string;
    this._routes[path] = { path, view, layout }
    return this
  }

  /**
   * Renders the page (for server)
   */
  render(pathname: string): string {
    //get router props
    const routerProps = { location: pathname, context: {} };
    //now do the loadable chunking thing..
    //see: https://loadable-components.com/docs/server-side-rendering/
    const server = new ChunkExtractor({ 
      statsFile: path.join(
        this._application.buildPath, 
        'server/stats.json'
      )
    });
    const { default: App } = server.requireEntrypoint();
    const client = new ChunkExtractor({ 
      statsFile: path.join(
        this._application.buildPath, 
        'static/stats.json'
      ),
      publicPath: this._application.buildURL
    });

    const Router = React.createElement(
      StaticRouter,
      routerProps,
      React.createElement(App)
    );
    //render the app now
    const app = ReactDOMServer.renderToString(
      client.collectChunks(Router)
    );

    //clone the page
    const page = this._page.clone;
    //add links to head
    client.getLinkElements().forEach(link => {
      page.head.addChild(link);
    });
    //add styles to head
    client.getStyleElements().forEach(style => {
      page.head.addChild(style);
    });
    //add scripts to body
    client.getScriptElements().forEach(script => {
      page.body.addChild(script);
    });
    //render the page
    return page.render(app);
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
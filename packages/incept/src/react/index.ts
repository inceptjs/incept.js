import fs from 'fs';
import path from 'path';
import React, { ComponentType } from 'react'
import ReactDOMServer from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'
import { StaticRouter, matchPath } from 'react-router';
import { Request, Response } from '@inceptjs/framework';

import { Application } from '../types/Application';
import Page from './Page';
import { Exception } from '..';

export default class WithReact {
  /**
   * The app instance
   */
  public _application: Application;

  /**
   * The file path to the App component
   */
  protected _app: string;

  /**
   * The file path to the client entry
   */
  protected _entry: string;

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
    Exception.require(!!resolved, 'Cannot find module %s', app);
    const App = fs.readFileSync(resolved as string, 'utf8');
    const props = this._generateProps();
    this._application.withVirtualFS.writeFileSync(
      path.join(this._application.cwd, 'App.js'),
      App.replace(/\nconst props[^\n]+/g, `\n${props}\n`)
    );
    this._app = resolved as string;
  }

  /**
   * Developers can set a custom entry file
   */
  set entry(entry: string) {
    const resolved = this._application.withVirtualFS.resolvePath(entry);
    Exception.require(!!resolved, 'Cannot find module %s', entry);
    this._application.withVirtualFS.writeFileSync(
      path.join(this._application.cwd, 'entry.js'),
      fs.readFileSync(resolved as string, 'utf8')
    );
    this._entry = resolved as string;
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
    this._entry = path.normalize(
      path.join(__dirname, '../../templates/entry')
    );
    this._app = path.normalize(
      path.join(__dirname, '../../templates/App')
    );
    this._layouts.default = path.normalize(
      path.join(__dirname, '../../templates/Layout')
    );
    this._page = this.makePage();
  }

  /**
   * sets a config file
   */
  config(name: string, file: string): WithReact {
    this._props[name] = file;
    const App = fs.readFileSync(this._app as string, 'utf8');
    const props = this._generateProps();
    this._application.withVirtualFS.writeFileSync(
      path.join(this._application.cwd, 'App.js'),
      App.replace(/\nconst props[^\n]+/g, `\n${props}\n`)
    );
    return this
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
    response.body = this.render(request.pathname)
  }

  /**
   * Defines a new layout
   */
  layout(name: string, file: string): WithReact {
    this._layouts[name] = file
    return this
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
  match(pathname: string): string|null {
    for (const path in this._routes) {
      if (matchPath(pathname, { path, exact: true })) {
        return path
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
    const routerProps = { location: pathname, context: {} };

    const page = this._page.clone;

    //now do the loadable chunking thing..
    //see: https://loadable-components.com/docs/server-side-rendering/
    const extractor = new ChunkExtractor({ 
      statsFile: path.join(this._application.buildPath, 'stats.json'),
      publicPath: this._application.buildURL
    });

    //wrap the app
    const App = require(this._app);
    const Router = React.createElement(
      StaticRouter,
      routerProps,
      React.createElement(App.default || App)
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

  private _generateProps(): string {
    const importClause = `const %s = loadable(_ => import('%s'))`;
    const routes = this.routes;
    const exports = Object.keys(this._props);
    const imports = exports.map(
      name => importClause
        .replace('%s', name)
        .replace('%s', this._props[name])
    );
    //generate routes
    let routesJson = JSON.stringify(this.routes);
    for (let i = 0; i < routes.length; i++) {
      const { view } = routes[i];
      //NOTE: routes should point a full path or node module
      //change from path to actual object reference
      routesJson = routesJson.replaceAll(`"${view}"`, `Route_${i + 1}`);
      imports.push(
        importClause
          .replace('%s', `Route_${i + 1}`)
          .replace('%s', view)
      );
    }
    exports.push('routes');
    //import layouts
    for (const name in this._layouts) {
      imports.push(
        importClause
          .replace('%s', `Layout_${name}`)
          .replace('%s', this._layouts[name])
      );
      //change from name to actual object reference
      routesJson = routesJson.replaceAll(
        `"layout":"${name}"`, 
        `"layout":Layout_${name}`
      );
    }
  
    return [
      ...imports,
      `const routes = ${routesJson}`,
      `const props = { ${exports.join(', ')} }`
    ].join("\n");
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
import path from 'path';
import React, { ComponentType } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import { StaticRouter, matchPath } from 'react-router';
import { Helmet } from 'react-helmet';
import { Request, Response } from '@inceptjs/framework';

import { Application } from '../types/Application';
import Exception from './Exception';
import Document from './components/Document';

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
  protected _document: Function;

  /**
   * The props for the App componennt
   */
  protected _props: Record<string, string> = {};

  /**
   * Mapping of name to layouts
   */
  protected _layouts: Record<string, StringLayout> = {};

  /**
   * Mapping of path to route file path
   */
  protected _routes: Record<string, StringRoute> = {};

  /**
   * Developers can set a custom app
   */
  get app(): string {
    return this._app;
  }

  /**
   * Returns all the layouts
   */
  get layouts() {
    const layouts = [];
    for (const name in this._layouts) {
      layouts.push(this._layouts[name]);
    }
    return layouts;
  }

  /**
   * Returns the props as name -> file
   */
  get props(): Record<string, string> {
    return Object.assign({}, this._props);
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
  set document(document: Function) {
    this._document = document
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
      path.join(__dirname, './components/App')
    );
    //set a default layout
    this.layout('default', path.normalize(
      path.join(__dirname, './components/Layout')
    ));
    //set a default page
    this._document = Document;
  }

  /**
   * sets a config file
   */
  config(name: string, file: string): WithReact {
    this._props[name] = file
    return this
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
    response.write(this.render(request.pathname, response));
  }

  /**
   * Defines a new layout
   */
  layout(
    name: string, 
    staticPath: string, 
    serverPath?: string
  ): WithReact {
    // use virtual fs
    const vfs = this._application.withVirtualFS;
    //resolve the static path
    const resolvedStaticPath = vfs.resolvePath(staticPath);
    Exception.require(
      !!resolvedStaticPath, 
      'Module not found %s', 
      staticPath
    );
    //if no server path 
    if (!serverPath) {
      //use the static path
      serverPath = staticPath;
    }
    //resolve the server path
    const resolvedServerPath = vfs.resolvePath(serverPath);
    Exception.require(
      !!resolvedServerPath, 
      'Module not found %s', 
      serverPath
    );
    this._layouts[name] = {
      name,
      server: resolvedServerPath as string,
      static: resolvedStaticPath as string
    };
    return this;
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
  render(pathname: string, response: Response): string {
    //get router props
    const routerProps = { location: pathname, context: {} };
    //get app props
    const appProps = response.body 
      && response.body.constructor instanceof Object
      ? response.body
      : {}
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
      React.createElement(App, appProps)
    );
    //render the app now
    const app = ReactDOMServer.renderToString(
      client.collectChunks(Router)
    );
    const helmet = Helmet.renderStatic();

    //clone the document
    const document = this._document({
      App() {
        return React.createElement('div', {
          id: '__incept_root',
          dangerouslySetInnerHTML: { __html: app }
        })
      },
      title: helmet.title.toComponent(),
      meta: helmet.meta.toComponent(),
      base: helmet.base.toComponent(),
      links: [
        ...Array.from(client.getLinkElements()),
        //@ts-ignore helmet tests show it should be an array
        ...Array.from(helmet.link.toComponent())
      ],
      styles: [
        ...Array.from(client.getStyleElements()),
        //@ts-ignore helmet tests show it should be an array
        ...Array.from(helmet.style.toComponent())
      ],
      scripts: [
        ...Array.from(client.getScriptElements()),
        //@ts-ignore helmet tests show it should be an array
        ...Array.from(helmet.script.toComponent())
      ],
    });

    const markup = ReactDOMServer.renderToStaticMarkup(document)
    return `<!DOCTYPE html>${markup}`
  }
}

export type StringRoute = { 
  path: string, 
  view: string,
  layout: string 
};

export type StringLayout = { 
  name: string, 
  static: string,
  server: string 
};

export type ComponentRoute = { 
  path: string, 
  view: ComponentType , 
  layout: ComponentType 
};
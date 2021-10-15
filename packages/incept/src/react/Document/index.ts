import { ReactElement } from 'react'
import ReactIs from 'react-is'
import ReactDOMServer from 'react-dom/server'

import Element from './Element'
import Head from './components/Head'
import Body from './components/Body'
import Html from './components/Html'

import Exception from '../Exception'

/**
 * Page that can be configired and rendered 
 * to an HTML document string
 */
export default class Document {
  /**
   * The build file to include
   */
  protected _build: string|null = null;

  /**
   * The HTML tag props
   */
  protected _htmlProps: Record<string, any> = {};

  /**
   * The page title
   */
  protected _title: string = '';

  /**
   * The head element support class
   */
  public head: Element = new Element;

  /**
   * The body element support class
   */
  public body: Element = new Element;

  /**
   * Returns a cloned page
   */
   get clone() {
    const page = new Document;
    page._build = this._build;
    page._htmlProps = { ...this._htmlProps };
    page._title = this._title;
    page.head = this.head.clone;
    page.body = this.body.clone;
    return page;
  }

  /**
   * Sets build path
   */
  set build(path: string) {
    Exception.require(
      typeof path === 'string', 
      'Value assigned to `title` is not a string'
    );
    this._build = path;
  }
  
  /**
   * Sets the html props
   */
  set props(props: Record<string, any>) {
    Exception.require(
      typeof props === 'object', 
      'Value assigned to `props` is not an object'
    );
    this._htmlProps = props;
  }

  /**
   * Sets page title
   */
  set title(title: string) {
    Exception.require(
      typeof title === 'string', 
      'Value assigned to `title` is not a string'
    );
    this._title = title;
  }

  /**
   * Sets the head, body and props
   */
  render(app: ReactElement|string): string {
    Exception.require(
      typeof app === 'string' || ReactIs.isElement(app), 
      'Argument 1 expected ReactElement or string (rendered app)'
    );

    if (ReactIs.isElement(app)) {
      app = ReactDOMServer.renderToString(app);
    }

    const head = {
      title: this._title,
      props: this.head.props,
      children: this.head.children
    };
    const body = {
      app: app,
      build: this._build || null,
      props: this.body.props,
      children: this.body.children
    };

    const html = Html({ 
      Head: Head(head), 
      Body: Body(body), 
      props: this._htmlProps
    })

    const markup = ReactDOMServer.renderToStaticMarkup(html)
    return `<!DOCTYPE html>${markup}`
  }
}
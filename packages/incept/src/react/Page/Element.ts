import { ReactElement, ReactNode } from 'react'
import ReactIs from 'react-is'

import Exception from '../Exception'

type GenericObject = { [key: string]: any };

/**
 * Helper for page to manage the Head and body configuration
 */
export default class Element {
  /**
   * Attributes for the element
   */
  protected _props: GenericObject = {};

  /**
   * Children of the element
   */
  protected _children: ReactNode[] = [];

  /**
   * Returns element children
   */
   get children(): ReactNode[] {
    return Array.from(this._children);
  }

  /**
   * Returns a cloned element
   */
  get clone() {
    const element = new Element;
    element._props = { ...this._props };
    element._children = Array.from(this._children);
    return element;
  }

  /**
   * Returns element props
   */
  get props(): GenericObject {
    return Object.assign({}, this._props);
  }

  /**
   * Sets element props
   */
  set props(props: GenericObject) {
    Exception.require(
      typeof props === 'object', 
      'Value assigned to `props` is not an object'
    );
    this._props = props;
  }

  /**
   * Adds a React Element Child
   */
  addChild(child: ReactElement): Element {
    Exception.require(
      ReactIs.isElement(child), 
      'Argument 1 expected React.Element'
    );
    this._children.push(child);
    return this;
  }
}
/**
 * Sample Descriptors
 * 
 * Property { value: 42, writable: true, enumerable: true, configurable: true }
 * Function { value: foo() { return 'bar' }, writable: true, enumerable: true, configurable: true }
 * Getter { get: get foo() { return 'bar' }, set: undefined, enumerable: true, configurable: true }
 * Setter { get: undefined, set: set foo() { this._foo = bar }, enumerable: true, configurable: true }
 */

/**
 * Properties which should not be considered as custom methods
 */
const nativeObjectProperties = [
  'constructor',
  '__proto__',
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'get__proto__',
  'set__proto__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  'toLocaleString'
];

const nativeFunctionProperties = [
  'caller', 
  'callee', 
  'arguments',
  'apply', 
  'bind', 
  'call',
  ...nativeObjectProperties
];

/**
 * Reflection analyzes and dynamically manipulates definitions 
 */
export default class Reflection {
  /**
   * Merges an object to another object, 
   * also considering class instances
   */
  static assign(
    destination: Record<string, any>, 
    ...sources: Record<string, any>[]
  ): Record<string, any> {
    for (const source of sources) {
      const properties = this.getPrototypeOf(source);
      if (!properties.length) {
        Object.assign(destination, source);
        continue;
      }
    
      properties.forEach(property => {
        const descriptor = Object.getOwnPropertyDescriptor(
          source, 
          property
        );
        
        if (typeof descriptor !== 'object') {
          destination[property] = source[property];
          return;
        }
        
        Object.defineProperty(destination, property, descriptor);
      });
    }
    
    return destination;
  }

  /**
   * Returns a shallow copy of an object
   */
  static clone(object: Record<string, any>): Record<string, any> {
    return this.assign({}, object);
  }

  /**
   * Extends a class with other classes
   */
  static extends(destination: Function, ...sources: Function[]) {
    sources = sources.map(source => source.prototype);
    return this.assign(destination.prototype, ...sources);
  }

  /**
   * Filters elements in objects
   */
  static filter(
    destination: Record<string, any>, 
    callback: Function
  ): Record<string, any> {
    Reflection.getPrototypeOf(destination).forEach(property => {
      if (!callback(destination[property], property)) {
        delete destination[property];
      }
    });

    return destination;
  }

  /**
   * Returns the argument clause of a function
   */
  static getArgumentNamesOf(definition: Function): string[] {
    if (typeof definition !== 'function') {
      return [];
    }

    let clause = definition.toString();
    if (clause.indexOf('function') !== 0) {
      clause = 'function ' + clause;
    }

    if (!clause || !clause.length) {
      return [];
    }

    const matches = clause
      .replace(/[\r\n\s]+/g, ' ')
      .match(/(?:function\s*\w*)?\s*(?:\((.*?)\)|([^\s]+))/);

    if (!matches) {
      return [];
    }
    
    const names = matches
      .slice(1,3)
      .join('')
      .split(/\s*,\s*/);

    if (names.length === 1 && names[0] === '') {
      names.pop();
    }

    return names;
  }

  /**
   * Returns all methods of the given definition. 
   * Not setters and getters.
   */
  static getMethodNamesOf(
    definition: Definable, 
    force: boolean = false
  ): string[] {
    //if defintion is a function
    if (!force && typeof definition === 'function') {
      //make it into an object
      definition = definition.prototype;
    }

    return this.getPrototypeOf(definition, force).filter(
      //@ts-ignore TS says that `definition` could be a function
      // and thus would not have an any property, but i cased
      // for definition being a function above. Plus, it's 
      // possible for a function to have properties as this is 
      // JavaScript...
      method => typeof definition[method] === 'function'
    );
  }

  /**
   * Returns all properties of the given definition
   */
  static getPropertyNamesOf(
    definition: Definable, 
    force: boolean = false
  ): string[] {
    //if defintion is a function
    if (!force && typeof definition === 'function') {
      //make it into an object
      definition = definition.prototype;
    }

    return this.getPrototypeOf(definition, force).filter(
      //@ts-ignore TS says that `definition` could be a function
      // and thus would not have an any property, but i cased
      // for definition being a function above. Plus, it's 
      // possible for a function to have properties as this is 
      // JavaScript...
      method => typeof definition[method] !== 'function'
    );
  }

  /**
   * Returns all properties and methods of the given definition.
   * Not class variables (js quirk)
   */
  static getPrototypeOf(
    definition: Definable, 
    force: boolean = false
  ): string[] {
    if (!force && typeof definition === 'function') {
      definition = definition.prototype;
    }

    const properties: Set<string> = new Set();
    let prototype = definition;
    do {
      Object.getOwnPropertyNames(prototype)
        .filter(method => {
          if (typeof definition === 'function') {
            return nativeFunctionProperties.indexOf(method) === -1;
          }
          return nativeObjectProperties.indexOf(method) === -1;
        })
        .map(method => properties.add(method));
    } while(prototype = Object.getPrototypeOf(prototype));
    const keys = Array.from(properties.values());
    return [...keys];
  }

  /**
   * Checks to see if child implements all the methods of a parent
   */
  static implements = function(
    child: Record<string, any>, 
    ...parents: Definable[]
  ): boolean {
    //if class
    if (typeof child === 'function') {
      //the test is against its prototype
      child = child.prototype;
    }

    for (let parent of parents) {
      //if class
      if (typeof parent === 'function') {
        //try native instanceof
        if (child instanceof parent) {
          continue;
        }

        //the test is against its prototype
        parent = parent.prototype;
      }

      //loop through all parent methods
      for (const method of Reflection.getMethodNamesOf(parent)) {
        //@ts-ignore if exactly the same
        if (parent[method] === child[method]) {
          continue;
        }

        //if child does not have this
        if (typeof child[method] !== 'function') {
          return false;
        }

        //if the arguments are not the same
        const childClause = Reflection
          .getArgumentNamesOf(child[method])
          .join(', ');
        const parentClause = Reflection
          //@ts-ignore
          .getArgumentNamesOf(parent[method])
          .join(', ');

        if (childClause !== parentClause) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Returns true if the definition is a class or not
   */
  static isClass(definition: Function): boolean {
    const clause = definition.toString();
    return clause.indexOf('class') === 0
      || clause.indexOf('_classCallCheck(this,') !== -1;
  }

  /**
   * Maps an object to itself or another
   * 
   * @param {Object} destination 
   * @param {Object} source 
   * @param {Function} callback 
   * 
   * @returns {Object}
   */
  static map(
    destination: Record<string, any>, 
    source: Record<string, any> | Function, 
    callback?: Function
  ): Record<string, any> {
    if (typeof source === 'function') {
      callback = source;
      source = destination;
    }

    Reflection.getPrototypeOf(source).forEach(property => {
      //@ts-ignore Arguments are adjustable above
      destination[property] = callback(source[property], property)
    });

    return destination;
  }

  /**
   * Returns a new Reflection instance
   */
  static reflect(definition: Definable): Reflection {
    return new Reflection(definition);
  }

  /**
   * Names/Renames a function
   * 
   * @param {Function} definition
   * @param {String} name
   *  
   * @returns {Function}
   */
  static rename(definition: Function, name: string): Function {
    Object.defineProperty(definition, 'name', { value: name});
    return definition;
  }

  public definition: Definable;

  /**
   * Sets the definition
   */
  constructor(definition: Definable) {
    this.definition = definition;
  }

  /**
   * Merges an object to another object, 
   * also considering class instances
   */
  assign(...sources: Record<string, any>[]): Reflection {
    Reflection.assign(this.definition, ...sources);
    return this;
  }

  /**
   * Returns a shallow copy of an object
   */
  clone(): Record<string, any> {
    return Reflection.clone(this.definition);
  }

  /**
   * Extends a class with other classes
   */
  extends(...sources: Function[]): Reflection {
    Reflection.extends(this.definition as Function, ...sources);
    return this;
  }

  /**
   * Filters elements in objects
   */
  filter(callback: Function): Reflection {
    Reflection.filter(this.definition, callback);
    return this;
  }

  /**
   * Returns the definition
   */
  get(): Definable {
    return this.definition;
  }

  /**
   * Returns the argument clause of a function
   */
  getArgumentNames(): string[] {
    return Reflection.getArgumentNamesOf(this.definition as Function);
  }

  /**
   * Returns all methods of the given definition. 
   * Not setters and getters.
   */
  getMethodNames(force: boolean): string[] {
    return Reflection.getMethodNamesOf(this.definition, force);
  }

  /**
   * Returns all properties of the given definition
   */
  getPropertyNames(force: boolean): string[] {
    return Reflection.getPropertyNamesOf(this.definition, force);
  }

  /**
   * Returns all properties and methods of the given definition.
   * Not class variables (js quirk)
   */
  getPrototype(force: boolean): string[] {
    return Reflection.getPrototypeOf(this.definition, force);
  }

  /**
   * Checks to see if child implements all the methods of a parent
   */
  implements(...parents: Definable[]): boolean {
    return Reflection.implements(this.definition, ...parents);
  }

  /**
   * Returns true if the definition is a class or not
   */
  isClass(): boolean {
    return Reflection.isClass(this.definition as Function);
  }

  /**
   * Maps an object to itself or another
   */
  map(
    source: Record<string, any>|Function, 
    callback?: Function
  ): Reflection {
    Reflection.map(this.definition, source, callback);
    return this;
  }

  /**
   * Names/Renames a function
   */
  rename(name: string): Reflection {
    Reflection.rename(this.definition as Function, name);
    return this;
  }
}

export type Definable = Function | Record<string, any>;
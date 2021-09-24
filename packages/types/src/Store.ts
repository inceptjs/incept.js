type Index = string|number;
type GenericObject = { [key: string]: any };

/**
 * Store are designed to easily manipulate data in
 * preparation to integrate with any multi dimensional
 * data store.
 */
export default class Store {
  /**
   * The raw data
   */
  public data: GenericObject;

  /**
   * Parser for terminal args
   */
  public withArgs: Args;

  /**
   * Parser for path notations
   */
  public withPath: Path;

  /**
   * Parser for query string
   */
  public withQuery: Query;

  /**
   * Sets the initial data
   */
  constructor(data: GenericObject = {}) {
    this.data = data;
    this.withArgs = new Args(this);
    this.withPath = new Path(this);
    this.withQuery = new Query(this);
  }

  /**
   * Loops though the data of a specified path
   */
  async each(...path: any[]): Promise<boolean> {
    const callback = path.pop() as Function;
    let list = this.get(...path);

    if (!list
      || Array.isArray(list) && !list.length
      || typeof list === 'string' && !list.length
      || typeof list === 'object' && !Object.keys(list).length
    ) {
      return false;
    }

    for(let key in list) {
      if ((await callback(list[key], key)) === false) {
        return false;
      }
    }

    return true;
  }

  /**
   * Retrieves the data stored specified by the path
   */
  get(...path: Index[]): any {
    if (!path.length) {
      return this.data;
    }

    if (!this.has(...path)) {
      return null;
    }

    const last = path.pop() as Index;
    let pointer = this.data;

    path.forEach(step => pointer = pointer[step]);

    return pointer[last]
  }

  /**
   * Returns true if the specified path exists
   */
  has(...path: Index[]): boolean {
    if (!path.length) {
      return false;
    }

    let found = true;
    const last = path.pop() as Index;
    let pointer = this.data;

    path.forEach(step => {
      if (!found) {
        return;
      }

      if (typeof pointer[step] !== 'object') {
        found = false;
        return;
      }

      pointer = pointer[step];
    });

    return !(!found || typeof pointer[last] === 'undefined');
  }

  /**
   * Removes the data from a specified path
   */
  remove(...path: Index[]): Store {
    if (!path.length) {
      return this;
    }

    if (!this.has(...path)) {
      return this;
    }

    const last = path.pop() as Index;
    let pointer = this.data;

    path.forEach(step => {
      pointer = pointer[step];
    })

    delete pointer[last];

    return this;
  }

  /**
   * Sets the data of a specified path
   */
  set(...path: any[]): Store {
    if (path.length < 1) {
      return this;
    }

    if (typeof path[0] === 'object') {
      Object.keys(path[0]).forEach(key => {
        this.set(key, path[0][key]);
      });

      return this;
    }

    const value = path.pop();
    let last = path.pop(), pointer = this.data;

    path.forEach((step, i) => {
      if (step === null || step === '') {
        path[i] = step = Object.keys(pointer).length;
      }

      if (typeof pointer[step] !== 'object') {
        pointer[step] = {};
      }

      pointer = pointer[step];
    });

    if (last === null || last === '') {
      last = Object.keys(pointer).length;
    }

    pointer[last] = value;

    //loop through the steps one more time fixing the objects
    pointer = this.data;
    path.forEach((step) => {
      const next = pointer[step]
      //if next is not an array and next should be an array
      if (!Array.isArray(next) && shouldBeAnArray(next)) {
        //transform next into an array
        pointer[step] = makeArray(next);
      //if next is an array and next should not be an array
      } else if (Array.isArray(next) && !shouldBeAnArray(next)) {
        //transform next into an object
        pointer[step] = makeObject(next);
      }

      pointer = pointer[step];
    });

    return this;
  }
}

class Args {
  /**
   * The main store
   */
  public store: Store;

  /**
   * Sets the store 
   */
  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Creates the name space given the space
   * and sets the value to that name space
   */
  set(...path: any[]): Store {
    if (path.length < 1) {
      return this.store;
    }

    let skip = path.pop();
    if (typeof skip !== 'number') {
      path.push(skip);
      skip = 0;
    }

    let args = path.pop();
    if (typeof args === 'string') {
      args = args.split(' ');
    }

    let key, index = 0, i = skip, j = args.length;
    for (; i < j; i++) {
      const arg = args[i];
      const equalPosition = arg.indexOf('=');
      // --foo --bar=baz
      if (arg.substr(0, 2) === '--') { 
        // --foo --foo baz
        if (equalPosition === -1) {
          key = arg.substr(2);
          // --foo value
          if ((i + 1) < j && args[i + 1][0] !== '-') {
            this.format(path, key, args[i + 1]);
            i++;
            continue;
          }
          // --foo
          this.format(path, key, true);
          continue;
        }

        // --bar=baz
        this.format(
          path,
          arg.substr(2, equalPosition - 2), 
          arg.substr(equalPosition + 1)
        );
        continue;
      } 

      // -k=value -abc
      if (arg.substr(0, 1) === '-') {
        // -k=value
        if (arg.substr(2, 1) === '=') {
          this.format(path, arg.substr(1, 1), arg.substr(3));
          continue;
        }

        // -abc
        const chars = arg.substr(1);
        for (let k = 0; k < chars.length; k++) {
          key = chars[k];
          this.format(path, key, true);
        }

        // -a value1 -abc value2
        if ((i + 1) < j && args[i + 1][0] !== '-') {
          this.format(path, key, args[i + 1], true);
          i++;
        }

        continue;
      }

      if (equalPosition !== -1) {
        this.format(
          path,
          arg.substr(0, equalPosition), 
          arg.substr(equalPosition + 1)
        );
        continue;
      }

      if (arg.length) {
        // plain-arg
        this.format(path, index++, arg);
      }
    }
    
    return this.store;
  }

  /**
   * Determines whether to set or push 
   * formatted values to the store
   */
  format(
    path: Index[], 
    key: Index, 
    value: any, 
    override?: boolean
  ): Store {
    //parse value
    switch (true) {
      case typeof value !== 'string':
        break;
      case value === 'true':
        value = true;
        break;
      case value === 'false':
        value = false;
        break;
      case !isNaN(parseFloat(value)):
        value = parseFloat(value);
        break;
      case !isNaN(parseInt(value)):
        value = parseInt(value);
        break;
    }

    if (path.length) {
      key = path.join('.') + '.' + key;
    }

    key = String(key);

    const withPath = this.store.withPath;

    //if it's not set yet
    if (!withPath.has(key) || override) {
      //just set it
      withPath.set(key, value);
      return this.store;
    }

    //it is set
    const current = withPath.get(key);
    //if it's not an array
    if (!Array.isArray(current)) {
      //make it into an array
      withPath.set(key, [current, value]);
      return this.store;
    }

    //push the value
    current.push(value);
    withPath.set(key, current);
    return this.store;
  }
}

class Path {
  /**
   * The main store
   */
  public store: Store;

  /**
   * Sets the store 
   */
  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Gets a value given the path in the store.
   */
  async each(
    notation: string, 
    callback: Function, 
    separator: string = '.'
  ): Promise<boolean> {
    const path = notation.split(separator);
    return await this.store.each(...path, callback);
  }

  /**
   * Gets a value given the path in the store.
   */
  get(notation: string, separator: string = '.'): any {
    const path = notation.split(separator);
    return this.store.get(...path);
  }

  /**
   * Checks to see if a key is set
   */
  has(notation: string, separator: string = '.'): boolean {
    const path = notation.split(separator);
    return this.store.has(...path);
  }

  /**
   * Removes name space given notation
   */
  remove(notation: string, separator: string = '.'): Store {
    const path = notation.split(separator);
    return this.store.remove(...path);
  }

  /**
   * Creates the name space given the space
   * and sets the value to that name space
   */
  set(notation: string, value: any, separator: string = '.'): Store {
    const path = notation.split(separator);
    return this.store.set(...path, value);
  }
}

class Query {
  /**
   * The main store
   */
  public store: Store;

  /**
   * Sets the store 
   */
  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Creates the name space given the space
   * and sets the value to that name space
   */
  set(...path: any[]): Store {
    if (path.length < 1) {
      return this.store;
    }

    const query = path.pop();

    const separator = '~~' + Math.floor(Math.random() * 10000) + '~~';
    query.split(/\&/gi).forEach((filter: any) => {
      //key eg. foo[bar][][baz]
      const [key, value] = filter.split('=', 2);
      //change path to N notation
      const keys = key
        .replace(/\]\[/g, separator)
        .replace('[', separator)
        .replace(/\[/g, '')
        .replace(/\]/g, '')
        .split(separator);

      keys.map((key: any) => {
        const index = parseInt(key);
        //if its a possible integer
        if (!isNaN(index) && key.indexOf('.') === -1) {
          return index;
        }

        return key;
      })

      const paths = path.concat(keys);

      if (/(^\{.*\}$)|(^\[.*\]$)/.test(value)) {
        try {
          return query.set(...paths, JSON.parse(value));
        } catch(e) {}
      }

      if (!isNaN(parseFloat(value))) {
        this.store.set(...paths, parseFloat(value));
      } else if (value === 'true') {
        this.store.set(...paths, true);
      } else if (value === 'false') {
        this.store.set(...paths, false);
      } else if (value === 'null') {
        this.store.set(...paths, null);
      } else {
        this.store.set(...paths, value);
      }
    });

    return this.store;
  }
}

/**
 * Transforms an object into an array
 */
function makeArray(object: GenericObject): any[] {
  const array: any[] = [];
  const keys = Object.keys(object);
  
  keys.sort();
  
  keys.forEach(function(key) {
    array.push(object[key]);
  })

  return array;
}

/**
 * Transforms an array into an object
 */
function makeObject(array: any[]): GenericObject {
  return Object.assign({}, array);
}

/**
 * Returns true if object keys is all numbers
 */
function shouldBeAnArray(object: GenericObject): boolean {
  if (typeof object !== 'object') {
    return false;
  }

  const length = Object.keys(object).length

  if (!length) {
    return false;
  }

  for (let i = 0; i < length; i++) {
    if (typeof object[i] === 'undefined') {
      return false;
    }
  }

  return true;
}
import Statuses, { Status } from './Statuses';
import TaskQueue, { Task, Queue } from './TaskQueue';
import Exception from './Exception';

/**
 * Allows the ability to listen to events made known by another
 * piece of functionality. Events are items that transpire based
 * on an action. With events you can add extra functionality
 * right after the event has triggered.
 */
export default class EventEmitter<Args extends any[]> {
  /**
   * A listener map to task queues
   */
  public readonly listeners: Record<string, Task<Args>[]> = {};

  /**
   * Static event data analyzer
   */
  public event: Event<Args> = {
    event: 'idle',
    pattern: 'idle',
    parameters: []
  };
 
  /**
   * Event regular expression map
   */
  protected regexp: string[] = [];

  /**
   * Returns a new task queue (defined like this so it can be overloaded)
   */
  static makeQueue<Args extends any[]>() {
    return new TaskQueue<Args>();
  }

  /**
   * Calls all the callbacks of the given event passing the given arguments
   */
  async emit(event: string, ...args: Args) {
    Exception.require(
      typeof event === 'string', 
      'Argument 1 expected String'
    );

    const matches = this.match(event);

    //if there are no events found
    if (!Object.keys(matches).length) {
      //report a 404
      return Statuses.NOT_FOUND;
    }

    const queue = EventEmitter.makeQueue<Args>();

    Object.keys(matches).forEach((key: string) => {
      const match = matches[key];
      const event = match.pattern;
      //if no direct observers
      if (typeof this.listeners[event] === 'undefined') {
        return;
      }

      //add args on to match
      match.args = args;

      //then loop the observers
      this.listeners[event].forEach(listener => {
        queue.add(async (...args) => {
          //set the current
          this.event = Object.assign({}, match, listener);
          //if this is the same event, call the 
          //method, if the method returns false
          return await listener.callback(...args);
        }, listener.priority)
      })
    })

    //call the callbacks
    return await queue.run(...args);
  }

  /**
   * Calls all the callbacks of the given event passing the given arguments
   */
  emitSync(event: string, ...args: Args) {
    Exception.require(
      typeof event === 'string', 
      'Argument 1 expected String'
    );

    const matches = this.match(event);

    //if there are no events found
    if (!Object.keys(matches).length) {
      //report a 404
      return Statuses.NOT_FOUND;
    }

    const queue = EventEmitter.makeQueue<Args>();

    Object.keys(matches).forEach((key: string) => {
      const match = matches[key];
      const event = match.pattern;
      //if no direct observers
      if (typeof this.listeners[event] === 'undefined') {
        return;
      }

      //add args on to match
      match.args = args;

      //then loop the observers
      this.listeners[event].forEach(listener => {
        queue.add((...args) => {
          //set the current
          this.event = Object.assign({}, match, listener);
          //if this is the same event, call the 
          //method, if the method returns false
          return listener.callback(...args);
        }, listener.priority);
      })
    })

    //call the callbacks
    return queue.runSync(...args);
  }

  /**
   * Returns a list of callbacks that will trigger when event is called
   */
  inspect(event: string): Task<Args>[] {
    Exception.require(
      typeof event === 'string', 
      'Argument 1 expected String'
    );

    const matches = this.match(event)

    //if there are no events found
    if (!Object.keys(matches).length) {
      return []
    }

    const queue = EventEmitter.makeQueue<Args>();
    Object.keys(matches).forEach(key => {
      const event = matches[key].pattern;
      //if no direct observers
      if (typeof this.listeners[event] === 'undefined') {
        return;
      }

      //then loop the observers
      this.listeners[event].forEach(listener => {
        queue.add(listener.callback, listener.priority)
      })
    })

    //return the callbacks
    return queue.tasks;
  }

  /**
   * Returns possible event matches
   */
  match(event: string): Record<string, Event<Args>> {
    Exception.require(
      typeof event === 'string', 
      'Argument 1 expected String'
    );
 
    const matches: Record<string, Event<Args>> = {};

    //first do the obvious match
    if (typeof this.listeners[event] !== 'undefined') {
      matches[event] = {
        event: event,
        pattern: event,
        parameters: []
      };
    }

    //next do the calculated matches
    this.regexp.forEach(pattern => {
      const regexp = new RegExp(
        // pattern,
        pattern.substr(
          pattern.indexOf('/') + 1,
          pattern.lastIndexOf('/') - 1
        ),
        // flag
        pattern.substr(
          pattern.lastIndexOf('/') + 1
        )
      );

      //because String.matchAll only works for global flags ...
      let match, parameters: string[];
      if (regexp.flags.indexOf('g') === -1) {
        match = event.match(regexp);
        if (!match || !match.length) {
          return;
        }

        parameters = [];
        if (Array.isArray(match)) {
          parameters = match.slice();
          parameters.shift();
        }
      } else {
        match = Array.from(event.matchAll(regexp));
        if (!Array.isArray(match[0]) || !match[0].length) {
          return;
        }

        parameters = match[0].slice();
        parameters.shift();
      }

      matches[pattern] = { event, pattern, parameters };
    })

    return matches;
  }

  /**
   * Adds a callback to the given event listener
   */
  on(
    event: Listenable, 
    callback: EventAction<Args>, 
    priority: number = 0
  ): EventEmitter<Args> {
    Exception.require( 
      typeof event === 'string'
        || Array.isArray(event)
        || event instanceof RegExp, 
      'Argument 1 expected String|RegExp (String|RegExp)[]'
    );

    Exception.require(
      typeof callback === 'function', 
      'Argument 2 expected Function'
    );

    Exception.require(
      typeof priority === 'number', 
      'Argument 3 expected Number'
    );

    //deal with multiple events
    if (Array.isArray(event)) {
      event.forEach((event) => {
        this.on(event, callback, priority)
      })

      return this
    }

    //if it is a regexp object
    if (event instanceof RegExp) {
      //make it into a string
      event = event.toString()
      //if the pattern is not registered yet
      if (this.regexp.indexOf(event) === -1) {
        //go ahead and add it
        this.regexp.push(event)
      }
    }

    //add the event to the listeners
    if (typeof this.listeners[event] === 'undefined') {
      this.listeners[event] = []
    }

    this.listeners[event].push({ priority, callback })
    return this
  }

  /**
   * Stops listening to an event
   */
  unbind(event?: string, callback?: Function): EventEmitter<Args> {
    //if there is no event and not callable
    if (!event && !callback) {
        //it means that they want to remove everything
        for (let key in this.listeners) {
          delete this.listeners[key];
        }

        return this;
    }

    const listener = (this.listeners[(event as string)]);

    //if there are callbacks listening to
    //this and no callback was specified
    if (!callback && typeof listener !== 'undefined') {
        //it means that they want to remove
        //all callbacks listening to this event
        delete this.listeners[(event as string)];
        return this;
    }

    //if there are callbacks listening
    //to this and we have a callback
    if (typeof listener !== 'undefined' && typeof callback === 'function') {
      listener.forEach((task, i) => {
        if(callback === task.callback) {
          listener.splice(i, 1);
          if (!listener.length) {
            delete this.listeners[(event as string)];
          }
        }
      });
    }

    //if no event, but there is a callback
    if (!event && typeof callback === 'function') {
      Object.keys(this.listeners).forEach(event => {
        this.listeners[event].forEach((listener, i) => {
          if(callback === listener.callback) {
            this.listeners[event].splice(i, 1);
            if (!this.listeners[event].length) {
              delete this.listeners[event];
            }
          }
        });
      });
    }

    return this;
  }

  /**
   * Allows events from other emitters to apply here
   */
  use(...emitters: EventEmitter<Args>[]): EventEmitter<Args> {
    for (let i = 0; i < emitters.length; i++) {
      const emitter = emitters[i];
      //first concat their regexp with this one
      this.regexp = this.regexp.concat(emitter.regexp);
      //next remove duplicates
      this.regexp = this.regexp.filter((v, i, a) => a.indexOf(v) === i);
      //next this listen to what they were listening to
      //event listeners = event -> TaskQueue
      for (const event in emitter.listeners) {
        const tasks = emitter.listeners[event];
        for (let j = 0; j < tasks.length; j++) {
          this.on(event, tasks[j].callback, tasks[j].priority);
        }
      }
    }
    return this;
  }
}

export interface EventAction<Args extends any[]> {
  (...args: Args): boolean|void|Promise<boolean|void>
};

/**
 * Abstraction defining what an event is
 */
export interface Event<Args extends any[]> {
  /**
   * The name of the event
   */
  event: string;

  /**
   * The regexp pattern of the event
   */
  pattern: string;

  /**
   * Parameters extracted from the pattern
   */
  parameters: string[];

  /**
   * `args` from the `emit()`
   */
  args?: any[];

  /**
   * The current callback of the event being emitted
   */
  callback?: Function;

  /**
   * The priority of the callback that is currently being emitted
   */
  priority?: number;
}

/**
 * Abstraction defining what an emitter is
 */
export interface Emitter<Args extends any[]> {
  /**
   * A listener map to task queues
   */
  listeners: Record<string, Queue<Args>>;

  /**
   * Calls all the callbacks of the given event passing the given arguments
   *
   * @param event - The name of the arbitrary event to emit
   * @param args - Any arguments to pass on to each listener mapped
   */
  emit(event: string, ...args: Args): Promise<Status>;

  /**
   * Adds a callback to the given event listener
   *
   * @param event - The name of the event to listen to
   * @param callback - The task to run when event is emitted
   * @param priority - The priority order in which call the task
   */
  on(
    event: string|string[]|RegExp, 
    callback: EventAction<Args>, 
    priority: number
  ): Emitter<Args>
}

/**
 * All things an event emitter can listen to
 */
export type Listenable = string|RegExp|(string|RegExp)[];
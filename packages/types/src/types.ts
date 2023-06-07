export type ErrorList = Record<string, string>|Record<string, string>[];

export interface Status {
  code: number, 
  message: string
}

export interface TaskRunner<Args extends any[]> {
  (...args: Args): boolean|void|Promise<boolean|void>
};

/**
 * Abstraction defining what a task is
 */
export interface Task<Args extends any[]> {
  /**
   * The task to be performed
   */
  callback: TaskRunner<Args>;

  /**
   * The priority of the task, when placed in a queue
   */
  priority: number;
}

/**
 * Abstraction defining what a queue is
 */
export interface Queue<Args extends any[]> {
  /**
   * The list of tasks to be performed
   */
  queue: Task<Args>[];

  /**
   * Adds a task to the queue
   *
   * @param callback - the task callback
   * @param priority - a number to determine the execution importance
   */
  add(callback: Function, priority: number): Queue<Args>;

  /**
   * Adds a task to the bottom of the queue
   *
   * @param callback - the task callback
   */
  push(callback: Function): Queue<Args>;

  /**
   * Adds a task to the top of the queue
   *
   * @param callback - the task callback
   */
  shift(callback: Function): Queue<Args>;

  /**
   * Runs the tasks
   *
   * @param args - any set of arguments to be passed to each task
   * @return The eventual status of the task run
   */
  run(...args: Args): Promise<number>;
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

export type FileType = {
  data: Buffer|string;
  name: string;
  type: string;
}
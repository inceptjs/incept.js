import Statuses, { Status } from './Status'
import Exception from './Exception'

/**
 * A task queue linearly executes each task
 */
export default class TaskQueue {
  /**
   * The length of the queue
   */
  public get length(): number {
    return this.tasks.length;
  }

  /**
   * The in memory task queue
   */
  public readonly tasks: Task[] = [];

  /**
   * Used when determining what is the lowest priority
   * when pushing into the queue
   */
  protected lower: number = 0;

  /**
   * Used when determining what is the lowest priority
   * when shifting into the queue
   */
  protected upper: number = 0;

  /**
   * Adds a task to the queue
   */
  add(callback: Function, priority: number = 0): TaskQueue {
    Exception.require(
      typeof callback === 'function', 
      'Argument 1 expected Function'
    );

    Exception.require(
      typeof priority === 'number', 
      'Argument 2 expected Number'
    );

    if (priority > this.upper) {
      this.upper = priority;
    } else if (priority < this.lower) {
      this.lower = priority;
    }

    //fifo by default
    this.tasks.push({ callback, priority });

    //then sort by priority
    this.tasks.sort((a, b) => {
      return a.priority <= b.priority ? 1: -1;
    })

    return this;
  }

  /**
   * Adds a task to the bottom of the queue
   */
  push(callback: Function): TaskQueue {
    Exception.require(
      typeof callback === 'function', 
      'Argument 1 expected Function'
    );
    return this.add(callback, this.lower - 1);
  }

  /**
   * Adds a task to the top of the queue
   *
   * @param {Function} callback
   *
   * @returns {TaskQueue}
   */
  shift(callback: Function): TaskQueue {
    Exception.require(
      typeof callback === 'function', 
      'Argument 1 expected Function'
    );
    return this.add(callback, this.upper + 1);
  }

  /**
   * When calling await, js looks for a then (to emulate a promise)
   * used like `await queue.add(...)`
   */
  then(callback: Function): TaskQueue {
    Exception.require(
      typeof callback === 'function', 
      'Argument 1 expected Function'
    );
    this.run().then(status => callback(status));
    return this;
  }

  /**
   * Runs the tasks
   */
  async run(...args: any[]): Promise<Status> {
    if (!this.tasks.length) {
      //report a 404
      return Statuses.NOT_FOUND;
    }

    while (this.tasks.length) {
      const task = (this.tasks.shift() as Task);
      if (await task.callback(...args) === false) {
        return Statuses.ABORT;
      }
    }

    return Statuses.OK;
  }
}

/**
 * Abstraction defining what a task is
 */
export interface Task {
  /**
   * The task to be performed
   */
  callback: Function;

  /**
   * The priority of the task, when placed in a queue
   */
  priority: number;
}

/**
 * Abstraction defining what a queue is
 */
export interface Queue {
  /**
   * The list of tasks to be performed
   */
  queue: Task[];

  /**
   * Adds a task to the queue
   *
   * @param callback - the task callback
   * @param priority - a number to determine the execution importance
   */
  add(callback: Function, priority: number): Queue;

  /**
   * Adds a task to the bottom of the queue
   *
   * @param callback - the task callback
   */
  push(callback: Function): Queue;

  /**
   * Adds a task to the top of the queue
   *
   * @param callback - the task callback
   */
  shift(callback: Function): Queue;

  /**
   * Runs the tasks
   *
   * @param args - any set of arguments to be passed to each task
   * @return The eventual status of the task run
   */
  run(...args: any[]): Promise<number>;
}
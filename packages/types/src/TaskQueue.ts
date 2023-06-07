import type { Status, Task, TaskRunner } from './types';

import Statuses from './Statuses';
import Exception from './Exception';

/**
 * A task queue linearly executes each task
 */
export default class TaskQueue<Args extends any[]> {
  /**
   * The length of the queue
   */
  public get length(): number {
    return this.tasks.length;
  }

  /**
   * The in memory task queue
   */
  public readonly tasks: Task<Args>[] = [];

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
  add(callback: TaskRunner<Args>, priority: number = 0): TaskQueue<Args> {
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
  push(callback: TaskRunner<Args>): TaskQueue<Args> {
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
  shift(callback: TaskRunner<Args>): TaskQueue<Args> {
    Exception.require(
      typeof callback === 'function', 
      'Argument 1 expected Function'
    );
    return this.add(callback, this.upper + 1);
  }

  /**
   * Runs the tasks
   */
  async run(...args: Args): Promise<Status> {
    if (!this.tasks.length) {
      //report a 404
      return Statuses.NOT_FOUND;
    }

    while (this.tasks.length) {
      const task = this.tasks.shift();
      if (task && await task.callback(...args) === false) {
        return Statuses.ABORT;
      }
    }

    return Statuses.OK;
  }

  /**
   * Runs the tasks syncronously
   */
  runSync(...args: Args): Status {
    if (!this.tasks.length) {
      //report a 404
      return Statuses.NOT_FOUND;
    }

    while (this.tasks.length) {
      const task = (this.tasks.shift() as Task<Args>);
      if (task.callback(...args) === false) {
        return Statuses.ABORT;
      }
    }

    return Statuses.OK;
  }
}
import { Exception } from '@inceptjs/types';

export default class StormException extends Exception {
  constructor(message: string) {
    super(message);
    this.name = 'StormException';
  }
}
import { Exception } from '@inceptjs/types';

export default class InceptException extends Exception {
  constructor(message: string) {
    super(message);
    this.name = 'TerminalException';
  }
};
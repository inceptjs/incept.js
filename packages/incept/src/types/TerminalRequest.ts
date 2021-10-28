import { Store, Request, RequestOptions } from '@inceptjs/framework';

export default class TerminalRequest extends Request {
  /**
   * The current working directory
   */
  protected _cwd: string;

  /**
   * The arguments
   */
  protected _argv: string[];

  /**
   * Returns the current working directory
   */
  get cwd(): string {
    return this._cwd;
  }

  /**
   * Returns the arguments
   */
   get argv(): Record<string, any> {
    return Array.from(this._argv);
  }

  /**
   * Sets the cwd and argv
   */
  constructor(cwd: string, argv: string[], init: RequestOptions = {}) {
    super(null, init);
    this._cwd = cwd;
    this._argv = argv;
  }

  /**
   * Returns the parsed args
   */
  slice(start: number = 0): Record<string, any> {
    const args = this.argv.slice(2);
    const store = new Store;
    return store.withArgs.set(args).get();
  }
}
import Exception from '../Exception';
import { Prisma } from '@prisma/client';

export default class Delete {
  /**
   * The table to delete from.
   */
  protected _table: string;

  /**
   * The filters to apply.
   */
  protected _filters: [string, (string|number)[]][] = [];

  /**
   * The character used to quote identifiers.
   */
  protected _quote: string;

  /**
   * Create a new delete query.
   */
  constructor(table: string, quote = '`') {
    this._table = table;
    this._quote = quote;
  }

  /**
   * WHERE clause
   */
  where(query: string, values: (string|number)[] = []) {
    this._filters.push([query, values]);
    return this;
  }

  /**
   * Convert the query to a string.
   */
  toParams() {
    if (!this._filters.length) {
      throw Exception.for('No filters provided');
    }

    const query: string[] = [];
    const values: (string|number)[] = [];
    const q = this._quote;
    query.push(`DELETE FROM ${q}${this._table}${q}`);

    const filters = this._filters.map(filter => {
      values.push(...filter[1]);
      return filter[0];
    }).join(' AND ');
    query.push(`WHERE ${filters}`);

    return Prisma.sql(query.join(' ').split('?'), values);
  }
}
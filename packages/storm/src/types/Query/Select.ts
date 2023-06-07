import type { Relation } from '../../types';

import Exception from '../Exception';

export type Order = 'ASC'|'DESC'|'asc'|'desc';
export type Join = 'inner'
  | 'left'
  | 'left_outer'
  | 'right'
  | 'right_outer'
  | 'full'
  | 'full_outer'
  | 'cross';

const joins = {
  inner: 'INNER',
  left: 'LEFT',
  left_outer: 'LEFT OUTER',
  right: 'RIGHT',
  right_outer: 'RIGHT OUTER',
  full: 'FULL',
  full_outer: 'FULL OUTER',
  cross: 'CROSS'
};

export default class Select {
  /**
   * The columns to select.
   */
  protected _columns: string[] = [];

  /**
   * The table to select from.
   */
  protected _table?: [string, string];

  /**
   * The relations to join.
   */
  protected _relations: Relation[] = [];

  /**
   * The character used to quote identifiers.
   */
  protected _quote: string;

  /**
   * The filters to apply.
   */
  protected _filters: [string, (string|number)[]][] = [];

  /**
   * The sort order.
   */
  protected _sort: [string, Order][] = [];

  /**
   * The range
   */
  protected _limit: number = 0;

  /**
   * The start
   */
  protected _offset: number = 0;
  
  /**
   * Create a new select query.
   */
  constructor(select: string|string[] = '*', quote = '`') {
    if (Array.isArray(select)) {
      this._columns = select;
    } else {
      this._columns = [select];
    }

    this._quote = quote;
  }

  /**
   * FROM clause
   */
  from(table: string, as?: string) {
    this._table = [table, as || table];
    return this;
  }

  /**
   * JOIN clause
   */
  join(type: string, table: string, from: string, to: string, as?: string) {
    this._relations.push({ type, table, as: as  || table, from, to });
    return this;
  }

  /**
   * WHERE clause
   */
  where(query: string, values: (string|number)[] = []) {
    this._filters.push([query, values]);
    return this;
  }

  /**
   * ORDER BY clause
   */
  order(column: string, direction: Order = 'ASC') {
    this._sort.push([column, direction]);
    return this;
  }

  /**
   * LIMIT clause
   */
  limit(limit: number) {
    this._limit = limit;
    return this;
  }

  /**
   * OFFSET clause
   */
  offset(offset: number) {
    this._offset = offset;
    return this;
  }

  /**
   * Convert the query to a string.
   */
  toParams() {
    if (!this._table) {
      throw Exception.for('No table specified');
    }

    const query: string[] = [];
    const values: (string|number)[] = [];
    const q = this._quote;

    const columns = this._columns
      .map(column => column.split(' '))
      .flat(1)
      .map(column => `${q}${column.split('.').join('`.`')}${q}`);

    query.push(`SELECT ${columns.join(', ')}`);
    if (this._table) {
      if (this._table[1] !== this._table[0]) {
        query.push(`FROM ${q}${this._table[0]}${q} AS ${q}${this._table[1]}${q}`);
      } else {
        query.push(`FROM ${q}${this._table[0]}${q}`);
      }
    }

    if (this._relations.length) {
      const relations = this._relations.map(relation => {
        const type = relation.type as Join;
        const table = relation.table !== relation.as 
          ? `${q}${relation.table}${q} AS ${q}${relation.as}${q}`
          : `${q}relation.table${q}`;
        return `${joins[type]} ${table} ON (${q}${relation.from}${q} = ${q}${relation.to}${q})`;
      });
      query.push(relations.join(' '));
    }

    if (this._filters.length) {
      const filters = this._filters.map(filter => {
        values.push(...filter[1]);
        return filter[0];
      }).join(' AND ');
      query.push(`WHERE ${filters}`);
    }

    if (this._sort.length) {
      const sort = this._sort.map((sort) => `${sort[0]} ${sort[1]}`);
      query.push(`ORDER BY ${q}${sort.join(`${q}, ${q}`)}${q}`);
    }

    if (this._limit) {
      query.push(`LIMIT ${this._limit}`);
    }

    if (this._offset) {
      query.push(`OFFSET ${this._offset}`);
    }

    return { query: query.join(' '), values };
  }
}
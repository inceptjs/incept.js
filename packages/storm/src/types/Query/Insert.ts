import Exception from '../Exception';

export default class Insert {
  /**
   * The table to delete from.
   */
  protected _table: string;

  /**
   * The values to insert.
   */
  protected _values: Record<string, any>[] = [];

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

  values(values: Record<string, any>|Record<string, any>[]) {
    if (!Array.isArray(values)) {
      values = [values];
    }

    this._values = values as Record<string, any>[];
    return this;
  }

  /**
   * Convert the query to a string.
   */
  toParams() {
    if (this._values.length === 0) {
      throw Exception.for('No values provided');
    }

    const query: string[] = [];
    const values: (string|number)[] = [];
    const q = this._quote;
    
    query.push(`INSERT INTO ${q}${this._table}${q}`);

    const keys = Object.keys(this._values[0]);
    query.push(`(${q}${keys.join(`${q}, ${q}`)}${q})`);

    const row = this._values.map((value) => {
      const row = keys.map(key => value[key]);
      values.push(...row);
      return `(${row.map(() => '?').join(', ')})`;
    });

    query.push(`VALUES ${row.join(', ')}`);
    return { query: query.join(' '), values };
  }
}
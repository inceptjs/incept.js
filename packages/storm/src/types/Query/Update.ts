import Exception from '../Exception';

export default class Update {
  /**
   * The table to delete from.
   */
  protected _table: string;

  /**
   * The data to update.
   */
  protected _data: Record<string, any> = {};

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
   * Set clause
   */
  set(data: Record<string, string|number>) {
    this._data = data;
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
   * Convert the query to a string.
   */
  toParams() {
    if (!Object.keys(this._data).length) {
      throw Exception.for('No data provided');
    }

    const query: string[] = [];
    const values: (string|number)[] = [];
    const q = this._quote;

    query.push(`UPDATE ${q}${this._table}${q}`);

    if (Object.keys(this._data).length) {
      const data = Object.keys(this._data).map(key => {
        values.push(this._data[key]);
        return `${key} = ?`;
      }).join(', ');
      query.push(`SET ${data}`);
    }

    if (this._filters.length) {
      const filters = this._filters.map(filter => {
        values.push(...filter[1]);
        return filter[0];
      }).join(' AND ');
      query.push(`WHERE ${filters}`);
    }

    return { query: query.join(' '), values };
  }
}
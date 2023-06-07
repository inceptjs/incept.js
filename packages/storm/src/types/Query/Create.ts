import type { Field } from '../../types';

import Exception from '../Exception';

export default class Create {
  /**
   * The table to create.
   */
  protected _table: string;
  
  /**
   * List of fields
   */
  protected _fields: Record<string, Field> = {};

  /**
   * List of key indexes
   */
  protected _keys: Record<string, string[]> = {};

  /**
   * List of unique keys
   */
  protected _unique: Record<string, string[]> = {};

  /**
   * List of primary keys
   */
  protected _primary: string[] = [];

  /**
   * The character used to quote identifiers.
   */
  protected _quote: string;

  constructor(table: string, quote = '`') {
    this._table = table;
    this._quote = quote;
  }

  /**
   * Add a field to the table.
   */
  public addField(name: string, field: Field) {
    this._fields[name] = field;
    return this;
  }

  /**
   * Add a key index to the table.
   */
  public addKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._keys[name] = field;
    return this;
  }

  /**
   * Add a primary key to the table.
   */
  public addPrimaryKey(name: string) {
    this._primary.push(name);
    return this;
  }

  /**
   * Add a unique key to the table.
   */
  public addUniqueKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._unique[name] = field;
    return this;
  }

  /**
   * Compile the query.
   */
  public toParams() {
    if (!this._fields.length) {
      throw Exception.for('No fields provided');
    }

    const query: string[] = [];
    const q = this._quote;

    const fields = Object.keys(this._fields).map(name => {
      const field = this._fields[name];
      const column: string[] = [];
      column.push(`${q}${name}${q}`);
      field.type && column.push(field.type);
      field.length && column.push(`(${field.length})`);
      field.attribute && column.push(field.attribute);
      field.unsigned && column.push('UNSIGNED');
      field.nullable && column.push('NOT NULL');
      field.autoIncrement && column.push('AUTO_INCREMENT');
      if (field.default) {
        if (!isNaN(Number(field.default))) {
          column.push(`DEFAULT ${field.default}`);
        } else {
          column.push(`DEFAULT '${field.default}'`);
        }
      } else if (field.nullable) {
        column.push('DEFAULT NULL');
      }

      return column.join(' ');
    }).join(', ');

    query.push(fields);
  
    if (this._primary.length) {
      query.push(`, PRIMARY KEY (${this._primary
        .map(key => `${q}${key}${q}`)
        .join(', ')})`
      );
    }

    if (this._unique.length) {
      query.push(Object.keys(this._unique).map(
        key => `, UNIQUE KEY ${q}${key}${q} (${q}${this._unique[key].join(`${q}, ${q}`)}${q})`
      ).join(', '));
    }

    if (this._keys.length) {
      query.push(Object.keys(this._keys).map(
        key => `, KEY ${q}${key}${q} (${q}${this._keys[key].join(`${q}, ${q}`)}${q})`
      ).join(', '));
    }

    return { 
      query: `CREATE TABLE IF NOT EXISTS ${this._table} (${query.join(' ')})`, 
      values: [] 
    };
  }
}
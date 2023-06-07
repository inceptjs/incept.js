import type { 
  Field, 
  AlterFields, 
  AlterKeys, 
  AlterUnqiues, 
  AlterPrimaries 
} from '../../types';

import Exception from '../Exception';

export default class Alter {
  /**
   * The table to create.
   */
  protected _table: string;
  
  /**
   * List of fields
   */
  protected _fields: AlterFields = { add: {}, update: {}, remove: [] };

  /**
   * List of key indexes
   */
  protected _keys: AlterKeys = { add: {}, remove: [] };

  /**
   * List of unique keys
   */
  protected _unique: AlterUnqiues = { add: {}, remove: [] };

  /**
   * List of primary keys
   */
  protected _primary: AlterPrimaries = { add: [], remove: [] };

  /**
   * The character used to quote identifiers.
   */
  protected _quote: string;

  /**
   * Set table
   */
  constructor(table: string, quote = '`') {
    this._table = table;
    this._quote = quote;
  }

  /**
   * Add a field to the table.
   */
  public addField(name: string, field: Field) {
    this._fields.add[name] = field;
    return this;
  }

  /**
   * Add a key index to the table.
   */
  public addKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._keys.add[name] = field;
    return this;
  }

  /**
   * Add a primary key to the table.
   */
  public addPrimaryKey(name: string) {
    this._primary.add.push(name);
    return this;
  }

  /**
   * Add a unique key to the table.
   */
  public addUniqueKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._unique.add[name] = field;
    return this;
  }

  /**
   * Update a field in the table.
   */
  public changeField(name: string, field: Field) {
    this._fields.update[name] = field;
    return this;
  }

  /**
   * Remove a field from the table.
   */
  public removeField(name: string) {
    this._fields.remove.push(name);
    return this;
  }

  /**
   * Remove a key index from the table.
   */
  public removeKey(name: string) {
    this._keys.remove.push(name)
    return this;
  }

  /**
   * Add a primary key to the table.
   */
  public removePrimaryKey(name: string) {
    this._primary.remove.push(name);
    return this;
  }

  /**
   * Remove a unique key from the table.
   */
  public removeUniqueKey(name: string) {
    this._unique.remove.push(name)
    return this;
  }

  /**
   * Compile the query.
   */
  public toParams() {
    const query: string[] = [];
    const q = this._quote;

    const removeFields = this._fields.remove.map(
      name => `DROP ${q}${name}${q}`
    );

    const addFields = Object.keys(this._fields.add).map(name => {
      const field = this._fields.add[name];
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

      return `ADD COLUMN ${column.join(' ')}`;
    });

    const changeFields = Object.keys(this._fields.update).map(name => {
      const field = this._fields.add[name];
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

      return `CHANGE COLUMN ${column.join(' ')}`;
    });

    const removePrimaries = this._primary.remove.map(
      name => `DROP PRIMARY KEY ${q}${name}${q}`
    );

    const addPrimaries = `ADD PRIMARY KEY (${q}${this._primary.remove.join(`${q}, ${q}`)}${q})`;

    const removeUniques = this._unique.remove.map(
      name => `DROP UNIQUE ${q}${name}${q}`
    );

    const addUniques = Object.keys(this._unique.add).map(
      key => `ADD UNIQUE ${q}${key}${q} (${q}${this._unique.add[key].join(`${q}, ${q}`)}${q})`
    );

    const removeKeys = this._keys.remove.map(
      name => `DROP INDEX ${q}${name}${q}`
    );

    const addKeys = Object.keys(this._keys.add).map(
      key => `ADD INDEX ${q}${key}${q} (${q}${this._unique.add[key].join(`${q}, ${q}`)}${q})`
    );

    if (!removeFields.length
      && !addFields.length
      && !changeFields.length
      && !removePrimaries.length
      && !addPrimaries.length
      && !removeUniques.length
      && !addUniques.length
      && !removeKeys.length
      && !addKeys.length
    ) {
      throw Exception.for('No alterations made.')
    }

    query.push(
      ...removeFields,
      ...addFields,
      ...changeFields,
      ...removePrimaries,
      ...addPrimaries,
      ...removeUniques,
      ...addUniques,
      ...removeKeys,
      ...addKeys
    );
    return { 
      query: `ALTER TABLE ${this._table} (${query.join(', ')})`, 
      values: [] 
    };
  }
}